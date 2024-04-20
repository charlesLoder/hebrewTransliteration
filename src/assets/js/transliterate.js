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
import Toastify from "toastify-js";

feedbackFormInit();

/**
 * appends a div with the class ADDITIONAL_FEATURE to the parent
 *
 * @param {HTMLElement} parent
 * @param {string} hebrew
 * @param {string | function } transliteration
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
  el.querySelector(".HEBREW").dataset.regex = false;
  if (typeof hebrew !== "string") {
    el.querySelector(".HEBREW").dataset.regex = true;
    el.querySelector(".HEBREW").disabled = true;
  }
  el.querySelector(".TRANSLITERATION").disabled = typeof transliteration === "function";
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
      return;
    }
    if (prop === "ADDITIONAL_FEATURES" && schema[prop] && schema[prop].length) {
      schema[prop].forEach((f) => {
        addAdditonalFeature(
          document.querySelector(`#${prop}`),
          f["HEBREW"],
          f["TRANSLITERATION"],
          f["FEATURE"]
        );
      });
      return;
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
 * Takes a string representation of a regex and returns a RegExp
 *
 * @param {string} inputString a string representaion of a regex
 */
function sanitizeRegexString(inputString) {
  const regex = inputString.split("/");
  const flags = regex.pop();
  const pattern = regex.filter(Boolean).join("/");
  return new RegExp(pattern, flags);
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
          HEBREW: JSON.parse(el.querySelector(".HEBREW").dataset.regex)
            ? sanitizeRegexString(el.querySelector(".HEBREW").value)
            : el.querySelector(".HEBREW").value,
          TRANSLITERATION: el.querySelector(".TRANSLITERATION").disabled
            ? eval(el.querySelector(".TRANSLITERATION").value)
            : el.querySelector(".TRANSLITERATION").value,
          FEATURE: el.querySelector(".FEATURE").value,
        };
      });
      return schema;
    }
    schema[prop] = getInputVal(document.querySelector(`#${prop}`));
    return schema;
  }, {});
}

