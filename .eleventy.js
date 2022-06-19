const htmlmin = require("html-minifier");
const pluginESbuild = require("@jamshop/eleventy-plugin-esbuild");
const CleanCSS = require("clean-css");

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(pluginESbuild, {
    entryPoints: {
      transliterate: "src/assets/js/transliterate.js",
      remove: "src/assets/js/remove.js",
      friconix: "src/assets/js/friconix.js",
      about: "src/assets/js/about.js",
    },
    output: "dist/assets",
    esbuild: {
      format: "esm",
    },
  });

  eleventyConfig.addTransform("htmlmin", function (content, outputPath) {
    if (process.env.ELEVENTY_PRODUCTION && outputPath && outputPath.endsWith(".html")) {
      let minified = htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true,
      });
      return minified;
    }

    return content;
  });

  // adds a copy to dist
  eleventyConfig.addPassthroughCopy("src/assets/img/favicon.svg");
  eleventyConfig.addPassthroughCopy("src/assets/img/hebrew-transliteration-card.png");
  // triggers a rebuild when anything in here changes
  eleventyConfig.addWatchTarget("src/assets/css/main.css");
  eleventyConfig.addFilter("cssmin", function (code) {
    return new CleanCSS({}).minify(code).styles;
  });
  return {
    dir: {
      input: "src",
      output: "dist",
      data: "_data",
      layouts: "_layouts",
      includes: "_includes",
    },
    templateFormats: ["njk", "md", "html", "11ty.js"],
  };
};
