const Image = require("@11ty/eleventy-img");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const { DateTime } = require("luxon");
const metagen = require('eleventy-plugin-metagen');
const pluginRss = require("@11ty/eleventy-plugin-rss");

async function imageShortcode(src, alt, sizes = "100vw") {

  let isOnNetlify = process.env.CONTEXT === "production" ||
    process.env.CONTEXT === "deploy-preview" ||
    process.env.CONTEXT === "branch-deploy";

  src = "_src/images/" + src;

  let metadata = await Image(src, {
    widths: isOnNetlify ? [300, 600, null] : [null],
    formats: isOnNetlify ? ["webp", "jpeg"] : [null],
    urlPath: "/images/",
    outputDir: "./_site/images/",
  });

  let imageAttributes = {
    alt,
    sizes,
    loading: "lazy",
    decoding: "async",
  };

  return Image.generateHTML(metadata, imageAttributes);
}

module.exports = function(eleventyConfig) {

  eleventyConfig.setServerOptions({
    showAllHosts: true,
  });

  eleventyConfig.addWatchTarget("./_src/assets/scss/**/*");
  eleventyConfig.addPassthroughCopy('_src/assets/fonts/**/*');
  eleventyConfig.addPassthroughCopy('_src/assets/images/**/*');
  eleventyConfig.addPassthroughCopy('_src/assets/videos/**/*');
  eleventyConfig.addPassthroughCopy('_src/assets/posters/**/*');
  eleventyConfig.addPassthroughCopy('_src/images/**/*');
  eleventyConfig.addPassthroughCopy('_src/slides/**/*');
  eleventyConfig.addPassthroughCopy('_src/simple-groupon/**/*');
  eleventyConfig.addPassthroughCopy({ '_src/robots.txt': '/robots.txt' });

  eleventyConfig.addNunjucksAsyncShortcode("image", imageShortcode);

  eleventyConfig.addCollection('posts', collection => {
    return [
      ...collection.getFilteredByGlob('./_src/posts/*.md')
    ].reverse();
  });
  eleventyConfig.addCollection('drafts', collection => {
    return [
      ...collection.getFilteredByGlob('./_src/drafts/*.md')
    ].reverse();
  });

  eleventyConfig.addFilter("postDate", (dateInput) => {
    let date;
    if (typeof dateInput === 'string') {
      date = DateTime.fromRFC2822(dateInput, { zone: 'utc' });
    } else if (dateInput instanceof Date) {
      date = DateTime.fromJSDate(dateInput, { zone: 'utc' });
    } else {
      console.error(`Invalid dateInput: Expected a string or Date, but got ${typeof dateInput}`, dateInput);
      return 'Invalid Date';
    }
    return date.isValid ? date.toLocaleString(DateTime.DATE_FULL) : 'Invalid Date';
  });
  eleventyConfig.addFilter("jsonify", (obj) => JSON.stringify(obj, null, 2));
  eleventyConfig.addFilter("dateToRfc3339", pluginRss.dateToRfc3339);
  eleventyConfig.addFilter("limit", function (arr, limit) {
    return arr.slice(0, limit);
  });
  eleventyConfig.addPlugin(syntaxHighlight);
  eleventyConfig.addPlugin(metagen);
  eleventyConfig.addPlugin(pluginRss);

  eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);

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