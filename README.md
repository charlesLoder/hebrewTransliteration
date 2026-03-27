# Hebrew Transliteration

Interactive web application for converting Hebrew text to transliterated Latin characters using the [hebrew-transliteration](https://www.npmjs.com/package/hebrew-transliteration) npm package.

## Getting Started

### Prerequisites

Node v24

```bash
node --version
# v24.x.x
```

### Installation

```bash
npm install
```

If an error arises due to `sharp`, try running:

```bash
SHARP_IGNORE_GLOBAL_LIBVIPS=1 npm install
```

### Development

```bash
npm run dev
```

Starts the development server at `http://localhost:4321`

### Production Build

```bash
npm run build
```

Generates optimized static site in `./dist/`

### Preview

```bash
npm run preview
```

Preview the production build locally

## License

MIT

## Contributing

Issues are welcome.

For issues related to the `hebrew-transliteration` package, see: https://github.com/Retzion/hebrew-transliteration
