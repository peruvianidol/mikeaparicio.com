require('dotenv').config(); // For environment variables like NETLIFY_BUILD_HOOK
const fs = require('fs');
const path = require('path');
const { DOMParser } = require('linkedom');

// RSS feed and file paths
const RSS_URL = 'https://letterboxd.com/peruvianidol/rss/';
const JSON_FILE = path.join(__dirname, '_src/_data/movies.json');
const NETLIFY_BUILD_HOOK = process.env.NETLIFY_BUILD_HOOK;

// Dynamically import `node-fetch` for compatibility
const fetchModule = async () => (await import('node-fetch')).default;

// Load the last logged movie
function getLastLoggedMovie() {
  if (!fs.existsSync(JSON_FILE)) return null;
  const movies = JSON.parse(fs.readFileSync(JSON_FILE, 'utf8'));
  return movies.length > 0 ? movies[0] : null; // Assumes movies are sorted by `pubDate`
}

// Check RSS feed for new movies
async function checkForUpdates() {
  const fetch = await fetchModule();
  const response = await fetch(RSS_URL);
  const rssText = await response.text();
  const xml = new DOMParser().parseFromString(rssText, 'application/xml');
  const latestItem = xml.querySelector('item');

  if (!latestItem) return false;

  const latestMovie = {
    link: latestItem.querySelector('link').textContent,
    pubDate: latestItem.querySelector('pubDate').textContent,
  };

  const lastLoggedMovie = getLastLoggedMovie();
  return !lastLoggedMovie || new Date(latestMovie.pubDate) > new Date(lastLoggedMovie.pubDate);
}

// Trigger Netlify build hook
async function triggerBuild() {
  if (!NETLIFY_BUILD_HOOK) {
    console.error('Netlify build hook URL not configured.');
    return;
  }

  const fetch = await fetchModule();
  await fetch(NETLIFY_BUILD_HOOK, { method: 'POST' });
  console.log('Netlify build triggered.');
}

// Main function
(async function main() {
  try {
    console.log('Checking for new movies...');
    if (await checkForUpdates()) {
      console.log('New movie logged. Triggering build...');
      await triggerBuild();
    } else {
      console.log('No new movies logged.');
    }
  } catch (error) {
    console.error('Error:', error);
  }
})();
