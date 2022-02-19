import { transliterate as hebTransliterate, Schema } from "hebrew-transliteration";
import sblGeneral from "../_data/sbl-simple.json";
import sblAcademic from "../_data/sbl-academic.json";
import brillAcademic from "../_data/brill-academic.json";

function supportsRegexLookAheadLookBehind() {
  try {
    return (
      "hibyehihi"
        .replace(new RegExp("(?<=hi)hi", "g"), "hello")
        .replace(new RegExp("hi(?!bye)", "g"), "hey") === "hibyeheyhello"
    );
  } catch (error) {
    return false;
  }
}

/**
 * a wrapper function that checks if regex is supported
 *
 * @param {string} text
 * @param {Schema} schema
 * @returns {Promise<string>} a transliterated string
 */
async function transliterate(text, schema) {
  if (!supportsRegexLookAheadLookBehind()) {
    console.log("using api...");
    const resp = await fetch("/api/transliterate", {
      method: "POST",
      body: JSON.stringify({
        text: text,
        schema: schema,
      }),
    });
    const json = await resp.json();
    return json.transliteration;
  }
  return hebTransliterate(text, schema);
}

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
    <div class="col-3 mr-5">
      <label for="TRANSLITERATION">Transliteration</label>
      <div class="d-flex align-items-center"><input type="text" class="form-control TRANSLITERATION" name="TRANSLITERATION">
      </div>
    </div>
    <!-- FEATURE -->
    <div class="col-6">
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
  const type = input.type;
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
  const type = input.type;
  switch (type) {
    case "checkbox":
      return input.checked;
    case "text":
      return input.value;
    default:
      return "";
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
 * @returns schema
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
 * @returns
 */
function loadSchema(props) {
  if (checkLocalStorage(props)) {
    console.log("using props in local storage");
    props.forEach((p) => populateSchemaModal(schemaFromLocalStorage(props), p));
    schemaSelect.value = localStorage.getItem("schemaSelect");
    return;
  }
  console.log("no local storage, using SBL");
  const academic = new Schema(sblAcademic);
  props.forEach((p) => populateSchemaModal(academic, p));
}

function setSchemaLocalStorage(schema) {
  const props = Object.keys(schema);
  props.forEach((p) => localStorage.setItem(p, schema[p]));
}

async function fileToJSON(file) {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onload = (event) => resolve(JSON.parse(event.target.result));
    fileReader.onerror = (error) => reject(error);
    fileReader.readAsText(file);
  });
}

/**
 * HTML Elements
 */

// transliteration controls
const input = document.querySelector("#input");
const output = document.querySelector("#output");
const actionBtn = document.querySelector("#action-btn");

// modal controls
const steps = document.querySelector("#modal-cards").children;
const nextBtn = document.querySelector("#next-btn");
const prevBtn = document.querySelector("#prev-btn");
const finalBtn = document.querySelector("#final-btn");
const additionalFeatureBtn = document.querySelector("#additional-feature-btn");
const schemaSelect = document.querySelector("#select-schema");
const downloadSchemaBtn = document.querySelector("#download-schema");
const schemaInput = document.querySelector("#schema-input");

/**
 * Form Wizard
 */
class Wizard {
  constructor(HTMLCollection, onClass, offClass) {
    this.steps = HTMLCollection;
    this.index = 0;
    this.onClass = onClass;
    this.offClass = offClass;
  }
  previous() {
    return this.steps[this.index - 1] ?? null;
  }
  current() {
    return this.steps[this.index];
  }
  next() {
    return this.steps[this.index + 1] ?? null;
  }
  turnOn(step) {
    step.classList.toggle(this.offClass);
    step.classList.toggle(this.onClass);
  }
  turnOff(step) {
    step.classList.toggle(this.onClass);
    step.classList.toggle(this.offClass);
  }
  increaseStep() {
    if (this.next()) {
      this.turnOff(this.current());
      this.turnOn(this.next());
      this.index = this.index + 1;
      return true;
    }
    return false;
  }
  decreaseStep() {
    if (this.previous()) {
      this.turnOff(this.current());
      this.turnOn(this.previous());
      this.index = this.index - 1;
      return true;
    }
    return false;
  }
  reset() {
    this.turnOff(this.current());
    this.index = 0;
    this.turnOn(this.steps[this.index]);
  }
}

