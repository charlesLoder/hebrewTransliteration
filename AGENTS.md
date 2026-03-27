# AGENTS.md

## Project Overview

Astro-based web application for converting Hebrew text to transliterated Latin characters using the [hebrew-transliteration](https://www.npmjs.com/package/hebrew-transliteration) npm package.

### Tech Stack

- **Framework**: Astro 6
- **UI**: Svelte 5; shadcn-svelte
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS 4
- **Deployment**: Netlify

## Development Commands

| Command           | Description                          |
| ----------------- | ------------------------------------ |
| `npm run dev`     | Start development server (port 4321) |
| `npm run build`   | Build for production → `dist/`       |
| `npm run preview` | Preview production build locally     |
| `npm run lint`    | Run ESLint                           |
| `npm run format`  | Format with Prettier                 |
| `npm run test`    | Run Playwright e2e tests             |

## Code Style Guidelines

- **Function names**: `snake_case`
- **Enforcement**: ESLint + Prettier
- **TypeScript**: Strict mode enabled
- **Path alias**: Use `$lib` for imports from `src/lib/`

## Testing

- **Framework**: Playwright
- **Browser**: Chromium only
- **Location**: `tests/*.spec.ts`
- **Dev server**: Auto-starts on test run (port 4321)

Run tests with:

```bash
npm run test
```

## Commit Message Format

Conventional commits (manual enforcement, no tools):

| Type       | Description           |
| ---------- | --------------------- |
| `feat`     | New feature           |
| `fix`      | Bug fix               |
| `docs`     | Documentation         |
| `style`    | Formatting            |
| `refactor` | Code restructuring    |
| `test`     | Adding/updating tests |
| `chore`    | Maintenance           |
| `perf`     | Performance           |
| `ci`       | CI/CD changes         |
| `build`    | Build/system changes  |

Format: `type(scope): description`

Examples:

```
feat(transliteration): add new vowel mapping option
fix(settings): restore default schema on page reload
docs: update API usage examples
```

## Deployment

- **Platform**: Netlify
- **Build command**: `npm run build`
- **Publish directory**: `dist/`
- **Functions**: `netlify/functions/`

Configuration in `netlify.toml`.

## Security Considerations

- **Environment variables**: `.env` and `.env.production` are gitignored — never commit secrets
- **Netlify functions**: Serverless functions in `netlify/functions/` — avoid exposing sensitive data in responses

## Project Structure

```
src/
├── components/       # Svelte components
├── layouts/         # Astro layouts
├── lib/             # Utilities, UI components
├── pages/           # Astro routes (*.astro)
├── services/        # Business logic
└── types/           # TypeScript types
tests/               # Playwright e2e specs
netlify/functions/  # Netlify serverless functions
```

## State Management

Uses Svelte 5's `$state` runes with context-based sharing.

### State Interfaces

| Interface              | Purpose                                                          | Key                       |
| ---------------------- | ---------------------------------------------------------------- | ------------------------- |
| `TransliterationState` | Main transliteration page state (input, output, schema settings) | `"transliteration_state"` |
| `RemoveState`          | Hebrew text removal page state                                   | `"remove_state"`          |
| `StructureState`       | Hebrew text structure analysis page state                        | `"structure_state"`       |

### Architecture Pattern

1. **Root component** (`transliterate/index.svelte`) creates state with `$state()` and exposes it via Svelte context using `setContext<Context<T>>("state_key", ...)`

2. **Consumer components** access state via `getContext<Context<T>>("state_key")` and mutate directly via `.value` property

3. **Persistence**: State is serialized to localStorage on changes (see `src/lib/storage.ts`)

```svelte
// Setting state
setContext<Context<TransliterationState>>("transliteration_state", {
  get value() { return transliteration_state; },
  set value(v) { transliteration_state = v; }
});

// Consuming state
const state = getContext<Context<TransliterationState>>("transliteration_state");
state.value.input = "new input";  // Direct mutation
```
