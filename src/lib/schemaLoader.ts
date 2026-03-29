import type { SBL } from "hebrew-transliteration";
import { deserialize_object } from "./schemaSerialization";

export type SchemaLoaderState = "idle" | "loading" | "success" | "error";

export interface SchemaManifest {
  version: string;
  schemas: Array<{ label: string; file: string }>;
}

let manifest: SchemaManifest | null = null;
const loadedSchemas = new Map<string, Partial<SBL>>();
let loadState: SchemaLoaderState = "idle";
let loadError: string | null = null;

function slugify(label: string): string {
  return label.toLowerCase().replace(/[^a-z0-9]+/g, "-") + ".json";
}

export function get_schema_loader_state(): SchemaLoaderState {
  return loadState;
}

export function get_schema_loader_error(): string | null {
  return loadError;
}

export async function load_schema_manifest(): Promise<SchemaManifest> {
  if (manifest !== null) return manifest;

  loadState = "loading";
  loadError = null;

  try {
    const response = await fetch("/schemas/manifest.json");
    if (!response.ok) throw new Error(`Failed to load manifest: ${response.status}`);

    const data = await response.json();
    manifest = data as SchemaManifest;
    loadState = "success";
    return manifest;
  } catch (err) {
    loadState = "error";
    loadError = err instanceof Error ? err.message : "Unknown error";
    throw err;
  }
}

export async function load_schema(label: string): Promise<Partial<SBL>> {
  if (loadedSchemas.has(label)) {
    return loadedSchemas.get(label)!;
  }

  const slug = slugify(label);
  const response = await fetch(`/schemas/${slug}`);
  if (!response.ok) throw new Error(`Failed to load schema ${label}: ${response.status}`);

  const data = await response.json();
  const schema = deserialize_object(data) as Partial<SBL>;
  loadedSchemas.set(label, schema);
  return schema;
}

export function get_default_schema_fallback(): Partial<SBL> {
  return {
    ADDITIONAL_FEATURES: [],
    DAGESH_CHAZAQ: true,
    STRESS_MARKER: undefined,
  };
}
