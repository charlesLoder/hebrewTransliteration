export interface SchemaCompletion {
  label: string;
  type: string;
  detail?: string;
}

export function get_schema_completions(
  consonants: readonly string[],
  vowels: readonly string[],
): SchemaCompletion[] {
  const keys = [...consonants, ...vowels];
  const completions: SchemaCompletion[] = [];

  for (const key of keys) {
    completions.push(
      {
        label: `schema["${key}"]`,
        type: "variable",
        detail: "consonant/vowel",
      },
      { label: `schema.${key}`, type: "variable", detail: "consonant/vowel" },
    );
  }

  return completions;
}
