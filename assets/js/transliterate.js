const inputBtn = document.querySelector("#input_button");
const input = document.querySelector("#input");
const output = document.querySelector("#output");
const simpleBtn = document.querySelector("#isSimple");
const qametsBtn = document.querySelector("#qametsQatan");
const qametsInfo = document.querySelector("#qametsInfo");
const heb = require("hebrew-transliteration");
const transliterate = heb.transliterate;

simpleBtn.addEventListener("change", (e) => {
  if (e.target.checked) {
    output.placeholder = "ivrit";
  } else {
    output.placeholder = "ʿibrît";
  }
});

// start off hidden
qametsInfo.hidden = true;
qametsBtn.addEventListener("change", (e) => {
  if (e.target.checked) {
    qametsInfo.hidden = false;
  } else {
    qametsInfo.hidden = true;
  }
});

inputBtn.addEventListener("click", () => {
  try {
    let qametsQatanVal = qametsBtn.checked;
    let isSimpleVal = simpleBtn.checked;
    let hebText = input.value;
    const niqqud = /[\u{05B0}-\u{05BC},\u{05C7}]/u;
    if (!niqqud.test(hebText)) {
      let mssg =
        "The text entered does not have any niqqud (vowels).\nThis will only transliterate consonants.\nVisit https://nakdan.dicta.org.il/ for adding niqqud to text";
      alert(mssg);
    }
    let transText = transliterate(hebText, {
      isSequenced: true,
      qametsQatan: qametsQatanVal,
      isSimple: isSimpleVal,
    });
    output.value = transText;
  } catch (e) {
    alert(`There was an error: ${e.message}`);
  }
});
