// netlify/functions/letterboxd-status.mjs
//
// No env vars required — uses your public Letterboxd RSS feed.
// Change the USERNAME constant below to your Letterboxd username.
//
// Query params:
//   ?limit=3   - number of films to return (default: 3)

import { XMLParser } from "fast-xml-parser";

const USERNAME = "peruvianidol";

function extractPoster(description) {
  // Poster is in an <img src="..."> inside the description HTML
  const match = description?.match(/<img src="([^"]+)"/);
  return match ? match[1] : null;
}

function parseRating(rating) {
  if (!rating) return null;
  // Convert numeric rating (e.g. 4.5) to star string (e.g. "★★★★½")
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return "★".repeat(full) + (half ? "½" : "");
}

export const handler = async (event) => {
  const limit = Math.min(parseInt(event.queryStringParameters?.limit ?? "3", 10), 20);

  try {
    const res = await fetch(`https://letterboxd.com/${USERNAME}/rss/`);
    if (!res.ok) throw new Error(`Letterboxd RSS returned ${res.status}`);
    const xml = await res.text();

    const parser = new XMLParser({ ignoreAttributes: false });
    const feed = parser.parse(xml);
    const items = feed?.rss?.channel?.item ?? [];

    const films = items.slice(0, limit).map((item) => ({
      title: item["letterboxd:filmTitle"],
      year: item["letterboxd:filmYear"],
      rating: parseRating(item["letterboxd:memberRating"]),
      ratingValue: item["letterboxd:memberRating"] ?? null,
      posterUrl: extractPoster(item.description),
      reviewUrl: item.link,
      watchedDate: item["letterboxd:watchedDate"],
      rewatch: item["letterboxd:rewatch"] === "Yes",
    }));

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ films, fetchedAt: new Date().toISOString() }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
