// netlify/functions/spotify-status.mjs
//
// Required env vars:
//   SPOTIFY_CLIENT_ID     - from https://developer.spotify.com/dashboard
//   SPOTIFY_CLIENT_SECRET - from https://developer.spotify.com/dashboard
//   SPOTIFY_REFRESH_TOKEN - from running get-spotify-token.mjs once (see that file)
//
// Playlist track listings require a user-authorized token — Spotify's
// Client Credentials flow (app-only, no login) returns 403 on /tracks even
// for public playlists. Hence the refresh-token dance below.
//
// To point at a different playlist, change PLAYLIST_ID below.
//
// Returns the whole playlist (paginated 100 at a time under the hood).

const PLAYLIST_ID = "5weXif8mevrIesjGwDi6Ci"; // "2026"

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const SPOTIFY_REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN;

// ─── Cache (local dev only) ───────────────────────────────────────────────────

const cache = {};
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// ─── Spotify Auth ───────────────────────────────────────────────────────────────

let cachedToken = null;

async function getSpotifyToken() {
  if (cachedToken && cachedToken.expiresAt > Date.now()) {
    return cachedToken.token;
  }

  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Authorization": `Basic ${Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString("base64")}`,
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: SPOTIFY_REFRESH_TOKEN,
    }),
  });

  const json = await res.json();
  if (!json.access_token) {
    throw new Error(`Spotify auth failed: ${JSON.stringify(json)}`);
  }

  cachedToken = {
    token: json.access_token,
    expiresAt: Date.now() + (json.expires_in - 60) * 1000,
  };
  return cachedToken.token;
}

async function getAllTracks(token) {
  const tracks = [];
  let url = `https://api.spotify.com/v1/playlists/${PLAYLIST_ID}/items?limit=100`;

  while (url) {
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    if (!res.ok) throw new Error(`Spotify API error: ${res.status}`);
    const json = await res.json();

    for (const entry of json.items ?? []) {
      if (!entry.item?.track) continue;
      tracks.push({
        name: entry.item.name,
        artist: entry.item.artists.map((a) => a.name).join(", "),
        url: entry.item.external_urls?.spotify ?? null,
        imageUrl: entry.item.album?.images?.[1]?.url ?? entry.item.album?.images?.[0]?.url ?? null,
      });
    }

    url = json.next;
  }

  return tracks;
}

// ─── Handler ──────────────────────────────────────────────────────────────────

export const handler = async () => {
  const cacheKey = "tracks";

  if (cache[cacheKey] && Date.now() - cache[cacheKey].time < CACHE_TTL) {
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify(cache[cacheKey].data),
    };
  }

  try {
    const token = await getSpotifyToken();
    const tracks = await getAllTracks(token);

    const result = { tracks, fetchedAt: new Date().toISOString() };
    cache[cacheKey] = { data: result, time: Date.now() };

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=300",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(result),
    };
  } catch (err) {
    console.error('[spotify-status]', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
