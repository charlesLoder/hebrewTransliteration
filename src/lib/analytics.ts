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

export function getGAId(): string | undefined {
  return import.meta.env.PUBLIC_GA_TAG_ID;
}

export function isGAConfigured(): boolean {
  return typeof getGAId() === "string" && getGAId()!.length > 0;
}

export function initGA(): void {
  if (!isGAConfigured()) return;

  const gaId = getGAId()!;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer.push(args);
  };
  window.gtag("js", new Date());
  window.gtag("config", gaId, { send_page_view: false });
}

export function trackPageView(pagePath: string, pageTitle: string): void {
  if (!isGAConfigured()) return;
  window.gtag("config", getGAId()!, {
    page_path: pagePath,
    page_title: pageTitle,
  });
}

export interface TransliterationEventParams {
  schema: string;
  has_niqqud: boolean;
}

export function trackTransliteration(params: TransliterationEventParams): void {
  if (!isGAConfigured()) return;
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

export function trackRemoval(params: RemovalEventParams): void {
  if (!isGAConfigured()) return;
  window.gtag("event", "perform_removal", {
    removed_vowels: params.removed_vowels,
    removed_cantillation: params.removed_cantillation,
    removed_punctuation: params.removed_punctuation,
  });
}

export interface StructureEventParams {
  has_custom_whitespace: boolean;
}

export function trackStructure(params: StructureEventParams): void {
  if (!isGAConfigured()) return;
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

export function trackSchemaChange(params: SchemaChangeEventParams): void {
  if (!isGAConfigured()) return;
  window.gtag("event", "schema_customization", {
    change_type: params.change_type,
    schema: params.schema,
  });
}
