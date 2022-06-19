import { transliterate } from "hebrew-transliteration";

document.querySelectorAll(".heb-text-area").forEach((el) => {
  const hebText = el.textContent;
  el.addEventListener("click", () => {
    if (!/heb/.test(el.className)) {
      el.classList.remove("transliteration-text-area");
      el.classList.add("heb-text-area");
      el.textContent = hebText;
    } else {
      el.classList.add("transliteration-text-area");
      el.classList.remove("heb-text-area");
      el.textContent = transliterate(hebText);
    }
  });
});
