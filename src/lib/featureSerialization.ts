import type { SBL } from "hebrew-transliteration";

type Feature = NonNullable<SBL["ADDITIONAL_FEATURES"]>[number];

type SerializableHebrew = string | { source: string; flags: string };
type SerializableTransliteration = string | { __callback: string };

export interface SerializableFeature {
  FEATURE: "word" | "syllable" | "cluster";
  HEBREW: SerializableHebrew;
  PASS_THROUGH: boolean;
  TRANSLITERATION: SerializableTransliteration;
}

export function serialize_features(features: Feature[]): SerializableFeature[] {
  return features.map((f) => ({
    FEATURE: f.FEATURE,
    HEBREW:
      f.HEBREW instanceof RegExp ? { source: f.HEBREW.source, flags: f.HEBREW.flags } : f.HEBREW,
    PASS_THROUGH: f.PASS_THROUGH ?? true,
    TRANSLITERATION:
      typeof f.TRANSLITERATION === "function"
        ? { __callback: f.TRANSLITERATION.toString() }
        : f.TRANSLITERATION,
  }));
}

function deserialize_callback(code: string): (...args: unknown[]) => unknown {
  return eval(`(${code})`) as (...args: unknown[]) => unknown;
}

export function deserialize_features(features: SerializableFeature[]): Feature[] {
  return features.map((f) => {
    const hebrewValue = f.HEBREW;
    const hebrew =
      typeof hebrewValue === "object" && "source" in hebrewValue && "flags" in hebrewValue
        ? new RegExp(hebrewValue.source, hebrewValue.flags)
        : (hebrewValue as string);

    const transValue = f.TRANSLITERATION;
    const transliteration =
      typeof transValue === "object" && "__callback" in transValue
        ? deserialize_callback(transValue.__callback)
        : (transValue as string);

    return {
      FEATURE: f.FEATURE,
      HEBREW: hebrew,
      PASS_THROUGH: f.PASS_THROUGH,
      TRANSLITERATION: transliteration,
    } as Feature;
  });
}

export function serialize_schema(schema: Partial<SBL>): Partial<SBL> {
  if (!schema.ADDITIONAL_FEATURES) return schema;
  return {
    ...schema,
    ADDITIONAL_FEATURES: serialize_features(
      schema.ADDITIONAL_FEATURES,
    ) as SBL["ADDITIONAL_FEATURES"],
  };
}

export function deserialize_schema(schema: Partial<SBL>): Partial<SBL> {
  if (!schema.ADDITIONAL_FEATURES) return schema;
  return {
    ...schema,
    ADDITIONAL_FEATURES: deserialize_features(
      schema.ADDITIONAL_FEATURES as SerializableFeature[],
    ) as SBL["ADDITIONAL_FEATURES"],
  };
}
