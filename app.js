const htmlStandards = require('reshape-standard')
const cssStandards = require('spike-css-standards')
const jsStandards = require('spike-js-standards')
const pageId = require('spike-page-id')
const env = process.env.SPIKE_ENV

module.exports = {
  devtool: 'source-map',
  ignore: ['**/layout.html', '**/_*', '**/.*', 'readme.md', 'yarn.lock', 'package-lock.json'],
  entry: {
    'js/transliterate': ['./assets/js/transliterate.js'],
    'js/remove': ['./assets/js/remove.js'],
    'js/sequence': ['./assets/js/sequence.js'],
    'js/index': ['./assets/js/index.js']
  },
  reshape: htmlStandards({
    locals: (ctx) => { return { pageId: pageId(ctx), foo: 'bar' } },
    minify: env === 'production'
  }),
  postcss: cssStandards({
    minify: env === 'production',
    warnForDuplicates: env !== 'production'
  }),
  babel: jsStandards()
}
