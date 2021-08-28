const { DateTime } = require("luxon");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const rssPlugin = require('@11ty/eleventy-plugin-rss');
const Image = require("@11ty/eleventy-img");
const path = require('path');
const svgSprite = require("eleventy-plugin-svg-sprite");

async function imageShortcode(src, alt, sizes = "100vw") {
  let srcPrefix = `./_src/assets/images/`;
  src = srcPrefix + src;
  console.log(`Generating image(s) from:  ${src}`);

  let metadata = await Image(src, {
    widths: [320, 640, 960],
    formats: ['avif', 'webp', 'jpeg'],
    outputDir: "./_site/assets/images/generated/",
    urlPath: "/assets/images/generated/",

    filenameFormat: function (id, src, width, format, options) {
      const extension = path.extname(src);
      const name = path.basename(src, extension)
      return `${name}-${width}w.${format}`;
    }
  });

  let lowsrc = metadata.jpeg[0];
  let highsrc = metadata.jpeg[metadata.jpeg.length - 1];
  return `<picture>
    ${Object.values(metadata).map(imageFormat => {
      return `  <source type="${imageFormat[0].sourceType}" srcset="${imageFormat.map(entry => entry.srcset).join(", ")}" sizes="${sizes}">`
    }).join("\n")}
    <img
      src="${lowsrc.url}"
      width="${highsrc.width}"
      height="${highsrc.height}"
      alt="${alt}"
      loading="lazy"
      decoding="async">
  </picture>`;
}

module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("_src/assets/images/");
  eleventyConfig.addPassthroughCopy("_src/assets/icons/");

  eleventyConfig.addWatchTarget("./_src/assets/scss/");

  eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);
  eleventyConfig.addNunjucksAsyncShortcode("image", imageShortcode);

  eleventyConfig.addFilter("postDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj, {zone: 'utc'}).toLocaleString(DateTime.DATE_FULL);
  });

  // add anchor links to heading text
  eleventyConfig.addPairedShortcode("anchor",function(content) {
    return `<a id="${eleventyConfig.getFilter('slug')(content)}" href="#${eleventyConfig.getFilter('slug')(content)}" class="anchor" aria-hidden="true">${content}</a>`
  });

  // Plugins
  eleventyConfig.addPlugin(rssPlugin);
  eleventyConfig.addPlugin(syntaxHighlight);
  eleventyConfig.addPlugin(svgSprite, {
    path: "./_src/assets/icons",
    globalClasses: "ma-icon",
    svgShortcode: "icon"
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