const wizard = new Wizard(steps, "d-block", "d-none");

function nextModalWindow(wizard) {
  if (!wizard.next()) return;

  if (!wizard.previous()) {
    wizard.turnOn(prevBtn);
  }

  wizard.increaseStep();

  if (wizard.index) {
    nextBtn.innerText = "Next";
  }

  if (!wizard.next()) {
    wizard.turnOff(nextBtn);
    wizard.turnOn(finalBtn);
  }
}

function prevModalWindow(wizard) {
  if (!wizard.previous()) return;

  if (!wizard.next()) {
    wizard.turnOff(finalBtn);
    wizard.turnOn(nextBtn);
  }

  wizard.decreaseStep();

  if (!wizard.index) {
    nextBtn.innerText = "Customize";
  }

  if (!wizard.previous()) {
    wizard.turnOn(prevBtn);
  }
}

function resetModalWindow(wizard) {
  wizard.reset();
  wizard.turnOn(nextBtn);
  wizard.turnOff(finalBtn);
  wizard.turnOff(prevBtn);
}

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
  if (e.keyCode == "37") prevModalWindow(wizard);

  // right arrow
  if (e.keyCode == "39") nextModalWindow(wizard);
}

document.onkeydown = checkKey;

/**
 * Event listeners
 */
actionBtn.addEventListener("click", async () => {
  try {
    const schema = getSchemaModalVals(schemaProps);
    output.value = await transliterate(input.value || input.placeholder, schema);
    setSchemaLocalStorage(schema);
    localStorage.setItem("schemaSelect", schemaSelect.value);
  } catch (error) {
    output.value = "Hmmm...it seems something went wrong";
    console.error(error);
  }
});

schemaSelect.addEventListener("change", async (e) => {
  switch (e.target.value) {
    case "sblGeneral":
      schemaProps.forEach((p) => populateSchemaModal(new Schema(sblGeneral), p));
      output.placeholder = await transliterate(input.placeholder, getSchemaModalVals(schemaProps));
      break;
    case "sblAcademic":
      schemaProps.forEach((p) => populateSchemaModal(new Schema(sblAcademic), p));
      output.placeholder = await transliterate(input.placeholder, getSchemaModalVals(schemaProps));
      break;
    case "brillAcademic":
      schemaProps.forEach((p) => populateSchemaModal(new Schema(brillAcademic), p));
      output.placeholder = await transliterate(input.placeholder, getSchemaModalVals(schemaProps));
      break;
    default:
      break;
  }
});

nextBtn.addEventListener("click", () => nextModalWindow(wizard));

prevBtn.addEventListener("click", () => prevModalWindow(wizard));

finalBtn.addEventListener("click", () => resetModalWindow(wizard));

downloadSchemaBtn.addEventListener("click", () => downloadSchema(getSchemaModalVals(schemaProps)));

additionalFeatureBtn.addEventListener("click", () =>
  addAdditonalFeature(document.querySelector("#ADDITIONAL_FEATURES"))
);

schemaInput.addEventListener("change", async (event) => {
  const file = event.target.files[0];
  if (file) {
    const customSchema = await fileToJSON(file);
    Object.keys(customSchema).forEach((p) => populateSchemaModal(customSchema, p));
    output.placeholder = await transliterate(input.placeholder, getSchemaModalVals(schemaProps));
  }
});

/**
 * runs when script is loaded — loads props and inserts placeholder text
 */
const main = async (schemaProps) => {
  try {
    loadSchema(schemaProps);
    output.placeholder = await transliterate(input.placeholder, getSchemaModalVals(schemaProps));
  } catch (error) {
    console.error(error);
  }
};

const schemaProps = Object.keys(new Schema(sblAcademic));
main(schemaProps);
