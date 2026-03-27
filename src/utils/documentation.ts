export const docs_base_url = "https://charlesloder.github.io/hebrew-transliteration/";

export function format_doc_url(path: string, key: string): string {
  return `${docs_base_url}${path}#${key.toLowerCase()}`;
}

export function format_label(key: string): string {
  return key
    .split("_")
    .map((part) => part.charAt(0) + part.slice(1).toLowerCase())
    .join(" ");
}
