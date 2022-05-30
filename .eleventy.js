const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const { DateTime } = require("luxon");
const metagen = require('eleventy-plugin-metagen');
const pluginRss = require("@11ty/eleventy-plugin-rss");

module.exports = function(eleventyConfig) {

  eleventyConfig.addNunjucksShortcode("image", function(src, alt) {
    return `<img src="https://peruvianidol.mo.cloudinary.net/images/` + src + `" alt="` + alt + `">`;
  });

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
  eleventyConfig.addFilter("dateToRfc3339", pluginRss.dateToRfc3339);

  eleventyConfig.addPlugin(syntaxHighlight);
  eleventyConfig.addPlugin(metagen);
  eleventyConfig.addPlugin(pluginRss);

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