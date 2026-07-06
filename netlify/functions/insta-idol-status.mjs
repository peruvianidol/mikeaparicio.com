// netlify/functions/insta-idol-status.mjs
//
// No env vars required — uses the public Insta-Idol feed.

const FEED_URL = "https://insta-idol.mikeaparicio.com/feed.json";

export const handler = async () => {
  try {
    const res = await fetch(FEED_URL);
    if (!res.ok) throw new Error(`Feed returned ${res.status}`);

    const { posts } = await res.json();
    if (!posts?.length) throw new Error("No posts in feed");

    const latest = posts[0];

    const thumbnail = latest.thumbnail.replace(
      /\/image\/upload\/[^/]+\//,
      "/image/upload/h_812,q_auto,f_auto/"
    );

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        photo: {
          url: latest.url,
          thumbnail,
          title: latest.title,
          date: new Date(latest.timestamp * 1000).toISOString(),
        },
      }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
