import type { SBL } from "hebrew-transliteration";
import { transliterate } from "hebrew-transliteration";

/**
 * Transliteration service - handles all business logic for transliterating Hebrew text.
 * Pure functions with no side effects or component dependencies.
 */

export interface TransliterationInput {
  text: string;
  schemaOptions: Partial<SBL>;
}

export interface TransliterationResult {
  success: boolean;
  output: string;
  error?: string;
}

/**
 * Transliterate Hebrew text with given options.
 * @param input Hebrew text to transliterate
 * @param schemaOptions Schema mapping options
 * @param syllabificationOptions Syllabification options
 * @returns Transliteration result with output or error message
 */
export function performTransliteration(input: TransliterationInput): TransliterationResult {
  const trimmedInput = input.text.trim();

  if (!trimmedInput) {
    return {
      success: true,
      output: "",
    };
  }

  try {
    // Merge schema and syllabification options
    const allOptions = {
      ...input.schemaOptions,
    };

    const result = transliterate(trimmedInput, allOptions);

    return {
      success: true,
      output: result,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";

    return {
      success: false,
      output: "",
      error: errorMessage,
    };
  }
}
