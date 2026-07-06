#!/usr/bin/env node
// scripts/standard-site-sync.mjs
//
// Creates/updates Standard.Site records on the Bluesky PDS.
// Requires ATPROTO_PASSWORD in .env (ATPROTO_HANDLE defaults to peruvianidol.com)
//
// Usage:
//   node scripts/standard-site-sync.mjs site   # create/update publication record
//   node scripts/standard-site-sync.mjs docs   # sync all posts as document records
//   node scripts/standard-site-sync.mjs list   # list all records in PDS

import { readFile, writeFile, readdir } from 'fs/promises';
import { join } from 'path';

// Load .env without a dependency
const envContent = await readFile('.env', 'utf8').catch(() => '');
for (const line of envContent.split('\n')) {
  const eqIdx = line.indexOf('=');
  if (eqIdx === -1) continue;
  const key = line.slice(0, eqIdx).trim();
  const val = line.slice(eqIdx + 1).trim();
  if (key && !process.env[key]) process.env[key] = val;
}

const HANDLE = process.env.ATPROTO_HANDLE ?? 'peruvianidol.com';
const PASSWORD = process.env.ATPROTO_PASSWORD;
const PDS = 'https://bsky.social';
const SITE_URL = 'https://mikeaparicio.com';
const POSTS_DIR = '_src/posts';
const STANDARD_SITE_FILE = '_src/_data/standardSite.json';
const DOCS_FILE = '_src/_data/standardSiteDocuments.json';
const PUBLICATION_RKEY = 'self';

if (!PASSWORD) {
  console.error('ATPROTO_PASSWORD not set in .env');
  process.exit(1);
}

// --- AT Protocol helpers ---

async function createSession() {
  const res = await fetch(`${PDS}/xrpc/com.atproto.server.createSession`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier: HANDLE, password: PASSWORD }),
  });
  if (!res.ok) throw new Error(`Auth failed: ${await res.text()}`);
  return res.json();
}

async function putRecord(jwt, did, collection, rkey, record) {
  const res = await fetch(`${PDS}/xrpc/com.atproto.repo.putRecord`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${jwt}`,
    },
    body: JSON.stringify({ repo: did, collection, rkey, record }),
  });
  if (!res.ok) throw new Error(`putRecord (${collection}/${rkey}) failed: ${await res.text()}`);
  return res.json();
}

async function listRecords(did, collection) {
  const res = await fetch(
    `${PDS}/xrpc/com.atproto.repo.listRecords?repo=${encodeURIComponent(did)}&collection=${encodeURIComponent(collection)}&limit=100`
  );
  if (!res.ok) throw new Error(`listRecords failed: ${res.status}`);
  return (await res.json()).records ?? [];
}

// --- Helpers ---

function pathToRkey(path) {
  return path
    .replace(/\/+$/, '')
    .replace(/^\/+/, '')
    .replace(/\/+/g, '.')
    .replace(/[^a-zA-Z0-9_~.:-]/g, '-');
}

function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return {};
  const data = {};
  for (const line of match[1].split('\n')) {
    const colonIdx = line.indexOf(':');
    if (colonIdx === -1) continue;
    const key = line.slice(0, colonIdx).trim();
    const val = line.slice(colonIdx + 1).trim().replace(/^["']|["']$/g, '');
    if (key) data[key] = val;
  }
  return data;
}

// --- Commands ---

async function cmdSite() {
  console.log('Creating/updating publication record...');
  const { accessJwt, did } = await createSession();

  const result = await putRecord(accessJwt, did, 'site.standard.publication', PUBLICATION_RKEY, {
    $type: 'site.standard.publication',
    url: SITE_URL,
    name: 'Mike Aparicio',
    description: 'Mike Aparicio is a design systems engineer and writer based in Chicago.',
  });

  const standardSite = JSON.parse(await readFile(STANDARD_SITE_FILE, 'utf8').catch(() => '{}'));
  standardSite.did = did;
  standardSite.publicationUri = result.uri;
  await writeFile(STANDARD_SITE_FILE, JSON.stringify(standardSite, null, 2) + '\n');
  console.log(`✓ Publication: ${result.uri}`);
}

async function cmdDocs() {
  console.log('Syncing document records...');
  const { accessJwt, did } = await createSession();

  const standardSite = JSON.parse(await readFile(STANDARD_SITE_FILE, 'utf8').catch(() => '{}'));
  if (!standardSite.publicationUri) {
    console.error('Run "node scripts/standard-site-sync.mjs site" first to create the publication record.');
    process.exit(1);
  }

  const documents = JSON.parse(await readFile(DOCS_FILE, 'utf8').catch(() => '{}'));
  const files = (await readdir(POSTS_DIR)).filter(f => f.endsWith('.md'));
  let synced = 0;

  for (const file of files) {
    const content = await readFile(join(POSTS_DIR, file), 'utf8');
    const fm = parseFrontmatter(content);

    if (!fm.title || !fm.date) {
      console.log(`  Skipping ${file} (missing title or date)`);
      continue;
    }

    const postPath = `/posts/${file.replace(/\.md$/, '')}/`;
    const rkey = pathToRkey(postPath);
    const isNew = !documents[postPath];

    const record = {
      $type: 'site.standard.document',
      site: standardSite.publicationUri,
      title: fm.title,
      publishedAt: new Date(fm.date).toISOString(),
      path: postPath,
    };
    if (fm.description) record.description = fm.description;

    const result = await putRecord(accessJwt, did, 'site.standard.document', rkey, record);
    documents[postPath] = result.uri;
    console.log(`  ${isNew ? '✓' : '↺'} ${fm.title}`);
    synced++;

    await new Promise(r => setTimeout(r, 100));
  }

  await writeFile(DOCS_FILE, JSON.stringify(documents, null, 2) + '\n');
  console.log(`\nDone. Synced ${synced} document(s).`);
}

async function cmdList() {
  const standardSite = JSON.parse(await readFile(STANDARD_SITE_FILE, 'utf8').catch(() => '{}'));
  if (!standardSite.did) {
    console.error('No publication record found. Run the "site" command first.');
    process.exit(1);
  }

  const pubRecords = await listRecords(standardSite.did, 'site.standard.publication');
  console.log(`\n[site.standard.publication] ${pubRecords.length} record(s):`);
  for (const r of pubRecords) {
    console.log(`  ${r.uri}\t${r.value.name ?? ''}`);
  }

  const docRecords = await listRecords(standardSite.did, 'site.standard.document');
  console.log(`\n[site.standard.document] ${docRecords.length} record(s):`);
  for (const r of docRecords) {
    console.log(`  ${r.value.path ?? ''}\t${r.value.title ?? ''}`);
  }
}

// --- Entry point ---
const [, , cmd] = process.argv;
switch (cmd) {
  case 'site': await cmdSite(); break;
  case 'docs': await cmdDocs(); break;
  case 'list': await cmdList(); break;
  default:
    console.error('Usage:\n  node scripts/standard-site-sync.mjs site\n  node scripts/standard-site-sync.mjs docs\n  node scripts/standard-site-sync.mjs list');
    process.exit(1);
}
