require("dotenv").config();
const ht = require("hebrew-transliteration/package.json");
module.exports = {
  gaTagId: process.env.GA_TAG_ID,
  htName: ht.name,
  htHomepage: ht.homepage,
  htVersion: ht.version,
};
