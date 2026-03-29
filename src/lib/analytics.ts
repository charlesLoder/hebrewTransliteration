declare global {
  interface Window {
    gtag: (
      command: "config" | "event" | "js",
      targetId: string | Date,
      config?: Record<string, unknown>,
    ) => void;
    dataLayer: unknown[];
  }
}

export function get_GA_id(): string | undefined {
  return import.meta.env.PUBLIC_GA_TAG_ID;
}

export function is_GA_configured(): boolean {
  return typeof get_GA_id() === "string" && get_GA_id()!.length > 0;
}

export function track_page_view(pagePath: string, pageTitle: string): void {
  if (!is_GA_configured()) return;
  window.gtag("config", get_GA_id()!, {
    page_path: pagePath,
    page_title: pageTitle,
  });
}

export interface TransliterationEventParams {
  schema: string;
  has_niqqud: boolean;
}

export function track_transliteration(params: TransliterationEventParams): void {
  if (!is_GA_configured()) return;
  window.gtag("event", "perform_transliteration", {
    schema: params.schema,
    has_niqqud: params.has_niqqud,
  });
}

export interface RemovalEventParams {
  removed_vowels: boolean;
  removed_cantillation: boolean;
  removed_punctuation: boolean;
}

export function track_removal(params: RemovalEventParams): void {
  if (!is_GA_configured()) return;
  window.gtag("event", "perform_removal", {
    removed_vowels: params.removed_vowels,
    removed_cantillation: params.removed_cantillation,
    removed_punctuation: params.removed_punctuation,
  });
}

export interface StructureEventParams {
  has_custom_whitespace: boolean;
}

export function track_structure(params: StructureEventParams): void {
  if (!is_GA_configured()) return;
  window.gtag("event", "perform_structure", {
    has_custom_whitespace: params.has_custom_whitespace,
  });
}

export type SchemaChangeType =
  | "preset_change"
  | "manual_edit"
  | "feature_add"
  | "feature_edit"
  | "feature_delete"
  | "reset";

export interface SchemaChangeEventParams {
  change_type: SchemaChangeType;
  schema: string | undefined;
}

export function track_schema_change(params: SchemaChangeEventParams): void {
  if (!is_GA_configured()) return;
  window.gtag("event", "schema_customization", {
    change_type: params.change_type,
    schema: params.schema,
  });
}
