// netlify/functions/bluesky-status.mjs
//
// No env vars required — Bluesky public API, no auth needed.
//
// Query params:
//   ?limit=3  - number of posts to return (default: 3)

const BLUESKY_HANDLE = "peruvianidol.com";

export const handler = async (event) => {
  const limit = Math.min(parseInt(event.queryStringParameters?.limit ?? "3", 10), 20);

  try {
    const res = await fetch(
      `https://public.api.bsky.app/xrpc/app.bsky.feed.getAuthorFeed?actor=${BLUESKY_HANDLE}&limit=50&filter=posts_no_replies`
    );

    if (!res.ok) throw new Error(`Bluesky API error: ${res.status}`);

    const json = await res.json();

    const posts = json.feed
      .filter((item) => !item.reason && item.post.author.handle === BLUESKY_HANDLE)
      .slice(0, limit)
      .map((item) => {
        const embed = item.post.embed;

        let quote = null;
        let images = [];
        let video = null;
        let youtubeId = null;
        let linkCard = null;

        if (embed) {
          // Own post images
          if (embed.$type === "app.bsky.embed.images#view") {
            images = embed.images.map((img) => ({ thumb: img.thumb, alt: img.alt ?? '', width: img.aspectRatio?.width, height: img.aspectRatio?.height }));
          }

          // Video / GIF (Bluesky converts GIFs to video)
          if (embed.$type === "app.bsky.embed.video#view") {
            video = { thumbnail: embed.thumbnail ?? null, alt: embed.alt ?? '', width: embed.aspectRatio?.width, height: embed.aspectRatio?.height };
          }

          // Quote post (with optional images/link card on the quoted post)
          if (embed.$type === "app.bsky.embed.record#view") {
            const quoteEmbeds = embed.record?.embeds ?? [];
            const quoteImages = quoteEmbeds.find((e) => e.$type === "app.bsky.embed.images#view");
            const quoteExternal = quoteEmbeds.find((e) => e.$type === "app.bsky.embed.external#view");
            quote = {
              text: embed.record?.value?.text ?? null,
              facets: embed.record?.value?.facets ?? [],
              author: embed.record?.author
                ? (embed.record.author.displayName || embed.record.author.handle)
                : null,
              url: embed.record?.uri
                ? `https://bsky.app/profile/${embed.record.author.handle}/post/${embed.record.uri.split("/").pop()}`
                : null,
              images: quoteImages
                ? quoteImages.images.map((img) => ({ thumb: img.thumb, alt: img.alt ?? '' }))
                : [],
              linkCard: quoteExternal
                ? { uri: quoteExternal.external.uri, title: quoteExternal.external.title ?? null, thumb: quoteExternal.external.thumb ?? null }
                : null,
            };
          }

          // External link (YouTube, GIF, or generic link card)
          if (embed.$type === "app.bsky.embed.external#view") {
            const uri = embed.external?.uri ?? '';
            if (uri.includes('youtube.com') || uri.includes('youtu.be')) {
              const url = new URL(uri);
              youtubeId = url.hostname === 'youtu.be'
                ? url.pathname.slice(1)
                : url.searchParams.get('v') ?? url.pathname.split('/').pop();
            } else if (/\.gif(\?|$)/i.test(uri)) {
              images = [{ thumb: uri, alt: embed.external?.description ?? '' }];
            } else {
              linkCard = {
                uri,
                title: embed.external?.title ?? null,
                thumb: embed.external?.thumb ?? null,
              };
            }
          }

          // Own post images/video + quote
          if (embed.$type === "app.bsky.embed.recordWithMedia#view") {
            if (embed.media?.$type === "app.bsky.embed.images#view") {
              images = embed.media.images.map((img) => ({ thumb: img.thumb, alt: img.alt ?? '', width: img.aspectRatio?.width, height: img.aspectRatio?.height }));
            }
            if (embed.media?.$type === "app.bsky.embed.video#view") {
              video = { thumbnail: embed.media.thumbnail ?? null, alt: embed.media.alt ?? '', width: embed.media.aspectRatio?.width, height: embed.media.aspectRatio?.height };
            }
            const quoteRecord = embed.record?.record;
            if (quoteRecord) {
              const quoteEmbeds = quoteRecord.embeds ?? [];
              const quoteImages = quoteEmbeds.find((e) => e.$type === "app.bsky.embed.images#view");
              const quoteExternal = quoteEmbeds.find((e) => e.$type === "app.bsky.embed.external#view");
              quote = {
                text: quoteRecord.value?.text ?? null,
                facets: quoteRecord.value?.facets ?? [],
                author: quoteRecord.author
                  ? (quoteRecord.author.displayName || quoteRecord.author.handle)
                  : null,
                url: quoteRecord.uri
                  ? `https://bsky.app/profile/${quoteRecord.author.handle}/post/${quoteRecord.uri.split("/").pop()}`
                  : null,
                images: quoteImages
                  ? quoteImages.images.map((img) => ({ thumb: img.thumb, alt: img.alt ?? '' }))
                  : [],
                linkCard: quoteExternal
                  ? { uri: quoteExternal.external.uri, title: quoteExternal.external.title ?? null, thumb: quoteExternal.external.thumb ?? null }
                  : null,
              };
            }
          }
        }

        return {
          id: item.post.uri,
          text: item.post.record.text,
          facets: item.post.record.facets ?? [],
          images,
          video,
          youtubeId,
          linkCard,
          createdAt: item.post.record.createdAt,
          url: `https://bsky.app/profile/${BLUESKY_HANDLE}/post/${item.post.uri.split("/").pop()}`,
          likes: item.post.likeCount || 0,
          reposts: item.post.repostCount || 0,
          replies: item.post.replyCount || 0,
          quote,
        };
      });

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ posts, fetchedAt: new Date().toISOString() }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
