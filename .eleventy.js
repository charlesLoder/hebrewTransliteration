const htmlmin = require("html-minifier");
const esbuild = require("esbuild");
const CleanCSS = require("clean-css");
const { EleventyEdgePlugin } = require("@11ty/eleventy");

module.exports = function (eleventyConfig) {
  eleventyConfig.on("afterBuild", () => {
    return esbuild.build({
      entryPoints: {
        transliterate: "src/assets/js/transliterate.js",
        remove: "src/assets/js/remove.js",
        structure: "src/assets/js/structure.js",
        friconix: "src/assets/js/friconix.js",
        about: "src/assets/js/about.js",
        copy_button: "src/assets/js/copy_button.js",
      },
      outdir: "dist/assets",
      format: "iife",
      bundle: true,
      minify: process.env.NODE_ENV && process.env.NODE_ENV == "production",
    });
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

  eleventyConfig.addPlugin(EleventyEdgePlugin);

  // adds a copy to dist
  eleventyConfig.addPassthroughCopy("src/assets/img/*");
  // triggers a rebuild when anything in here changes
  eleventyConfig.addWatchTarget("src/assets/css/main.css");
  eleventyConfig.addWatchTarget("src/assets/js/");
  eleventyConfig.addFilter("cssmin", function (code) {
    return new CleanCSS({}).minify(code).styles;
  });
  eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);
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
