// get-spotify-token.mjs
//
// One-time script to get a Spotify refresh token for the "Listening" widget.
// Requires SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET in the environment:
//   node --env-file=.env get-spotify-token.mjs
//
// Usage:
//   1. Run with no arguments to print an authorization URL.
//      Open it, log in, and approve access.
//   2. You'll land on a page that fails to load (expected — nothing is
//      listening on the redirect URI). Copy the `code` value from the
//      address bar's query string.
//   3. Re-run with that code as an argument to exchange it for a refresh token:
//        node --env-file=.env get-spotify-token.mjs <code>

const REDIRECT_URI = "https://127.0.0.1:8080/callback";
const SCOPE = "playlist-read-private";

const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

if (!clientId || !clientSecret) {
  console.error("Missing SPOTIFY_CLIENT_ID / SPOTIFY_CLIENT_SECRET in environment.");
  process.exit(1);
}

const code = process.argv[2];

if (!code) {
  const authUrl = new URL("https://accounts.spotify.com/authorize");
  authUrl.searchParams.set("client_id", clientId);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("redirect_uri", REDIRECT_URI);
  authUrl.searchParams.set("scope", SCOPE);

  console.log("Open this URL, log in, and approve access:\n");
  console.log(authUrl.toString());
  console.log("\nYou'll land on a page that fails to load — that's expected.");
  console.log("Copy the `code` value from the address bar and re-run:");
  console.log("  node --env-file=.env get-spotify-token.mjs <code>");
  process.exit(0);
}

const res = await fetch("https://accounts.spotify.com/api/token", {
  method: "POST",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
    "Authorization": `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
  },
  body: new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: REDIRECT_URI,
  }),
});

const json = await res.json();

if (!json.refresh_token) {
  console.error("Token exchange failed:", json);
  process.exit(1);
}

console.log("Refresh token:", json.refresh_token);
