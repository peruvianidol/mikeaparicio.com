// netlify/functions/letterboxd-status.mjs
//
// No env vars required — uses your public Letterboxd RSS feed.
// Change the USERNAME constant below to your Letterboxd username.
//
// Query params:
//   ?limit=3   - number of films to return (default: 3)

import { XMLParser } from "fast-xml-parser";

const USERNAME = "peruvianidol";

// ─── Cache (local dev only) ───────────────────────────────────────────────────

const cache = {};
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// ─── Helpers ──────────────────────────────────────────────────────────────────

function extractPoster(description) {
  const match = description?.match(/<img src="([^"]+)"/);
  return match ? match[1] : null;
}

function parseRating(rating) {
  if (!rating) return null;
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return "★".repeat(full) + (half ? "½" : "");
}

// ─── Handler ──────────────────────────────────────────────────────────────────

export const handler = async (event) => {
  const limit = Math.min(parseInt(event.queryStringParameters?.limit ?? "3", 10), 20);
  const cacheKey = `films-${limit}`;

  if (cache[cacheKey] && Date.now() - cache[cacheKey].time < CACHE_TTL) {
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify(cache[cacheKey].data),
    };
  }

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

    const result = { films, fetchedAt: new Date().toISOString() };
    cache[cacheKey] = { data: result, time: Date.now() };

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(result),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
