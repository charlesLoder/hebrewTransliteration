import { Wizard } from "./wizard";
import { toggleSpinnerOff, toggleSpinnerOn } from "./spinner";

const defaultOpts = {
  "0591": "\\n",
  "05C3": "\\n",
};

/**
 * loads options from localStorage
 *
 * @param {{key: string; value: string}[]} options
 */
const loadOptions = (options, defaultOpts) => {
  options.forEach((o) => {
    const v = localStorage.getItem(o.key) ?? defaultOpts[o.key] ?? null;
    const input = document.querySelector(`[id='${o.key}']`);
    if (v && input) {
      input.value = v;
    } else input.value = "";
  });
};

/**
 * sets options to localStorage
 *
 * @param {{key: string; value: string}[]} options ids for form inputs
 */
const setOptions = (options) => {
  options.forEach((o) => {
    if (o.value) {
      localStorage.setItem(o.key, o.value);
    }
  });
};

/**
 *
 * @param {string} selector select for querySelector
 * @returns
 */
const getInputVals = (selector) => {
  const inputs = new FormData(document.querySelector(selector));
  const entries = Object.fromEntries(inputs);
  return Object.entries(entries).map(([key, value]) => ({ key, value }));
};

/**
 *
 * @param {string} text
 * @param {{key: string, value: string}[]} options
 * @returns
 */
const structure = async (text, options) => {
  try {
    const resp = await fetch("/api/structure", {
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
    console.error(error);
  }
};

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
    const options = getInputVals("form");
    toggleSpinnerOn();
    output.value = await structure(input.value || input.placeholder, options);
    toggleSpinnerOff();
    setOptions(options);
  } catch (error) {
    output.value = "Hmmm...it seems something went wrong";
    console.error(error);
  }
});

// on load
loadOptions(getInputVals("form"), defaultOpts);
