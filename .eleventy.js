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

  eleventyConfig.addWatchTarget("./_src/_data/movies.json"); // Watch movies.json

  eleventyConfig.on("eleventy.before", async () => {
    const fs = require("fs"); // Now only loaded when Eleventy starts
    const crypto = require("crypto");

    console.log("Checking if movies.json has changed...");
    const lastBuildHash = "./_src/_data/movies.hash";

    const moviesJson = fs.readFileSync("./_src/_data/movies.json", "utf8");
    const currentHash = crypto.createHash("md5").update(moviesJson).digest("hex");

    if (fs.existsSync(lastBuildHash)) {
      const previousHash = fs.readFileSync(lastBuildHash, "utf8");
      if (previousHash === currentHash) {
        console.log("No changes to movies.json, skipping rebuild.");
        return;
      }
    }

    fs.writeFileSync(lastBuildHash, currentHash);
    console.log("movies.json changed, rebuilding...");
  });

  eleventyConfig.setServerOptions({
    watch: ['!./_data/movies.json'], // Prevent infinite loop
  });

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

  eleventyConfig.addFilter("postDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj, {zone: 'utc'}).toLocaleString(DateTime.DATE_FULL);
  });

  eleventyConfig.addFilter("watchDate", (dateStr) => {
    if (!dateStr) {
      console.error(`Invalid watchDate: "${dateStr}"`);
      return 'Invalid Date';
    }
  
    const date = DateTime.fromISO(dateStr);
    return date.isValid ? date.toLocaleString(DateTime.DATE_FULL) : 'Invalid Date';
  });
  
  eleventyConfig.addFilter("jsonify", (obj) => JSON.stringify(obj, null, 2));
  eleventyConfig.addFilter("dateToRfc3339", pluginRss.dateToRfc3339);
  eleventyConfig.addFilter("limit", function (arr, limit) {
    if (!Array.isArray(arr)) {
        console.error("❌ limit filter received a non-array value:", arr);
        return []; // Prevent crashing
    }
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