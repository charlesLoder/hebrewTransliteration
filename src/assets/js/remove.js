import { Wizard } from "./wizard";
import { Wrapper } from "./wrapper";

const wrapper = new Wrapper();

// Wizard setup
const steps = document.querySelector("#modal-cards").children;
const nextBtn = document.querySelector("#next-btn");
const prevBtn = document.querySelector("#prev-btn");
const finalBtn = document.querySelector("#final-btn");
const wizard = new Wizard(
  steps,
  "d-block",
  "d-none",
  { btn: prevBtn, text: "Previous" },
  { btn: nextBtn, text: "Next" },
  { btn: finalBtn, text: "Done" }
);
wizard.init();

// controls
const input = document.querySelector("#input");
const output = document.querySelector("#output");
const actionBtn = document.querySelector("#action-btn");

// event listeners
actionBtn.addEventListener("click", async () => {
  try {
    const options = {
      removeVowels: document.querySelector("#removeVowels").checked,
      removeShinDot: document.querySelector("#removeShinDot").checked,
      removeSinDot: document.querySelector("#removeSinDot").checked,
    };
    output.value = await wrapper.remove(input.value || input.placeholder, options);
  } catch (error) {
    console.log(error);
    output.value = error.message ?? "Hmmm...it seems something went wrong";
  }
});

if (!wrapper.supportsRegex) {
  document.querySelector("#browser-alert").hidden = false;
}
