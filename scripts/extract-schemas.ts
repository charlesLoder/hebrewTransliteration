import { mkdirSync, readFileSync, writeFileSync } from "fs";
import { SBL } from "hebrew-transliteration";
import {
  brillAcademic,
  brillSimple,
  jss,
  michiganClaremont,
  romaniote,
  sblAcademicSpirantization,
  sblSimple,
  tiberian,
} from "hebrew-transliteration/schemas";
import { serialize_schema } from "../src/lib/schemaSerialization.ts";

const packageJson = JSON.parse(
  readFileSync("./node_modules/hebrew-transliteration/package.json", "utf-8"),
);
const version = packageJson.version;

const schemaDefinitions = [
  { label: "SBL Academic", data: new SBL({}) },
  { label: "Brill Academic", data: brillAcademic },
  { label: "Brill Simple", data: brillSimple },
  { label: "Journal of Semitic Studies", data: jss },
  { label: "Michigan Claremont", data: michiganClaremont },
  { label: "Romaniote", data: romaniote },
  { label: "SBL Academic Spirantization", data: sblAcademicSpirantization },
  { label: "SBL Simple", data: sblSimple },
  { label: "Tiberian", data: tiberian },
];

const schemaFiles = [];

for (const { label, data } of schemaDefinitions) {
  const filename = label.toLowerCase().replace(/[^a-z0-9]+/g, "-") + ".json";
  const serialized = serialize_schema(data);

  mkdirSync("public/schemas", { recursive: true });
  writeFileSync(`public/schemas/${filename}`, JSON.stringify(serialized, null, 2));
  schemaFiles.push({ label, file: filename });
}

writeFileSync(
  "public/schemas/manifest.json",
  JSON.stringify(
    {
      version: version,
      schemas: schemaFiles,
    },
    null,
    2,
  ),
);

console.log(`Extracted ${schemaFiles.length} schemas (v${version}) to public/schemas/`);
