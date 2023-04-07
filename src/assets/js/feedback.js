const feedbackFormInit = () => {
  const feedbackForm = /** @type {HTMLFormElement} */ (
    document.querySelector("#feedback-modal form")
  );

  feedbackForm.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!e.target) throw new Error("No event target");

    const form = /** @type {HTMLFormElement} */ (e.target);
    const formData = new FormData(form);

    fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(formData)),
    })
      .then(() => alert("Form successfully submitted"))
      .then(() => {
        const url = new URL(window.location);
        window.location = url.origin + url.pathname + "#";
      })
      .catch((error) => alert(error));
  });
};

export { feedbackFormInit };
