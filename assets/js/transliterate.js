const inputBtn = document.querySelector('#input_button');
const input = document.querySelector('#input');
const output = document.querySelector('#output');
const simpleBox = document.querySelector('#isSimple')
const heb = require('hebrew-transliteration');
const transliterate = heb.transliterate;

simpleBox.addEventListener('change', (e) => {
    if (e.target.checked) {
        output.placeholder = 'ivrit';
    } else {
        output.placeholder = 'ʿibrît';
    }
})

inputBtn.addEventListener('click', () => {
    let qametsQatanVal = document.querySelector('#qametsQatan').checked;
    let isSimpleVal = simpleBox.checked
    let hebText = input.value;
    let transText = transliterate(hebText, { isSequenced: true, qametsQatan: qametsQatanVal, isSimple: isSimpleVal });
    output.value = transText;
})
