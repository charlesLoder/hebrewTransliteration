//@ts-check

import { Wizard } from "./wizard";
// modal for feedback
const feedbackSteps = /** @type {HTMLDivElement} */ (
  document.querySelector("#feedback-modal #modal-cards")
).children;
const feedbackNextBtn = /** @type {HTMLButtonElement} */ (
  document.querySelector("#feedback-modal #next-btn")
);
const feedbackPrevBtn = /** @type {HTMLButtonElement} */ (
  document.querySelector("#feedback-modal #prev-btn")
);
const feedbackFinalBtn = /** @type {HTMLButtonElement} */ (
  document.querySelector("#feedback-modal #final-btn")
);
const feedbackWizard = new Wizard(
  feedbackSteps,
  "d-block",
  "d-none",
  { btn: feedbackPrevBtn, text: "Previous" },
  { btn: feedbackNextBtn, text: "Next" },
  { btn: feedbackFinalBtn, text: "Done" }
);

export { feedbackWizard };
