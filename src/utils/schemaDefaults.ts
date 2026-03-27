import { SBL } from "hebrew-transliteration";

/**
 * Get default SBL schema values.
 * Instantiates SBL class and returns a Partial<SBL> with all default values.
 * This ensures we use the package's official defaults, not hardcoded values.
 */
export function get_default_SBL_schema(): Partial<SBL> {
  try {
    return new SBL({});
  } catch (error) {
    console.warn("Failed to instantiate SBL class for defaults:", error);
    return {};
  }
}
