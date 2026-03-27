import { Text } from "hebrew-transliteration";

export type WhitespaceOption = "none" | "tab" | "new_line";

export interface StructureOptions {
  "05C3": WhitespaceOption;
  "0591": WhitespaceOption;
  "0592": WhitespaceOption;
  "0593": WhitespaceOption;
  "0594": WhitespaceOption;
  "0595": WhitespaceOption;
  "0596": WhitespaceOption;
  "0597": WhitespaceOption;
  "05AE": WhitespaceOption;
  "0599": WhitespaceOption;
  "059A": WhitespaceOption;
  "059B": WhitespaceOption;
  "059C": WhitespaceOption;
  "059E": WhitespaceOption;
  "05A1": WhitespaceOption;
  "059F": WhitespaceOption;
  "05A0": WhitespaceOption;
}

export interface StructureInput {
  text: string;
  options: StructureOptions;
}

export interface StructureResult {
  success: boolean;
  output: string;
  error?: string;
}

const defaultOptions: StructureOptions = {
  "05C3": "new_line",
  "0591": "new_line",
  "0592": "none",
  "0593": "none",
  "0594": "none",
  "0595": "none",
  "0596": "none",
  "0597": "none",
  "05AE": "none",
  "0599": "none",
  "059A": "none",
  "059B": "none",
  "059C": "none",
  "059E": "none",
  "05A1": "none",
  "059F": "none",
  "05A0": "none",
};

function getWhitespace(whitespaceOption: WhitespaceOption): string {
  switch (whitespaceOption) {
    case "tab":
      return "\t";
    case "new_line":
      return "\n";
    case "none":
    default:
      return " ";
  }
}

function isPituchaOrStuma(text: string): boolean {
  return /^^[פ|ס]$/.test(text);
}

function hasTaamim(word: { text: string; taamim: string[] }, unicodeHex: string): boolean {
  if (unicodeHex === "05C3") {
    return word.text.includes("\u05C3");
  }
  return word.taamim.some((t) => {
    const hex = t.codePointAt(0)?.toString(16).toUpperCase().padStart(4, "0") || "";
    return hex === unicodeHex;
  });
}

export function getDefaultStructureOptions(): StructureOptions {
  return { ...defaultOptions };
}

export function performStructure(input: StructureInput): StructureResult {
  const trimmedInput = input.text.trim();

  if (!trimmedInput) {
    return {
      success: true,
      output: "",
    };
  }

  try {
    const text = new Text(trimmedInput);
    const words = text.words;

    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const nextWord = words[i + 1];

      if (nextWord && isPituchaOrStuma(nextWord.text)) {
        nextWord.whiteSpaceAfter = word.whiteSpaceAfter;
        continue;
      }

      let foundWhitespace = false;

      for (const unicodeHex of Object.keys(input.options)) {
        if (hasTaamim(word, unicodeHex)) {
          const option = input.options[unicodeHex as keyof StructureOptions];
          if (option && option !== "none") {
            word.whiteSpaceAfter = getWhitespace(option);
            foundWhitespace = true;
            break;
          }
        }
      }

      if (!foundWhitespace) {
        word.whiteSpaceAfter = " ";
      }
    }

    const result = words.map((w) => `${w.text}${w.whiteSpaceAfter || " "}`).join("");

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
