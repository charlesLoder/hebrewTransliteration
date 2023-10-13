import { Wrapper } from "./wrapper";
import { Schema } from "hebrew-transliteration";
import { Wizard } from "./wizard.js";
import { feedbackFormInit } from "./feedback";
import sblAcademic from "../../_data/sbl-academic.json";
import {
  sblSimple,
  sblAcademicSpirantization,
  brillAcademic,
  brillSimple,
  michiganClaremont,
  romaniote,
  jss,
  tiberian,
} from "hebrew-transliteration/schemas";
import { Spinner } from "./spinner";

feedbackFormInit();

/**
 * appends a div with the class ADDITIONAL_FEATURE to the parent
 *
 * @param {HTMLElement} parent
 * @param {string} hebrew
 * @param {string} transliteration
 * @param {string} feature "cluster" | "syllable" | "word"
 */
function addAdditonalFeature(parent, hebrew = "", transliteration = "", feature = "") {
  const additionalFeature = `
    <!-- HEBREW -->
    <div class="col-3 mr-5">
      <label for="HEBREW">Hebrew</label>
      <div class="d-flex align-items-center"><input type="text" class="form-control HEBREW" name="HEBREW">
      </div>
    </div>
    <!-- TRANSLITERATION -->
    <div class="col-5 mr-5">
      <label for="TRANSLITERATION">Transliteration</label>
      <div class="d-flex align-items-center"><input type="text" class="form-control TRANSLITERATION" name="TRANSLITERATION">
      </div>
    </div>
    <!-- FEATURE -->
    <div class="col-4">
      <label for="FEATURE">Feature</label>
      <select name="FEATURE" class="form-control FEATURE">
        <option value="">...</option>
        <option value="cluster">cluster</option>
        <option value="syllable">syllable</option>
        <option value="word">word</option>
      </select>
    </div>
`;
  // const el = htmlToElements(additionalFeature.trim());
  const el = document.createElement("div");
  el.classList.add("d-flex", "align-items-center", "mb-10", "ADDITIONAL_FEATURE");
  el.innerHTML = additionalFeature.trim();
  parent.appendChild(el);
  el.querySelector(".HEBREW").value = hebrew || "";
  el.querySelector(".TRANSLITERATION").value = transliteration || "";
  el.querySelector(".FEATURE").value = feature || "";
}

/**
 *
 * @param {HTMLElement} input
 * @param {string | boolean} val
 */
function updateInput(input, val) {
  const type = input?.type || undefined;
  switch (type) {
    case "checkbox":
      input.checked = val;
      break;
    case "text":
      input.value = val || "";
    default:
      break;
  }
}

/**
 * populates the modal with values from the Schema property by finding the HTMLElement with corresponding id
 *
 * @param {Schema} schema
 * @param {string} prop a property from the Schema type
 */
function populateSchemaModal(schema, prop) {
  try {
    if (prop === "STRESS_MARKER" && schema[prop]) {
      document.querySelector(`#${prop}  #location`).value = schema[prop]["location"];
      updateInput(document.querySelector(`#${prop}  #mark`), schema[prop]["mark"]);
    }
    if (prop === "ADDITIONAL_FEATURES" && schema[prop]) {
      schema[prop].forEach((f) => {
        addAdditonalFeature(
          document.querySelector(`#${prop}`),
          f["HEBREW"],
          f["TRANSLITERATION"],
          f["FEATURE"]
        );
      });
    }
    const input = document.querySelector(`#${prop}`);
    updateInput(input, schema[prop]);
  } catch (error) {
    console.error(error);
  }
}

/**
 * get the input's value according to the input's type
 * @param {HTMLElement} input
 * @returns {string | boolean} the input's value
 */
function getInputVal(input) {
  const type = input?.type || undefined;
  switch (type) {
    case "checkbox":
      return input.checked;
    case "text":
      return input.value;
    default:
      return undefined;
  }
}

