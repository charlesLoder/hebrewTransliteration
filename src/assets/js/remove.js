//@ts-check
import { Wizard } from "./wizard";
import { Wrapper } from "./wrapper";
import { feedbackFormInit } from "./feedback";
import { Spinner } from "./spinner";

feedbackFormInit();

const defaultOpions = {
  ETNAHTA: true,
  SEGOLTA: true,
  SHALSHELET: true,
  ZAQEF_QATAN: true,
  ZAQEF_GADOL: true,
  TIPEHA: true,
  REVIA: true,
  ZARQA: true,
  PASHTA: true,
  YETIV: true,
  TEVIR: true,
  GERESH: true,
  GERESH_MUQDAM: true,
  GERSHAYIM: true,
  QARNEY_PARA: true,
  TELISHA_GEDOLA: true,
  PAZER: true,
  ATNAH_HAFUKH: true,
  MUNAH: true,
  MAHAPAKH: true,
  MERKHA: true,
  MERKHA_KEFULA: true,
  DARGA: true,
  QADMA: true,
  TELISHA_QETANA: true,
  YERAH_BEN_YOMO: true,
  OLE: true,
  ILUY: true,
  DEHI: true,
  ZINOR: true,
  METEG: true,
  RAFE: true,
  SOF_PASUQ: true,
  PUNC_GERESH: false,
  PUNC_GERSHAYIM: false,
};

const wrapper = new Wrapper();
const loadingSpinner = new Spinner(
  /** @type {Element} */ (document.querySelector("#spinner")),
  /** @type {Element} */ (document.querySelector("#btn-txt"))
);

// Wizard setup
const steps = /** @type {HTMLDivElement} */ (document.querySelector("#remove-modal #modal-cards"))
  .children;
const nextBtn = /** @type {HTMLButtonElement} */ (document.querySelector("#next-btn"));
const prevBtn = /** @type {HTMLButtonElement} */ (document.querySelector("#prev-btn"));
const finalBtn = /** @type {HTMLButtonElement} */ (document.querySelector("#final-btn"));
const wizard = new Wizard(
  steps,
  "d-block",
  "d-none",
  { btn: prevBtn, text: "Previous" },
  { btn: nextBtn, text: "Next" },
  { btn: finalBtn, text: "Done" }
);
wizard.init();

/**
 * step through form wizard with arrows
 */
function checkKey(e) {
  // if the modal is not open, do nothing
  if (/** @type {HTMLDivElement} */ (document.querySelector("#remove-modal")).offsetTop !== 0)
    return;

  e = e || window.event;

  // left arrow
  if (e.keyCode == "37") wizard.prevWindow();

  // right arrow
  if (e.keyCode == "39") wizard.nextWindow();
}

document.onkeydown = checkKey;

// controls

const input = /** @type {HTMLTextAreaElement} */ (document.querySelector("#input"));
const output = /** @type {HTMLTextAreaElement} */ (document.querySelector("#output"));
const actionBtn = /** @type {HTMLButtonElement} */ (document.querySelector("#action-btn"));
const selectAllInputs = Array.from(
  /** @type {NodeListOf<HTMLInputElement>} */ (document.querySelectorAll("[id^='select-all-']"))
);

function getOptionKeys() {
  return Array.from(document.querySelectorAll("input.option")).map((e) => e.id);
}

/**
 * gets an object option values from modal
 */
function getOptions() {
  return Array.from(
    /** @type {NodeListOf<HTMLInputElement>} */ (document.querySelectorAll("input.option"))
  )
    .map((e) => ({
      [e.id]: e.checked,
    }))
    .reduce((a, c) => ({ ...a, ...c }), {});
}

/**
 * sets the modal input values
 *
 * @param {{[x: string]: boolean}} options
 * @returns
 */
function setOptions(options) {
  Array.from(
    /** @type {NodeListOf<HTMLInputElement>} */ (document.querySelectorAll("input.option"))
  ).forEach((input) => {
    if (options[input.id]) {
      input.checked = options[input.id];
    }
  });
}

/**
 *
 * @returns {{[x: string]: boolean} | null} options set in local storage
 */
function getLocalStorageOptions() {
  const ls = localStorage.getItem("REMOVE_OPTIONS");
  if (!ls) return null;
  return JSON.parse(ls);
}

/**
 *
 * @param {{[x: string]: boolean}} vals
 * @retuns object set in local storage
 */
function setLocalStorageOptions(vals) {
  localStorage.setItem(`REMOVE_OPTIONS`, JSON.stringify(vals));
}

// event listeners
actionBtn.addEventListener("click", async () => {
  try {
    const options = getOptions();
    if (!wrapper.supportsRegexLookAheadLookBehind()) loadingSpinner.toggleSpinnerOn();
    output.value = await wrapper.remove(input.value || input.placeholder, options);
    if (!wrapper.supportsRegexLookAheadLookBehind()) loadingSpinner.toggleSpinnerOff();
    setLocalStorageOptions(options);
  } catch (error) {
    console.log(error);
    output.value = error.message ?? "Hmmm...it seems something went wrong";
  }
});

selectAllInputs.forEach((input, index) => {
  input.addEventListener("input", () => {
    const val = input.checked;
    /** @type {NodeListOf<HTMLInputElement>} */ (
      document.querySelectorAll(`#step-${index + 1}-form input`)
    ).forEach((input) => (input.checked = val));
  });
});

// on load
if (!wrapper.supportsRegex) {
  /** @type {HTMLDivElement} */ (document.querySelector("#browser-alert")).hidden = false;
}

setOptions(getLocalStorageOptions() || defaultOpions);
