// netlify/functions/gaming-status.mjs
//
// Required env vars:
//   STEAM_API_KEY        - from https://steamcommunity.com/dev/apikey
//   STEAM_USER_ID        - your Steam64 ID
//   PSN_REFRESH_TOKEN    - see README for one-time setup
//   PSN_USERNAME         - your PSN username (e.g. "peruvianidol")
//
// Query params:
//   ?limit=3             - number of games to return (default: 1)

import * as psnApi from "psn-api";

const {
  exchangeRefreshTokenForAuthTokens,
  getRecentlyPlayedGames,
} = psnApi;

const STEAM_API_KEY = process.env.STEAM_API_KEY;
const STEAM_USER_ID = process.env.STEAM_USER_ID;
const PSN_REFRESH_TOKEN = process.env.PSN_REFRESH_TOKEN;
const PSN_USERNAME = process.env.PSN_USERNAME;

// ─── Steam ────────────────────────────────────────────────────────────────────

async function getSteamGames(limit) {
  const res = await fetch(
    `https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?key=${STEAM_API_KEY}&steamid=${STEAM_USER_ID}&include_appinfo=1&include_played_free_games=1`
  );
  const json = await res.json();
  const games = json?.response?.games ?? [];

  // Sort by last played, take top N
  return games
    .filter((g) => g.rtime_last_played > 0)
    .sort((a, b) => b.rtime_last_played - a.rtime_last_played)
    .slice(0, limit)
    .map((game) => ({
      platform: "steam",
      name: game.name,
      coverUrl: `https://cdn.akamai.steamstatic.com/steam/apps/${game.appid}/library_600x900.jpg`,
      storeUrl: `https://store.steampowered.com/app/${game.appid}`,
      lastPlayed: new Date(game.rtime_last_played * 1000).toISOString(),
    }));
}

// ─── PSN ──────────────────────────────────────────────────────────────────────

async function getPsnGames(limit) {
  const auth = await exchangeRefreshTokenForAuthTokens(PSN_REFRESH_TOKEN);
  const accessToken = auth.accessToken;

  const response = await getRecentlyPlayedGames({ accessToken }, {
    limit,
    offset: 0,
  });

  const titles = (response?.data?.gameLibraryTitlesRetrieve?.games ?? []).slice(0, limit);

  return titles.map((title) => ({
    platform: "psn",
    name: title.name,
    coverUrl: title.image?.url,
    storeUrl: `https://psnprofiles.com/${PSN_USERNAME}`,
    lastPlayed: title.lastPlayedDateTime ?? new Date(0).toISOString(),
  }));
}

// ─── Handler ──────────────────────────────────────────────────────────────────

export const handler = async (event) => {
  const limit = Math.min(parseInt(event.queryStringParameters?.limit ?? "1", 10), 20);

  try {
    const [steamResult, psnResult] = await Promise.allSettled([
      getSteamGames(10),
      getPsnGames(10),
    ]);

    const steamGames = steamResult.status === "fulfilled" ? steamResult.value : [];
    const psnGames   = psnResult.status   === "fulfilled" ? psnResult.value   : [];

    const errors = {};
    if (steamResult.status === "rejected") errors.steam = steamResult.reason?.message;
    if (psnResult.status   === "rejected") errors.psn   = psnResult.reason?.message;

    const games = [...steamGames, ...psnGames]
      .sort((a, b) => new Date(b.lastPlayed) - new Date(a.lastPlayed))
      .slice(0, limit);

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ games, errors, fetchedAt: new Date().toISOString() }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
