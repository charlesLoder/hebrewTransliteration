const inputBtn = document.querySelector("#input_button");
const input = document.querySelector("#input");
const output = document.querySelector("#output");
const heb = require("hebrew-transliteration");
const remove = heb.remove;

inputBtn.addEventListener("click", () => {
  let removeVowelsVal = document.querySelector("#removeVowels").checked;
  let removeShinVal = document.querySelector("#removeShinDot").checked;
  let removeSinVal = document.querySelector("#removeSinDot").checked;
  let hebText = input.value;
  let transText = remove(hebText, {
    removeVowels: removeVowelsVal,
    removeShinDot: removeShinVal,
    removeSinDot: removeSinVal,
  });
  output.value = transText;
});
