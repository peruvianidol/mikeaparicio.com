const fs = require('fs');
const path = require('path');
const { DateTime } = require('luxon');
const { decode } = require('he');

// Dynamically import `node-fetch` for compatibility
async function fetchModule() {
    return (await import('node-fetch')).default;
}

// URL of your RSS feed
const RSS_URL = 'https://letterboxd.com/peruvianidol/rss/';

// Path to the JSON file to store movie data
const JSON_FILE = path.join(__dirname, 'movies.json');

// Fetch the RSS feed
async function fetchRSS(url) {
    const fetch = await fetchModule();
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch RSS feed');
    const text = await response.text();
    const { DOMParser } = await import('linkedom');
    return new DOMParser().parseFromString(text, 'text/xml');
}

// Parse an RSS item to extract movie details
function parseItem(item) {
    const watchedDate = item.getElementsByTagName('letterboxd:watchedDate')[0]?.textContent;
  
    const movie = {
      filmTitle: decode(item.getElementsByTagName('letterboxd:filmTitle')[0]?.textContent || ""),
      link: item.getElementsByTagName('link')[0]?.textContent,
      watchedDate: watchedDate || null, // Use watchedDate as is, or null if not present
      filmYear: item.getElementsByTagName('letterboxd:filmYear')[0]?.textContent,
      memberRating: item.getElementsByTagName('letterboxd:memberRating')[0]?.textContent,
      posterUrl: item.getElementsByTagName('description')[0]?.textContent.match(/<img src="(.*?)"/)[1],
      reviewText: decode(item.getElementsByTagName('description')[0]?.textContent.replace(/<[^>]+>/g, '').trim() || ""),
    };
  
    return movie;
  }

// Load existing movies from the JSON file
function loadExistingMovies() {
    if (!fs.existsSync(JSON_FILE)) {
        console.warn("⚠️ movies.json not found. Returning an empty array.");
        return [];
    }

    try {
        const fileData = fs.readFileSync(JSON_FILE, 'utf8');
        const parsedData = JSON.parse(fileData);

        // Ensure it returns an array, even if malformed
        if (!parsedData || !Array.isArray(parsedData)) {
            console.warn("⚠️ movies.json does not contain a valid movies array. Resetting to an empty array.");
            return [];
        }

        return parsedData;
    } catch (error) {
        console.error("❌ Error reading movies.json. Resetting to an empty array.", error);
        return [];
    }
}

function saveMovies(movies) {
    try {
        const moviesData = {
            lastUpdated: new Date().toISOString(), // Ensures Git detects changes
            movies: Array.isArray(movies) ? movies : [] // Guarantees an array
        };

        fs.writeFileSync(JSON_FILE, JSON.stringify(moviesData, null, 2));
        console.log("✅ movies.json updated successfully!");
    } catch (error) {
        console.error("❌ Error writing to movies.json:", error);
    }
}

// Main function to update the JSON file with new movies
async function updateMovies() {
    try {
        console.log('Fetching RSS feed...');
        const xml = await fetchRSS(RSS_URL);
        console.log('RSS feed fetched.');
        const items = Array.from(xml.getElementsByTagName('item'));
        console.log(`Found ${items.length} items in the feed.`);
        const newMovies = items.slice(0, 50).map(parseItem);

        const existingMovies = loadExistingMovies();

        // Ensure existingMovies is an array
        if (!Array.isArray(existingMovies)) {
            console.warn("⚠️ existingMovies was not an array. Resetting to an empty array.");
            existingMovies = [];
        }

        // Merge new and existing movies, keeping only unique links
        const allMovies = [...newMovies, ...existingMovies];

        // Process movies and sort by watchedDate (most recent first)
        const processedMovies = allMovies.map(movie => ({
            ...movie,
            watchedDate: movie.watchedDate || null, // Ensure watchedDate exists (null if missing)
        }));
        
        // Sort movies by watchedDate (most recent first)
        processedMovies.sort((a, b) => {
            const dateA = new Date(a.watchedDate);
            const dateB = new Date(b.watchedDate);
            return dateB - dateA; // Descending order
        });
        
        // Save updated movies to JSON file
        saveMovies(processedMovies);
        console.log(`Updated movies.json with ${processedMovies.length} movies.`);
  
    } catch (error) {
        console.error('Error:', error);
    }
}

// Run the update function if invoked directly
if (require.main === module) {
    updateMovies();
}

module.exports = async function () {
    try {
        console.log("🔄 Fetching movies.json for Eleventy...");

        const moviesData = JSON.parse(fs.readFileSync(JSON_FILE, 'utf8'));

        console.log("📜 movies.json type:", typeof moviesData);
        console.log("📜 Type of moviesData.movies:", Array.isArray(moviesData.movies) ? "Array" : typeof moviesData.movies);
        console.log("📜 Number of movies:", Array.isArray(moviesData.movies) ? moviesData.movies.length : "N/A");

        // Log only the first movie's title instead of dumping the entire JSON
        if (Array.isArray(moviesData.movies) && moviesData.movies.length > 0) {
            console.log("🎞️ First movie in list:", moviesData.movies[0].filmTitle || "Unknown Title");
        }

        // Ensure we return an array
        const moviesArray = Array.isArray(moviesData.movies) ? moviesData.movies : [];

        console.log("✅ Returning movies array to Eleventy. Length:", moviesArray.length);
        return moviesArray;
    } catch (error) {
        console.error("❌ Error loading movies.json for Eleventy:", error);
        return []; // Return an empty array so Eleventy doesn’t crash
    }
};
