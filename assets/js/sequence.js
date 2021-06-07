const inputBtn = document.querySelector("#input_button");
const input = document.querySelector("#input");
const output = document.querySelector("#output");
const heb = require("hebrew-transliteration");
const sequence = heb.sequence;

inputBtn.addEventListener("click", () => {
  let hebText = input.value;
  let transText = sequence(hebText);
  output.value = transText;
});
