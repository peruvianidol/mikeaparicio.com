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
  if (!fs.existsSync(JSON_FILE)) {
    console.log("🛑 movies.json not found. Creating a new one...");
    return null;
  }
  
  try {
    const movies = JSON.parse(fs.readFileSync(JSON_FILE, 'utf8'));
    return movies.length > 0 ? movies[0] : null; // Assumes movies are sorted by watchedDate
  } catch (error) {
    console.error("❌ Error reading movies.json:", error);
    return null;
  }
}

// Load existing movies
function loadExistingMovies() {
  if (!fs.existsSync(JSON_FILE)) return [];
  
  try {
    const fileData = fs.readFileSync(JSON_FILE, 'utf8');
    return JSON.parse(fileData);
  } catch (error) {
    console.error("❌ Failed to load existing movies:", error);
    return [];
  }
}

// Save movies to the JSON file
function saveMovies(movies) {
  try {
    const moviesData = {
      lastUpdated: new Date().toISOString(), // Ensures Git detects the change
      movies: movies
    };

    fs.writeFileSync(JSON_FILE, JSON.stringify(moviesData, null, 2));
    console.log("✅ movies.json updated successfully!");
  } catch (error) {
    console.error("❌ Error writing to movies.json:", error);
  }
}

// Check RSS feed for new movies
async function checkForUpdates() {
  const fetch = await fetchModule();
  const response = await fetch(RSS_URL);
  const rssText = await response.text();
  const xml = new DOMParser().parseFromString(rssText, 'application/xml');

  const items = Array.from(xml.getElementsByTagName('item'));
  console.log(`📡 Fetched ${items.length} movies from RSS feed.`);

  // Extract the most recent movies
  const latestMovies = items.slice(0, 50).map(item => ({
    title: item.getElementsByTagName('letterboxd:filmTitle')[0]?.textContent,
    link: item.getElementsByTagName('link')[0]?.textContent,
    watchedDate: item.getElementsByTagName('letterboxd:watchedDate')[0]?.textContent,
  }));

  console.log(`🕵️‍♂️ Polling Letterboxd at ${new Date().toISOString()}`);
  console.log("🎞️ Latest Movies from RSS:", latestMovies);

  const lastLoggedMovie = getLastLoggedMovie();
  console.log("📜 Last logged movie from movies.json:", lastLoggedMovie);

  if (!lastLoggedMovie) {
    console.log("⚠️ No logged movies found. Treating all as new.");
    return latestMovies;
  }

  // Compare watchedDate instead of pubDate
  const newMovies = latestMovies.filter(movie => 
    movie.watchedDate && new Date(movie.watchedDate) > new Date(lastLoggedMovie.watchedDate)
  );

  if (newMovies.length === 0) {
    console.log("✅ No new movies found.");
    return null;
  }

  console.log(`🆕 Found ${newMovies.length} new movies! Updating movies.json...`);
  return newMovies;
}

// Trigger Netlify build hook
async function triggerBuild() {
  if (!NETLIFY_BUILD_HOOK) {
    console.error("❌ Netlify build hook URL not configured.");
    return;
  }

  const fetch = await fetchModule();
  await fetch(NETLIFY_BUILD_HOOK, { method: 'POST' });
  console.log("🚀 Netlify build triggered.");
}

// Main function
(async function main() {
  try {
    console.log("🔄 Checking for new movies...");
    const newMovies = await checkForUpdates();

    if (newMovies) {
      console.log("📥 Loading existing movies...");
      const existingMovies = loadExistingMovies();

      // Add new movies to the top, keep only the latest 50
      const updatedMovies = [...newMovies, ...existingMovies].slice(0, 50);
      
      console.log("💾 Saving updated movies.json...");
      saveMovies(updatedMovies);

      console.log("🚀 Triggering Netlify build...");
      await triggerBuild();
    } else {
      console.log("🔹 No updates needed. Exiting.");
    }
  } catch (error) {
    console.error("❌ Error:", error);
  }
})();