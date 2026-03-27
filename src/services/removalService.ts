import type { RemoveOptions } from "hebrew-transliteration";
import { remove } from "hebrew-transliteration";

export interface RemovalInput {
  text: string;
  options: RemoveOptions;
}

export interface RemovalResult {
  success: boolean;
  output: string;
  error?: string;
}

export function performRemoval(input: RemovalInput): RemovalResult {
  const trimmedInput = input.text.trim();

  if (!trimmedInput) {
    return {
      success: true,
      output: "",
    };
  }

  try {
    const result = remove(trimmedInput, input.options);

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
