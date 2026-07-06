import Image from "@11ty/eleventy-img";
import syntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
import { figure } from "@mdit/plugin-figure";
import markdownItAttrs from "markdown-it-attrs";
import rss from "@11ty/eleventy-plugin-rss";
import { buildSprite } from "./scripts/build-sprite.mjs";

function videoShortcode(url, caption = null) {
  const figcaption = caption ? `<figcaption>${caption}</figcaption>` : "";
  if (url.includes("youtube.com") || url.includes("youtu.be")) {
    const { hostname, pathname, searchParams } = new URL(url);
    const id = hostname === "youtu.be"
      ? pathname.slice(1)
      : searchParams.get("v") ?? pathname.split("/").pop();
    return `<figure><iframe src="https://www.youtube.com/embed/${id}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>${figcaption}</figure>`;
  }
  return `<figure><video preload="auto" aria-label="Embedded video" src="${url}" type="video/mp4" playsinline disablePictureInPicture controls></video>${figcaption}</figure>`;
}

async function imageShortcode(src, alt, caption = null, figureClass = null, figureStyle = null, sizes = "(min-width: 700px) 700px, 100vw") {
  const classAttr = figureClass ? ` class="${figureClass}"` : "";
  const styleAttr = figureStyle ? ` style="${figureStyle}"` : "";

  if (src.toLowerCase().endsWith(".gif")) {
    const imgHTML = `<img src="/assets/images/${src}" alt="${alt}" loading="lazy" decoding="async">`;
    if (!caption) return imgHTML;
    return `<figure${classAttr}${styleAttr}>${imgHTML}<figcaption>${caption}</figcaption></figure>`;
  }

  let isOnNetlify = process.env.CONTEXT === "production" ||
    process.env.CONTEXT === "deploy-preview" ||
    process.env.CONTEXT === "branch-deploy";

  src = "_src/assets/images/" + src;

  let metadata = await Image(src, {
    widths: isOnNetlify ? [300, 600, 900, null] : [null],
    formats: isOnNetlify ? ["webp", "jpeg"] : [null],
    urlPath: "/assets/images/",
    outputDir: "./_site/assets/images/",
    cacheOptions: {
      duration: "1d",
      directory: ".cache",
    },
  });

  let imageAttributes = {
    alt,
    sizes,
    loading: "lazy",
    decoding: "async",
  };

  const imgHTML = Image.generateHTML(metadata, imageAttributes);
  if (!caption) return imgHTML;

  return `<figure${classAttr}${styleAttr}>${imgHTML}<figcaption>${caption}</figcaption></figure>`;
}

function iconShortcode(name, classes = null, label = null) {
  const ariaAttrs = label
    ? `role="img" aria-label="${label}"`
    : `aria-hidden="true"`;
  const classAttr = classes ? ` class="${classes}"` : "";
  return `<svg ${ariaAttrs}${classAttr}><use href="/assets/sprite.svg#${name}"></use></svg>`;
}

export default function(eleventyConfig) {

  eleventyConfig.on('eleventy.before', buildSprite);

  eleventyConfig.addPlugin(syntaxHighlight);
  eleventyConfig.addPlugin(rss);
  eleventyConfig.addWatchTarget("./_src/assets/scss/");
  eleventyConfig.addWatchTarget("./_src/assets/icons/");
  eleventyConfig.amendLibrary("md", mdLib => mdLib.use(markdownItAttrs).use(figure));

  eleventyConfig.addPassthroughCopy("./_src/assets/fonts/");
  eleventyConfig.addPassthroughCopy("./_src/assets/images/**/*");
  eleventyConfig.addPassthroughCopy({ "./node_modules/lite-youtube-embed/src/lite-yt-embed.js": "assets/js/lite-yt-embed.js" });
  eleventyConfig.addPassthroughCopy("./_src/simple-groupon/**/*");
  eleventyConfig.setServerPassthroughCopyBehavior("passthrough");

  eleventyConfig.addShortcode("image", imageShortcode);
  eleventyConfig.addShortcode("video", videoShortcode);
  eleventyConfig.addShortcode("icon", iconShortcode);

  eleventyConfig.addCollection("posts", collection => {
    return [...collection.getFilteredByGlob("_src/posts/**/*")].reverse();
  });

  eleventyConfig.addCollection("favorites", collection => {
    return [...collection.getFilteredByGlob("_src/favorites/**/*.md")]
      .sort((a, b) => a.data.title.localeCompare(b.data.title));
  });

  eleventyConfig.addFilter("getAllFavoriteTags", (collection) => {
    const counts = {};
    collection.forEach(item => {
      (item.data.tags || []).forEach(tag => {
        counts[tag] = (counts[tag] || 0) + 1;
      });
    });
    return Object.entries(counts)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([name, count]) => ({ name, count }));
  });

  eleventyConfig.addFilter("vimeoId", (url) => {
    return new URL(url).pathname.split("/").filter(Boolean)[0];
  });

  eleventyConfig.addFilter("youtubeId", (url) => {
    const { hostname, pathname, searchParams } = new URL(url);
    return hostname === "youtu.be"
      ? pathname.slice(1)
      : searchParams.get("v") ?? pathname.split("/").pop();
  });

  eleventyConfig.addFilter("getAllTags", (collection) => {
    const counts = {};
    collection.forEach(post => {
      (post.data.tags || []).forEach(tag => {
        counts[tag] = (counts[tag] || 0) + 1;
      });
    });
    return Object.entries(counts)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([name, count]) => ({ name, count }));
  });

  eleventyConfig.addFilter("readableDate", (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "UTC",
    });
  });

  eleventyConfig.addFilter("htmlDateString", (date) => {
    return new Date(date).toISOString().split("T")[0];
  });

  return {
    dir: {
      input: '_src',
      output: '_site'
    },

    markdownTemplateEngine: 'njk',
    dataTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk'
  };
};
