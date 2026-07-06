// netlify/functions/gaming-status.mjs
//
// Required env vars:
//   IGDB_CLIENT_ID     - from https://dev.twitch.tv/console
//   IGDB_CLIENT_SECRET - from https://dev.twitch.tv/console
//
// To update games, edit _data/games.json in your repo.

import { readFile } from "fs/promises";

const IGDB_CLIENT_ID = process.env.IGDB_CLIENT_ID;
const IGDB_CLIENT_SECRET = process.env.IGDB_CLIENT_SECRET;

import { join } from "path";

// ─── IGDB Auth ────────────────────────────────────────────────────────────────

let cachedToken = null;

async function getIgdbToken() {
  if (cachedToken && cachedToken.expiresAt > Date.now()) {
    return cachedToken.token;
  }

  const res = await fetch(
    `https://id.twitch.tv/oauth2/token?client_id=${IGDB_CLIENT_ID}&client_secret=${IGDB_CLIENT_SECRET}&grant_type=client_credentials`,
    { method: "POST" }
  );
  const json = await res.json();
  if (!json.access_token) {
    throw new Error(`IGDB auth failed: ${JSON.stringify(json)}`);
  }
  cachedToken = {
    token: json.access_token,
    expiresAt: Date.now() + (json.expires_in - 60) * 1000,
  };
  return cachedToken.token;
}

// ─── IGDB Cover Lookup ────────────────────────────────────────────────────────

async function getCover(token, title) {
  const res = await fetch("https://api.igdb.com/v4/games", {
    method: "POST",
    headers: {
      "Client-ID": IGDB_CLIENT_ID,
      "Authorization": `Bearer ${token}`,
      "Content-Type": "text/plain",
    },
    body: `search "${title}"; fields name, cover.image_id; limit 1;`,
  });

  const data = await res.json();
  if (!Array.isArray(data)) return null;
  const [game] = data;
  if (!game?.cover?.image_id) return null;

  return `https://images.igdb.com/igdb/image/upload/t_cover_big/${game.cover.image_id}.jpg`;
}

// ─── Handler ──────────────────────────────────────────────────────────────────

export const handler = async () => {
  try {
    const gamesPath = join(process.cwd(), "_src/_data/games.json");
    console.log('cwd:', process.cwd());
    console.log('gamesPath:', gamesPath);
    const games = JSON.parse(await readFile(gamesPath, "utf-8"));

    const token = await getIgdbToken();

    const results = await Promise.all(
      games.map(async (game) => ({
        ...game,
        coverUrl: await getCover(token, game.name),
      }))
    );

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=300",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ games: results, fetchedAt: new Date().toISOString() }),
    };
  } catch (err) {
    console.error('Full error:', err);
    console.log('IGDB_CLIENT_ID:', IGDB_CLIENT_ID);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
