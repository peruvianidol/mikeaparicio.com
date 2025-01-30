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
  return movies.length > 0 ? movies[0] : null; // Assumes movies are sorted by watchedDate
}

// Check RSS feed for new movies
async function checkForUpdates() {
  const fetch = await fetchModule();
  const response = await fetch(RSS_URL);
  const rssText = await response.text();
  const xml = new DOMParser().parseFromString(rssText, 'application/xml');

  const items = Array.from(xml.getElementsByTagName('item'));
  console.log(`Fetched ${items.length} movies from RSS feed.`);

  // Extract the most recent 5 movies for debugging
  const latestMovies = items.slice(0, 5).map(item => ({
    title: item.getElementsByTagName('letterboxd:filmTitle')[0]?.textContent,
    link: item.getElementsByTagName('link')[0]?.textContent,
    watchedDate: item.getElementsByTagName('letterboxd:watchedDate')[0]?.textContent,
  }));

  console.log("Latest Movies from RSS:", latestMovies);

  const lastLoggedMovie = getLastLoggedMovie();
  console.log("Last logged movie from movies.json:", lastLoggedMovie);

  if (!lastLoggedMovie) {
    console.log("No logged movies found. Treating all as new.");
    return true;
  }

  // Compare watchedDate instead of pubDate
  return latestMovies.some(movie => 
    movie.watchedDate && new Date(movie.watchedDate) > new Date(lastLoggedMovie.watchedDate)
  );
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
      await triggerBuild(); // Ensure this function is correctly called
    } else {
      console.log('No new movies logged.');
    }
  } catch (error) {
    console.error('Error:', error);
  }
})();