import { remove } from "hebrew-transliteration";

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

async function apiCheck(text, options) {
  if (!supportsRegexLookAheadLookBehind()) {
    console.log("using api...");
    const resp = await fetch("/api/remove", {
      method: "POST",
      body: JSON.stringify({
        text: text,
        options: options,
      }),
    });
    const json = await resp.json();
    return json.text;
  }
  return remove(text, schema);
}

// controls
const input = document.querySelector("#input");
const output = document.querySelector("#output");
const actionBtn = document.querySelector("#action-btn");

/**
 * Event listeners
 */
actionBtn.addEventListener("click", async () => {
  try {
    const options = {
      removeVowels: document.querySelector("#removeVowels").checked,
      removeShinDot: document.querySelector("#removeShinDot").checked,
      removeSinDot: document.querySelector("#removeSinDot").checked,
    };
    output.value = await apiCheck(input.value || input.placeholder, options);
  } catch (error) {
    console.log(error);
    output.value = error.message ?? "Hmmm...it seems something went wrong";
  }
});
