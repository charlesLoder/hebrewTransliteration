import type { SBL } from "hebrew-transliteration";

export interface SerializableSchemaFeature {
  FEATURE: "word" | "syllable" | "cluster";
  HEBREW: string | { __regexp: string; flags: string };
  PASS_THROUGH: boolean;
  TRANSLITERATION: string | { __function: string };
}

export function serialize_value(key: string, value: unknown): unknown {
  if (typeof value === "function") {
    return { __function: value.toString() };
  }
  if (value instanceof RegExp) {
    return { __regexp: value.source, flags: value.flags };
  }
  return value;
}

export function deserialize_value(value: unknown): unknown {
  if (value && typeof value === "object") {
    const obj = value as Record<string, unknown>;
    if ("__function" in obj && typeof obj.__function === "string") {
      return eval(`(${obj.__function})`);
    }
    if ("__regexp" in obj && typeof obj.__regexp === "string") {
      return new RegExp(obj.__regexp, (obj.flags as string) ?? "");
    }
  }
  return value;
}

export function deserialize_object(obj: unknown): unknown {
  if (typeof obj !== "object" || obj === null) return obj;
  if (obj instanceof RegExp) return obj;

  if (Array.isArray(obj)) {
    return obj.map(deserialize_object);
  }

  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    result[key] = deserialize_value(deserialize_object(value));
  }
  return result;
}

export function serialize_object(obj: unknown): unknown {
  if (typeof obj !== "object" || obj === null) return obj;
  if (obj instanceof RegExp) {
    return { __regexp: obj.source, flags: obj.flags };
  }

  if (Array.isArray(obj)) {
    return obj.map(serialize_object);
  }

  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    result[key] = serialize_value(key, serialize_object(value));
  }
  return result;
}

export function serialize_schema(schema: Partial<SBL>): Partial<SBL> {
  return serialize_object(schema) as Partial<SBL>;
}

export function deserialize_schema(data: Partial<SBL>): Partial<SBL> {
  return deserialize_object(data) as Partial<SBL>;
}
