const moment = require("moment");
const rssPlugin = require('@11ty/eleventy-plugin-rss');
const dateFilter = require('./_src/filters/date-filter.js');
const w3DateFilter = require('./_src/filters/w3-date-filter.js');
const slugify = require("slugify");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const Image = require("@11ty/eleventy-img");

async function imageShortcode(src, alt, sizes = "100vw") {
  if(alt === undefined) {
    throw new Error(`Missing \`alt\` on responsiveimage from: ${src}`);
  }

  src = "_src/" + src;

  let metadata = await Image(src, {
    widths: [640, null],
    formats: ['webp', 'jpeg'],
    urlPath: "/images/",
    outputDir: "./_site/images/",
  });

  let lowsrc = metadata.jpeg[0];

  return `<picture>
    ${Object.values(metadata).map(imageFormat => {
      return `  <source type="${imageFormat[0].sourceType}" srcset="${imageFormat.map(entry => entry.srcset).join(", ")}" sizes="${sizes}">`;
    }).join("\n")}
      <img
        src="${lowsrc.url}"
        width="${lowsrc.width}"
        height="${lowsrc.height}"
        alt="${alt}"
        decoding="async">
    </picture>`;
}

// Create a helpful production flag
const isProduction = process.env.NODE_ENV === 'production';

module.exports = config => {

  config.addFilter('dateFilter', dateFilter);
  config.addFilter('w3DateFilter', w3DateFilter);
  config.addFilter("squash", require("./_src/filters/squash.js") );
  config.addFilter("date", function(date, format) {
    return moment.utc(date).format(format);
  });
  config.addFilter("slugify", (input) => {
    const options = {
      replacement: "-",
      remove: /[&,+()$~%.'":*?<>{}]/g,
      lower: true
    };
    return slugify(input, options);
  });

  config.addLayoutAlias('home', 'layouts/home.html');
  config.addLayoutAlias('post', 'layouts/post.html');

  config.addPassthroughCopy('_src/images/**/*');
  config.addPassthroughCopy('_src/admin/*');
  config.addPassthroughCopy('_src/simple-groupon/css/*');
  config.addPassthroughCopy('_src/simple-groupon/img/*');
  config.addPassthroughCopy('_src/slides/*.pdf');
  config.addPassthroughCopy('_src/fonts/*');
  config.addPassthroughCopy('_src/js/*');

  // Plugins
  config.addPlugin(rssPlugin);
  config.addPlugin(syntaxHighlight);

  const now = new Date();

  const livePosts = post => post.date <= now && !post.data.draft;
  config.addCollection('posts', collection => {
    return [
      ...collection.getFilteredByGlob('./_src/posts/*.md').filter(livePosts)
    ].reverse();
  });

  // Tell 11ty to use the .eleventyignore and ignore our .gitignore file
  config.setUseGitIgnore(false);

  config.addNunjucksAsyncShortcode("image", imageShortcode);

  // config.addNunjucksAsyncShortcode("Image", async (src, alt) => {
  //   if (!alt) {
  //     throw new Error(`Missing \`alt\` on myImage from: ${src}`);
  //   }

  //   let stats = await Image(src, {
  //     widths: [480],
  //     formats: ["jpeg", "webp"],
  //     urlPath: "./images/",
  //     outputDir: "./dist/images/",
  //   });

  //   let lowestSrc = stats["jpeg"][0];

  //   const srcset = Object.keys(stats).reduce(
  //     (acc, format) => ({
  //       ...acc,
  //       [format]: stats[format].reduce(
  //         (_acc, curr) => `${_acc} ${curr.srcset}`,
  //         ""
  //       ),
  //     }),
  //     {}
  //   );

  //   const webp = `<source type="image/webp" srcset="${srcset["webp"]}" >`;
  //   const jpg = `<source type="image/jpeg" srcset="${srcset["jpeg"]}" >`;

  //   const img = `<img
  //     loading="lazy"
  //     alt="${alt}"
  //     src="${lowestSrc.url}"
  //     sizes='(min-width: 1024px) 1024px, 100vw'
  //     srcset="${srcset["jpeg"]}"
  //     width="${lowestSrc.width}">`;

  //   return `<div class="image-wrapper"><picture> ${webp} ${jpg} ${img} </picture></div>`;
  // });

  return {
    markdownTemplateEngine: 'njk',
    dataTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk',
    
    dir: {
      input: '_src',
      output: '_site'
    }
  };
};