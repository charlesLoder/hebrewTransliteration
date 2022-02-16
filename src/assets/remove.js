import { remove } from "hebrew-transliteration";

// controls
const input = document.querySelector("#input");
const output = document.querySelector("#output");
const actionBtn = document.querySelector("#action-btn");

/**
 * Event listeners
 */
actionBtn.addEventListener("click", () => {
  try {
    const options = {
      removeVowels: document.querySelector("#removeVowels").checked,
      removeShinDot: document.querySelector("#removeShinDot").checked,
      removeSinDot: document.querySelector("#removeSinDot").checked,
    };
    output.value = remove(input.value || input.placeholder, options);
  } catch (error) {
    console.log(error);
    output.value = error.message ?? "Hmmm...it seems something went wrong";
  }
});
