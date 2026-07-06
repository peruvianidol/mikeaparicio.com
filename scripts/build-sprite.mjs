import { readdir, readFile, writeFile, mkdir } from 'fs/promises';
import { join, basename } from 'path';

const ICONS_DIR = './_src/assets/icons';
const OUTPUT_DIR = './_site/assets';
const OUTPUT_FILE = join(OUTPUT_DIR, 'sprite.svg');

export async function buildSprite() {
  let files;
  try {
    files = await readdir(ICONS_DIR);
  } catch {
    return;
  }

  const svgFiles = files.filter(f => f.endsWith('.svg'));
  if (!svgFiles.length) return;

  let symbols = '';
  for (const file of svgFiles) {
    const id = basename(file, '.svg');
    const content = await readFile(join(ICONS_DIR, file), 'utf8');
    const viewBox = content.match(/viewBox="([^"]+)"/)?.[1] ?? '0 0 24 24';
    const inner = content.replace(/<\/?svg[^>]*>/g, '').trim();
    symbols += `  <symbol id="${id}" viewBox="${viewBox}">${inner}</symbol>\n`;
  }

  const sprite = `<svg xmlns="http://www.w3.org/2000/svg" style="display:none">\n${symbols}</svg>\n`;
  await mkdir(OUTPUT_DIR, { recursive: true });
  await writeFile(OUTPUT_FILE, sprite);
}
