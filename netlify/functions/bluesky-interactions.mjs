// netlify/functions/bluesky-interactions.mjs
//
// Query params:
//   ?postUrl=https://bsky.app/profile/{handle}/post/{rkey}

const BSKY_API = "https://public.api.bsky.app/xrpc";

function parsePostUrl(url) {
  const match = url.match(/bsky\.app\/profile\/([^/]+)\/post\/([^/?#]+)/);
  if (!match) throw new Error(`Invalid Bluesky post URL: ${url}`);
  return { handle: match[1], rkey: match[2] };
}

async function resolveHandle(handle) {
  const res = await fetch(`${BSKY_API}/com.atproto.identity.resolveHandle?handle=${encodeURIComponent(handle)}`);
  if (!res.ok) throw new Error(`Failed to resolve handle ${handle}: ${res.status}`);
  const { did } = await res.json();
  return did;
}

function extractEmbed(embed) {
  if (!embed) return null;
  const type = embed.$type;

  if (type === "app.bsky.embed.images#view") {
    return { type: "images", images: embed.images.map(i => ({ thumb: i.thumb, alt: i.alt || "" })) };
  }

  if (type === "app.bsky.embed.record#view") {
    const rec = embed.record;
    if (!rec || rec.$type?.includes("NotFound") || rec.$type?.includes("Blocked")) return null;
    return {
      type: "quote",
      quote: {
        handle: rec.author?.handle,
        displayName: rec.author?.displayName || rec.author?.handle,
        avatar: rec.author?.avatar ?? null,
        text: rec.value?.text || "",
        url: rec.uri ? `https://bsky.app/profile/${rec.author?.handle}/post/${rec.uri.split("/").pop()}` : null,
      },
    };
  }

  if (type === "app.bsky.embed.recordWithMedia#view") {
    const media = extractEmbed(embed.media);
    const record = extractEmbed(embed.record);
    return {
      type: "recordWithMedia",
      images: media?.images ?? null,
      quote: record?.quote ?? null,
    };
  }

  return null;
}

export const handler = async (event) => {
  const { postUrl } = event.queryStringParameters ?? {};

  if (!postUrl) {
    return { statusCode: 400, body: JSON.stringify({ error: "postUrl is required" }) };
  }

  try {
    const { handle, rkey } = parsePostUrl(postUrl);
    const did = await resolveHandle(handle);
    const atUri = `at://${did}/app.bsky.feed.post/${rkey}`;
    const encodedUri = encodeURIComponent(atUri);

    const [likesRes, threadRes] = await Promise.all([
      fetch(`${BSKY_API}/app.bsky.feed.getLikes?uri=${encodedUri}&limit=100`),
      fetch(`${BSKY_API}/app.bsky.feed.getPostThread?uri=${encodedUri}&depth=1`),
    ]);

    if (!likesRes.ok) throw new Error(`getLikes failed: ${likesRes.status}`);
    if (!threadRes.ok) throw new Error(`getPostThread failed: ${threadRes.status}`);

    const likesData = await likesRes.json();
    const threadData = await threadRes.json();

    const likes = (likesData.likes ?? []).map((like) => ({
      handle: like.actor.handle,
      displayName: like.actor.displayName || like.actor.handle,
      avatar: like.actor.avatar ?? null,
    }));

    const replies = (threadData.thread?.replies ?? [])
      .filter((r) => r.$type === "app.bsky.feed.defs#threadViewPost")
      .sort((a, b) => new Date(a.post.record.createdAt) - new Date(b.post.record.createdAt))
      .map((r) => ({
        handle: r.post.author.handle,
        displayName: r.post.author.displayName || r.post.author.handle,
        avatar: r.post.author.avatar ?? null,
        text: r.post.record.text,
        createdAt: r.post.record.createdAt,
        url: `https://bsky.app/profile/${r.post.author.handle}/post/${r.post.uri.split("/").pop()}`,
        likeCount: r.post.likeCount ?? 0,
        embed: extractEmbed(r.post.embed),
      }));

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ likes, replies }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
