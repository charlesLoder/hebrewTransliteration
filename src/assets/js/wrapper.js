//@ts-check
import { transliterate as hebTransliterate, Schema, remove } from "hebrew-transliteration";

/**
 * a wrapper class to abstract handling functions from hebrew-transliteration
 *
 */
export class Wrapper {
  constructor() {
    this.supportsRegex = this.supportsRegexLookAheadLookBehind();
  }
  /**
   * check if regex lookahead and lookbehind supported
   *
   * @returns {boolean}
   */
  supportsRegexLookAheadLookBehind() {
    try {
      return (
        "hibyehihi"
          .replace(new RegExp("(?<=hi)hi", "g"), "hello")
          .replace(new RegExp("hi(?!bye)", "g"), "hey") === "hibyeheyhello"
      );
    } catch (error) {
      return false;
    }
  }
  /**
   * posts errors to the /api/error route
   *
   * @param {any} error
   * @param {string} text
   * @param {{[k:string]: any}} options
   */
  postError(error, text, options) {
    fetch("/api/error", {
      method: "POST",
      body: JSON.stringify({
        text,
        error: error?.message || error,
        path: window.location.pathname,
        options: JSON.stringify(options),
        browser: navigator.userAgent,
      }),
    });
  }
  /**
   * gets transliteration from Netlify function
   *
   * @param {string} text
   * @param {Schema} schema
   * @returns {Promise<string>} a transliterated string
   */
  async fetchTransliteration(text, schema) {
    try {
      const resp = await fetch("/api/transliterate", {
        method: "POST",
        body: JSON.stringify({
          text: text,
          schema: schema,
        }),
      });
      if (!resp.ok) throw await resp.json();
      const json = await resp.json();
      return json.transliteration;
    } catch (error) {
      throw error;
    }
  }
  /**
   * gets text from Netlify function
   *
   * @param {string} text
   * @param {{[x: string]: boolean}} options
   * @returns {Promise<string>} a string with options removed
   */
  async fetchRemove(text, options) {
    try {
      const resp = await fetch("/api/remove", {
        method: "POST",
        body: JSON.stringify({
          text: text,
          options: options,
        }),
      });
      if (!resp.ok) throw await resp.json();
      const json = await resp.json();
      return json.text;
    } catch (error) {
      throw error;
    }
  }
  /**
   * wrapper around the `transliterate()` function
   *
   * @param {string} text
   * @param {Schema} schema
   * @returns {Promise<string>} a transliterated string
   */
  async transliterate(text, schema) {
    try {
      if (!this.supportsRegex) {
        return await this.fetchTransliteration(text, schema);
      }
      return hebTransliterate(text, schema);
    } catch (error) {
      this.postError(error, text, schema);
      throw error;
    }
  }
  /**
   * a wrapper around the `remove()` function
   *
   * @param {string} text
   * @param {{[x: string]: boolean}} options
   */
  async remove(text, options) {
    try {
      if (!this.supportsRegex) {
        return await this.fetchRemove(text, options);
      }
      return remove(text, options);
    } catch (error) {
      this.postError(error, text, options);
      throw error;
    }
  }
}