/**
 * finds HTMLElements that correspond to the property and gets their value
 * @param {string[]} schemaProps
 * @returns {Partial<Schema>}
 */
function getSchemaModalVals(schemaProps) {
  return schemaProps.reduce((schema, prop) => {
    if (prop === "STRESS_MARKER") {
      schema["STRESS_MARKER"] = {
        location: document.querySelector(`#${prop}  #location`).value,
        mark: document.querySelector(`#${prop}  #mark`).value,
      };
      return schema;
    }
    if (prop === "ADDITIONAL_FEATURES") {
      schema["ADDITIONAL_FEATURES"] = [
        ...document.querySelectorAll(`#${prop} .ADDITIONAL_FEATURE`),
      ].map((el) => {
        return {
          HEBREW: el.querySelector(".HEBREW").value,
          TRANSLITERATION: el.querySelector(".TRANSLITERATION").value,
          FEATURE: el.querySelector(".FEATURE").value,
        };
      });
      return schema;
    }
    schema[prop] = getInputVal(document.querySelector(`#${prop}`));
    return schema;
  }, {});
}

/**
 * downloads a schema as a json file
 * @param {Schema} schema
 * @returns {void}
 */
function downloadSchema(schema) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(
    new Blob([JSON.stringify(schema, null, 2)], {
      type: "text/json",
    })
  );
  const date = new Date().toLocaleDateString().replaceAll("/", "-");
  a.setAttribute("download", `schema-${date}.json`);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

/**
 * checks if schema props are stored on local storage
 * @param {string[]} props
 * @returns {boolean}
 */
function checkLocalStorage(props) {
  return props.map((p) => localStorage.getItem(p)).filter((e) => e).length ? true : false;
}

/**
 * generates a schema from local storage
 * @param {string[]} props
 * @returns {Schema}
 */
function schemaFromLocalStorage(props) {
  return props.reduce((schema, prop) => {
    schema[prop] = localStorage.getItem(prop);
    return schema;
  }, {});
}

/**
 * populates the schema modal using either local storage or standard SBL
 *
 * @param {string[]} props schema properties
 * @returns {void}
 */
function loadSchema(props) {
  if (checkLocalStorage(props)) {
    document.querySelector("#last-visit").hidden = false;
    props.forEach((p) => populateSchemaModal(schemaFromLocalStorage(props), p));
    schemaSelect.value = localStorage.getItem("schemaSelect");
    return;
  }
  const academic = new Schema(sblAcademic);
  props.forEach((p) => populateSchemaModal(academic, p));
}

/**
 * sets a schema to local storage
 * @param {Schema} schema
 */
function setSchemaLocalStorage(schema) {
  const props = Object.keys(schema);
  props.forEach((p) => localStorage.setItem(p, schema[p]));
}

function checkLocalStoragePlaceholder(schemaName) {
  return (
    !localStorage.getItem("hebrewPlaceholderText") ||
    localStorage.getItem("hebrewPlaceholderText") !== input.placeholder ||
    !localStorage.getItem(schemaName)
  );
}

/**
 * gets the value for the output placeholder
 * @param {string} inputVal the Hebrew placeholder text to be transliterated
 * @param {Schema} schema
 * @param {string} schemaName the key for the output placeholder text
 */
async function getPlaceHolder(inputVal, schema, schemaName = "") {
  if (checkLocalStoragePlaceholder(schemaName)) {
    const transliteration = await wrapper.transliterate(inputVal, schema);
    localStorage.setItem("hebrewPlaceholderText", inputVal);
    localStorage.setItem(schemaName, transliteration);
    return transliteration;
  }

  return localStorage.getItem(schemaName);
}

/**
 * parses a json file
 * @param {File} file
 * @returns {Promise<Schema>}
 */
async function fileToJSON(file) {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onload = (event) => resolve(JSON.parse(event.target.result));
    fileReader.onerror = (error) => reject(error);
    fileReader.readAsText(file);
  });
}

