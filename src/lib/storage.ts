export const is_browser = typeof window !== "undefined";

export function load_settings<T>(key: string, defaults: T): T {
  if (!is_browser) return defaults;
  try {
    const stored = localStorage.getItem(key);
    return stored ? (JSON.parse(stored) as T) : defaults;
  } catch {
    return defaults;
  }
}

export function save_settings<T>(key: string, value: T): void {
  if (!is_browser) return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn("Failed to save settings to localStorage:", error);
  }
}

export function clear_settings(key: string): void {
  if (!is_browser) return;
  localStorage.removeItem(key);
}
