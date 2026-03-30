import type { RemoveOptions, SBL } from "hebrew-transliteration";
import type { StructureOptions } from "../services/structureService";

export type AppStatus = "idle" | "loading" | "processing" | "error";

export type DialogViewState = "open" | "close";

export type VisibilityState = "hidden" | "visible";

export type CopyState = "idle" | "copied" | "error";

export interface Context<T> {
  get value(): T;
  set value(v: T);
}

/**
 * Application state for transliteration.
 * Schema options are derived from the SBL class to avoid recreating types.
 */
export interface TransliterationState {
  dialog_view_state: DialogViewState;
  input: string;
  input_placeholder: string;
  output: string;
  schema: Partial<SBL>;
  selected_schema_name: string;
  modified_schema_base: string | null;
}

/**
 * Event dispatched when a schema option is updated.
 * Key is the option name, value is the new value (or empty string to remove).
 */
export interface SchemaUpdateEvent {
  key: string;
  value: string;
}

export interface RemoveState {
  dialog_view_state: DialogViewState;
  input: string;
  input_placeholder: string;
  output: string;
  options: RemoveOptions;
}

export interface StructureState {
  dialog_view_state: DialogViewState;
  input: string;
  input_placeholder: string;
  output: string;
  options: StructureOptions;
}