// transliteration controls
const input = document.querySelector("#input");
const output = document.querySelector("#output");
const actionBtn = document.querySelector("#action-btn");

// modal for schema
const schemaSteps = document.querySelector("#schema-modal #modal-cards").children;
const schemaNextBtn = document.querySelector("#schema-modal #next-btn");
const schemaPrevBtn = document.querySelector("#schema-modal #prev-btn");
const schemaFinalBtn = document.querySelector("#schema-modal #final-btn");
const additionalFeatureBtn = document.querySelector("#additional-feature-btn");
const schemaSelect = document.querySelector("#select-schema");
const downloadSchemaBtn = document.querySelector("#download-schema");
const schemaInput = document.querySelector("#schema-input");
const wizard = new Wizard(
  schemaSteps,
  "d-block",
  "d-none",
  { btn: schemaPrevBtn, text: "Previous" },
  { btn: schemaNextBtn, text: "Next", initText: "Customize" },
  { btn: schemaFinalBtn, text: "Done" }
);
wizard.init();

// modal for tips
const tipsSteps = document.querySelector("#tips-modal #modal-cards").children;
const tipsNextBtn = document.querySelector("#tips-modal #next-btn");
const tipsPrevBtn = document.querySelector("#tips-modal #prev-btn");
const tipsFinalBtn = document.querySelector("#tips-modal #final-btn");
const tipsWizard = new Wizard(
  tipsSteps,
  "d-block",
  "d-none",
  { btn: tipsPrevBtn, text: "Previous" },
  { btn: tipsNextBtn, text: "Next" },
  { btn: tipsFinalBtn, text: "Done" }
);
tipsWizard.init();

const wrapper = new Wrapper();
const loadingSpinner = new Spinner(
  document.querySelector("#spinner"),
  document.querySelector("#btn-txt")
);

/**
 * step through form wizard with arrows
 */
function checkKey(e) {
  // if the modal is not open, do nothing
  if (document.querySelector("#schema-modal").offsetTop !== 0) return;

  // if an element is active, do nothing
  if (document.activeElement.tagName === ("INPUT" || "SELECT")) return;

  e = e || window.event;

  // left arrow
  if (e.keyCode == "37") wizard.prevWindow();

  // right arrow
  if (e.keyCode == "39") wizard.nextWindow();
}

document.onkeydown = checkKey;

/**
 * Event listeners
 */
actionBtn.addEventListener("click", async () => {
  try {
    const schema = getSchemaModalVals(schemaProps);
    if (!wrapper.supportsRegexLookAheadLookBehind()) loadingSpinner.toggleSpinnerOn();
    output.value = await wrapper.transliterate(input.value || input.placeholder, schema);
    if (!wrapper.supportsRegexLookAheadLookBehind()) loadingSpinner.toggleSpinnerOff();
    setSchemaLocalStorage(schema);
    localStorage.setItem("schemaSelect", schemaSelect.value);
  } catch (error) {
    output.value =
      "Hmmm...it seems something went wrong. Check the Tips button for best practices.";
    console.error(error);
  }
});

/**
 * when user selects a predefined schema,
 */
