const inputBtn = document.querySelector("#input_button");
const input = document.querySelector("#input");
const output = document.querySelector("#output");
const heb = require("hebrew-transliteration");
const remove = heb.remove;

const removeTransliteration = (hebText) => {
  return remove(hebText, {
    removeVowels: document.querySelector("#removeVowels").checked,
    removeShinDot: document.querySelector("#removeShinDot").checked,
    removeSinDot: document.querySelector("#removeSinDot").checked,
  });
};

document.querySelectorAll(".check-wrapper").forEach((el) =>
  el.addEventListener("change", () => {
    output.placeholder = removeTransliteration(input.placeholder);
  })
);

inputBtn.addEventListener("click", () => {
  output.value = removeTransliteration(input.value);
});