function clearSchemaModalVals(schemaProps) {
  schemaProps.forEach((prop) => {
    if (prop === "STRESS_MARKER") {
      document.querySelector(`#${prop}  #location`).value = "";
      updateInput(document.querySelector(`#${prop}  #mark`), false);
    }
    if (prop === "ADDITIONAL_FEATURES") {
      document.querySelector(`#${prop}`).innerHTML = "";
    }
    const input = document.querySelector(`#${prop}`);
    updateInput(input, "");
  });
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

function checkIfExpired() {
  const hasExpiration = localStorage.getItem("expires")
    ? JSON.parse(localStorage.getItem("expires"))
    : false;

  if (!hasExpiration) {
    return true;
  }

  const now = new Date();
  const nintetyDaysAgo = now.setDate(now.getDate() - 90);

  return nintetyDaysAgo > hasExpiration;
}

function setExpiry() {
  // first check if expires is already set and if it is not expired
  const expires = localStorage.getItem("expires");
  if (expires && !checkIfExpired()) {
    return;
  }

  // if it is expired, set a new expiry
  const now = new Date();
  const ninetyDaysFromNow = now.setDate(now.getDate() + 90);
  localStorage.setItem("expires", ninetyDaysFromNow);
}

/**
 * checks if schema props are stored on local storage
 * @param {string[]} props
 * @returns {boolean}
 */
function checkLocalStorage(props) {
  const isExpired = checkIfExpired();
  if (isExpired) {
    return false;
  }
  return props.map((p) => localStorage.getItem(p)).filter((e) => e).length ? true : false;
}

/**
 * generates a schema from local storage
 * @param {string[]} props
 * @returns {Schema}
 */
function schemaFromLocalStorage(props) {
  return props.reduce((schema, prop) => {
    if (prop === "STRESS_MARKER") {
      const stressMarker = JSON.parse(localStorage.getItem(prop));
      schema[prop] = {
        location: stressMarker["location"],
        mark: stressMarker["mark"],
      };
      return schema;
    }
    if (prop === "ADDITIONAL_FEATURES") {
      const addFeatures = JSON.parse(localStorage.getItem(prop));
      schema[prop] = addFeatures.map((f) => {
        const heb = f["HEBREW"];
        return {
          HEBREW:
            heb.charAt(0) === "/" && heb.charAt(heb.length - 1)
              ? new RegExp(sanitizeRegexString(heb))
              : heb,
          TRANSLITERATION: eval(f["TRANSLITERATION"]),
          FEATURE: f["FEATURE"],
        };
      });
      return schema;
    }
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
  schemaSelect.value = "sblAcademic";
}

/**
 * sets a schema to local storage
 * @param {Schema} schema
 */
function setSchemaLocalStorage(schema) {
  const props = Object.keys(schema);
  props.forEach((p) => {
    if (p === "ADDITIONAL_FEATURES") {
      const addFeatures = schema[p].map((f) => {
        return {
          HEBREW: f["HEBREW"].toString(),
          TRANSLITERATION: f["TRANSLITERATION"].toString(),
          FEATURE: f["FEATURE"],
        };
      });
      localStorage.setItem(p, JSON.stringify(addFeatures));
      return;
    }

    if (p === "STRESS_MARKER") {
      const stressMarker = schema[p];
      localStorage.setItem(
        p,
        JSON.stringify({
          location: stressMarker["location"],
          mark: stressMarker["mark"],
        })
      );
      return;
    }
    localStorage.setItem(p, schema[p]);
  });
  setExpiry();
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

function sendGAEvent(action, value = null) {
  gtag("event", action, {
    event_category: "User Engagement",
    event_label: "Transliterate_Button",
    value: value,
  });
}

function createToastButton(id) {
  const div = document.createElement("div");
  div.classList.add("toast-btn-wrapper", "m-auto");
  const button = document.createElement("button");
  button.classList.add("btn", "btn-secondary", "btn-sm");
  button.textContent = "Don't remind me again";
  button.id = id;
  div.appendChild(button);
  return div;
}

function createToastElement(message, id) {
  const div = document.createElement("div");
  div.classList.add("d-flex", "flex-column");
  const p = document.createElement("p");
  p.classList.add("m-0");
  p.textContent = message;
  div.appendChild(p);
  div.appendChild(createToastButton(id));
  return div;
}

/**
 * Event listeners
 */
actionBtn.addEventListener("click", async () => {
  sendGAEvent("Click");
  try {
    // getting the schema could error, so do it before the loading spinner
    const schema = getSchemaModalVals(schemaProps);

    // show spinner if waiting on function response
    if (!wrapper.supportsRegexLookAheadLookBehind()) {
      loadingSpinner.toggleSpinnerOn();
    }

    // show the output
    output.value = await wrapper.transliterate(input.value || input.placeholder, schema);
    sendGAEvent("Click success", 1);

    // remove spinner after output
    if (!wrapper.supportsRegexLookAheadLookBehind()) {
      loadingSpinner.toggleSpinnerOff();
    }

    // set localstorage for the schema
    setSchemaLocalStorage(schema);

    // set schema select to local storage
    localStorage.setItem("schemaSelect", schemaSelect.value);

    // show messages if input does not contain vowels or cantillation
    const toastOptions = {
      gravity: "top",
      position: "center",
      className: "toast",
      duration: 2000,
      style: {
        // background: "linear-gradient(to right, #7370af 70%, #af7398)",
        background: "#7370af",
        marginTop: "25vh",
        borderRadius: "4px",
        padding: "20px",
      },
    };

    // a regex of Hebrew Vowel characters
    const vowels = /[\u05B0-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7]/;

    // check if input.value does not contain Hebrew vowel characters
    const noVowelsDisabledKey = "noVowelsDisabled";
    const noVowelsDisabled = localStorage.getItem(noVowelsDisabledKey) === "true";
    if (!vowels.test(input.value) && !noVowelsDisabled) {
      const noVowelsBtnId = "no-vowels";
      const toast = Toastify({
        ...toastOptions,
        node: createToastElement("Include vowel marks to ensure accuracy", noVowelsBtnId),
        onClick: function (e) {
          if (e.target.id === noVowelsBtnId) {
            localStorage.setItem(noVowelsDisabledKey, true);
            toast.hideToast();
          }
        },
      });
      toast.showToast();
    }

    // check if input.value does not contain Hebrew accent characters
    const cantillation = /[\u0591-\u05AE\u05BD\u05C3-\u05C5]/;
    const noCantillationKey = "noCantillationDisabled";
    const noCantillationDisabled = localStorage.getItem(noCantillationKey) === "true";
    if (!cantillation.test(input.value) && !noCantillationDisabled) {
      const noCantillationBtnId = "no-cantillation";
      const toast = Toastify({
        ...toastOptions,
        node: createToastElement(
          "Include cantillation marks to ensure accuracy",
          noCantillationBtnId
        ),
        onClick: function (event) {
          if (event.target.id === noCantillationBtnId) {
            localStorage.setItem(noCantillationKey, true);
            toast.hideToast();
          }
        },
      });
      toast.showToast();
    }
  } catch (error) {
    output.value =
      "Hmmm...it seems something went wrong. Check the Tips button for best practices.";
    console.error(error);
    sendGAEvent("Click error", 0);
  }
});

/**
 * when user selects a predefined schema,
 */
schemaSelect.addEventListener("change", async (e) => {
  clearSchemaModalVals(schemaProps);
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

const schemaProps = Object.keys(new Schema(sblAcademic));
main(schemaProps);