schemaSelect.addEventListener("change", async (e) => {
  switch (e.target.value) {
    case "sblSimple":
      schemaProps.forEach((p) => populateSchemaModal(sblSimple, p));
      output.placeholder = !output.value
        ? await getPlaceHolder(input.placeholder, getSchemaModalVals(schemaProps), "sblGeneral")
        : "";
      break;
    case "sblAcademic":
      schemaProps.forEach((p) => populateSchemaModal(sblAcademic, p));
      output.placeholder = !output.value
        ? await getPlaceHolder(input.placeholder, getSchemaModalVals(schemaProps), "sblAcademic")
        : "";
      break;
    case "sblAcademicSpirantization":
      schemaProps.forEach((p) => populateSchemaModal(new Schema(sblAcademicSpirantization), p));
      output.placeholder = !output.value
        ? await getPlaceHolder(
            input.placeholder,
            getSchemaModalVals(schemaProps),
            "sblAcademicSpirantization"
          )
        : "";
      break;
    case "brillAcademic":
      schemaProps.forEach((p) => populateSchemaModal(brillAcademic, p));
      output.placeholder = !output.value
        ? await getPlaceHolder(input.placeholder, getSchemaModalVals(schemaProps), "brillAcademic")
        : "";
      break;
    case "brillSimple":
      schemaProps.forEach((p) => populateSchemaModal(brillSimple, p));
      output.placeholder = !output.value
        ? await getPlaceHolder(input.placeholder, getSchemaModalVals(schemaProps), "brillSimple")
        : "";
      break;
    case "michiganClaremont":
      schemaProps.forEach((p) => populateSchemaModal(michiganClaremont, p));
      output.placeholder = !output.value
        ? await getPlaceHolder(
            input.placeholder,
            getSchemaModalVals(schemaProps),
            "michiganClaremont"
          )
        : "";
      break;
    case "romaniote":
      schemaProps.forEach((p) => populateSchemaModal(romaniote, p));
      output.placeholder = !output.value
        ? await getPlaceHolder(input.placeholder, getSchemaModalVals(schemaProps), "romaniote")
        : "";
      break;
    case "jss":
      schemaProps.forEach((p) => populateSchemaModal(jss, p));
      output.placeholder = !output.value
        ? await getPlaceHolder(input.placeholder, getSchemaModalVals(schemaProps), "jss")
        : "";
      break;
    case "tiberian":
      schemaProps.forEach((p) => populateSchemaModal(tiberian, p));
      output.placeholder = !output.value
        ? await getPlaceHolder(input.placeholder, getSchemaModalVals(schemaProps), "tiberian")
        : "";
      break;
    default:
      break;
  }
});

downloadSchemaBtn.addEventListener("click", () => downloadSchema(getSchemaModalVals(schemaProps)));

additionalFeatureBtn.addEventListener("click", () =>
  addAdditonalFeature(document.querySelector("#ADDITIONAL_FEATURES"))
);

/**
 * when user uploads a custom schema, populate schema modal and update output placeholder
 */
schemaInput.addEventListener("change", async (event) => {
  const file = event.target.files[0];
  if (file) {
    const customSchema = await fileToJSON(file);
    Object.keys(customSchema).forEach((p) => populateSchemaModal(customSchema, p));
    output.placeholder = !output.value
      ? await wrapper.transliterate(input.placeholder, getSchemaModalVals(schemaProps))
      : "";
  }
});

/**
 * runs when script is loaded — loads props and inserts placeholder text
 * @param {string[]} schemaProps
 */
const main = async (schemaProps) => {
  try {
    loadSchema(schemaProps);
    if (!wrapper.supportsRegex) {
      document.querySelector("#browser-alert").hidden = false;
    }

    output.placeholder = !output.value
      ? await getPlaceHolder(input.placeholder, getSchemaModalVals(schemaProps), schemaSelect.value)
      : "";
  } catch (error) {
    console.error(error);
  }
};

/**
 * if we have to use Netlify functions and the user already has something in localstorage
 * then we call out to the function to wake it up before they transliterate something.
 * If they do not have something in localStorage, then no need to wake up.
 * The call for the placeholder will handle that.
 * Seesionstorage sets if the function is already awake
 */
if (
  !wrapper.supportsRegex &&
  Boolean(localStorage.getItem("hebrewPlaceholderText")) &&
  !sessionStorage.getItem("wakeup")
) {
  fetch("/api/transliterate");
  sessionStorage.setItem("wakeup", true);
}

const schemaProps = Object.keys(new Schema(sblAcademic));
main(schemaProps);
