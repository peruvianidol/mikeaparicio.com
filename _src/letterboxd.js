const fs = require('fs');

// Dynamically import `node-fetch` for compatibility
async function fetchModule() {
    return (await import('node-fetch')).default;
}

// URL of your RSS feed
const RSS_URL = 'https://letterboxd.com/peruvianidol/rss/';

// Path to the JSON file to store movie data
const JSON_FILE = './_src/_data/movies.json';

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
    const movie = {
        filmTitle: item.getElementsByTagName('letterboxd:filmTitle')[0]?.textContent,
        link: item.getElementsByTagName('link')[0]?.textContent,
        pubDate: item.getElementsByTagName('pubDate')[0]?.textContent,
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

// Save movies to the JSON file
function saveMovies(movies) {
    fs.writeFileSync(JSON_FILE, JSON.stringify(movies, null, 2));
}

// Main function to update the JSON file with new movies
async function updateMovies() {
    try {
        const xml = await fetchRSS(RSS_URL);
        const items = Array.from(xml.getElementsByTagName('item'));
        const newMovies = items.slice(0, 50).map(parseItem);

        const existingMovies = loadExistingMovies();
        const existingLinks = new Set(existingMovies.map(movie => movie.link));

        const updatedMovies = [
            ...existingMovies,
            ...newMovies.filter(movie => !existingLinks.has(movie.link)),
        ];

        saveMovies(updatedMovies);
        console.log(`Updated ${updatedMovies.length} movies.`);
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
