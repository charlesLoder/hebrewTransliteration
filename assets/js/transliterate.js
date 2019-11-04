const inputBtn = document.querySelector('#input_button');
const input = document.querySelector('#input');
const output = document.querySelector('#output');
const heb = require('hebrew-transliteration');
const transliterate = heb.transliterate;

inputBtn.addEventListener('click', () => {
  let qametsQatanVal = document.querySelector('#qametsQatan').checked;
  let hebText = input.value;
  let transText = transliterate(hebText, {isSequenced: true, qametsQatan: qametsQatanVal}); 
  output.value = transText;
})
