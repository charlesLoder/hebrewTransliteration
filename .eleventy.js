const htmlmin = require("html-minifier");
const pluginESbuild = require("@jamshop/eleventy-plugin-esbuild");
const CleanCSS = require("clean-css");

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(pluginESbuild, {
    entryPoints: {
      transliterate: "src/assets/transliterate.js",
      remove: "src/assets/remove.js",
    },
    output: "dist/assets",
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

  // adds a copy of the assets folder to _site
  eleventyConfig.addPassthroughCopy("src/assets/favicon.svg");
  // triggers a rebuild when anything in here changes
  eleventyConfig.addWatchTarget("src/assets/main.css");
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
