# Update `hebrew-transliteration` Package

Steps to update the `hebrew-transliteration` npm package and sync the application's UI with any new/changed schema options.

## 1. Update the package version

```bash
npx npm-check-updates hebrew-transliteration -u
npm install
```

This updates `package.json` and installs the new version.

## 2. Extract updated preset schemas

```bash
node scripts/extract-schemas.ts
```

This re-serializes all 9 preset schemas from the package into `public/schemas/` and updates `public/schemas/manifest.json` with the new version number.

## 3. Identify changes between versions

### 3a. Compare type definitions

```bash
# Download old version for comparison
mkdir -p /tmp/ht-old
npm pack hebrew-transliteration@<OLD_VERSION> --pack-destination /tmp/ht-old
mkdir -p /tmp/ht-old/pkg && tar -xzf /tmp/ht-old/hebrew-transliteration-<OLD_VERSION>.tgz -C /tmp/ht-old/pkg

# Compare Schema types
diff /tmp/ht-old/pkg/package/dist/types/schema.d.ts node_modules/hebrew-transliteration/dist/schema.d.ts

# Compare Remove types
diff /tmp/ht-old/pkg/package/dist/types/remove.d.ts node_modules/hebrew-transliteration/dist/remove.d.ts

# Clean up
rm -rf /tmp/ht-old
```

### 3b. Check for new/removed preset schemas

Compare `node_modules/hebrew-transliteration/dist/schemas/` against `public/schemas/manifest.json`:

```bash
ls node_modules/hebrew-transliteration/dist/schemas/*.d.ts
```

### 3c. Check havarotjs changes (transitive dependency)

The `SylOpts` interface in `node_modules/havarotjs/dist/types/text.d.ts` may have new properties that flow into the Schema type.

```bash
# Download old havarotjs
npm pack havarotjs@<OLD_HAVAROT_VERSION> --pack-destination /tmp/ht-old
# Extract and compare text.d.ts
```

## 4. Map new/changed Schema properties to UI

Check the `SettingsDialog.svelte` component for what's already present:

**Consonants tab** (`src/components/transliterate/SettingsDialog.svelte`):

- Array `consonants` (line ~125) — list of all consonant keys
- Compare against Schema type's consonant properties (ALEF through TAV_DAGESH)

**Vowels tab** (same file):

- Array `vowels` (line ~162) — list of all vowel keys
- Compare against Schema type's vowel properties (VOCAL_SHEVA through SHUREQ, plus FURTIVE_PATAH, QAMATS_QATAN, and \*HE ligatures)

**Others tab** (same file):

- Array `orthographies` (line ~188) — MS_SUFX, DIVINE_NAME, DIVINE_NAME_ELOHIM, SYLLABLE_SEPARATOR, DAGESH, MAQAF, PASEQ, SOF_PASUQ
- `DAGESH_CHAZAQ` — radio group (none/double/custom)
- `STRESS_MARKER` — switch + location/mark/exclude selects
- `ketivQeres` — add/remove pair list
- `ON_COMPLETE` — toggle + textarea

**Syllabification tab** (same file):

- Array `syllabification` (line ~199) — boolean/string dropdowns
- Compare against Schema's SylOpts properties

### Remove Settings (`src/components/remove/Settings.svelte`):

- Tabs: Punctuation, Taamim, Vowels — each with checkboxes
- `ON_COMPLETE` — toggle + textarea at bottom of dialog

## 5. Serialization support

When adding properties that involve functions or RegExps:

- **`src/lib/schemaSerialization.ts`** — `serialize_schema` and `deserialize_schema` pass the full schema through `serialize_object`/`deserialize_object`, which handles:
  - Functions → `{ __function: "..." }`
  - RegExps → `{ __regexp: "...", flags: "..." }`
- If adding a new property type that needs special serialization, update `serialize_value`/`deserialize_value`
- For the **remove page**: `src/components/remove/index.svelte` wraps the options with `serialize_object`/`deserialize_object` for localStorage

## 6. Verify

```bash
npm run lint
npm run build
npm run test
```

## Property categories reference

| Category              | Where it lives                    | Example properties                                                          |
| --------------------- | --------------------------------- | --------------------------------------------------------------------------- |
| Consonants            | Schema (required)                 | ALEF, BET, BET_DAGESH, ..., TAV_DAGESH                                      |
| Vowels                | Schema (required)                 | VOCAL_SHEVA, PATAH, QAMATS, HIRIQ_YOD, PATAH_HE, ...                        |
| Orthographic features | Schema (optional)                 | MS_SUFX, DIVINE_NAME, DIVINE_NAME_ELOHIM, SYLLABLE_SEPARATOR                |
| Marks                 | Schema (optional)                 | DAGESH, MAQAF, PASEQ, SOF_PASUQ                                             |
| Dagesh Chazaq         | Schema (optional)                 | DAGESH_CHAZAQ: boolean \| string                                            |
| Stress Marker         | Schema (optional)                 | STRESS_MARKER: `{ location, mark, exclude? }`                               |
| Additional Features   | Schema (optional)                 | ADDITIONAL_FEATURES: WordFeature[] \| SyllableFeature[] \| ClusterFeature[] |
| Ketiv/Qere            | Schema (optional, SylOpts)        | ketivQeres: KetivQere[]                                                     |
| ON_COMPLETE           | Schema + RemoveOptions (optional) | ON_COMPLETE: `(result, context) => string`                                  |
| Syllabification       | Schema (optional, SylOpts)        | allowNoNiqqud, article, holemHaser, ketivQeres, longVowels, ...             |
| Remove options        | RemoveOptions (optional)          | ETNAHTA, SHEVA, MAQAF, PUNC_GERESH, ...                                     |
