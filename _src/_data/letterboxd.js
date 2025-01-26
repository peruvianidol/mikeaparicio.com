const fs = require('fs');
const path = require('path');
const { DateTime } = require('luxon');

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
      filmTitle: item.getElementsByTagName('letterboxd:filmTitle')[0]?.textContent,
      link: item.getElementsByTagName('link')[0]?.textContent,
      watchedDate: watchedDate || null, // Use watchedDate as is, or null if not present
      filmYear: item.getElementsByTagName('letterboxd:filmYear')[0]?.textContent,
      memberRating: item.getElementsByTagName('letterboxd:memberRating')[0]?.textContent,
      posterUrl: item.getElementsByTagName('description')[0]?.textContent.match(/<img src="(.*?)"/)[1],
      reviewText: item.getElementsByTagName('description')[0]?.textContent.replace(/<[^>]+>/g, '').trim(),
    };
  
    return movie;
  }

// Load existing movies from the JSON file
function loadExistingMovies() {
    if (!fs.existsSync(JSON_FILE)) return [];
    const fileData = fs.readFileSync(JSON_FILE, 'utf8');
    return JSON.parse(fileData);
}

function saveMovies(movies) {
    const currentData = fs.existsSync(JSON_FILE) ? fs.readFileSync(JSON_FILE, 'utf8') : '';
    const newData = JSON.stringify(movies, null, 2);

    if (currentData !== newData) {
        fs.writeFileSync(JSON_FILE, newData);
        console.log('movies.json updated.');
    } else {
        console.log('No changes to movies.json.');
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

        // Merge new and existing movies, keeping only unique links
        const allMovies = [
            ...newMovies,
            ...existingMovies.filter(movie => !newMovies.some(newMovie => newMovie.link === movie.link)),
        ];

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

// Export the function for Eleventy
module.exports = updateMovies;
