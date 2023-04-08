# Hebrew Transliteration

## About

This is a web app for creating customized Hebrew transliterations.

It's built with Eleventy and hosted on Netlify.

This site primarily serves as a user friendly wrapper for the
[`hebrew-transliteration`](https://github.com/charlesLoder/hebrew-transliteration). If you notice
something is incorrect with your transliteration, open up an issue in that repo, not this one.

## Install

You will need node installed.

```
git clone https://github.com/charlesLoder/hebrewTransliteration.git
cd hebrewTransliteration
npm install
npm run start:dev
```

The Netlify `error.ts` and `feedback.ts` functions are designed to post to a Google sheet. If you
want to set that up, create a `.env` file:

```bash
GA_TAG_ID= # for analytics
SHEET_ID=
SHEET_ERROR_TITLE=
SHEET_FEEDBACK_TITLE=
SCOPE=
GOOGLE_SERVICE_ACCOUNT_EMAIL=
GOOGLE_PRIVATE_KEY=
```

## Live

Checkout it out live at [hebrewtransliteration.app](https://hebrewtransliteration.app/)!

## Contributing

Feel free to submit issues, open pull requests, create a fork, or contact me directly.
