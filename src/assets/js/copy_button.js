class CopyButton extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
    this.setupListeners();
  }

  static get observedAttributes() {
    return ["target", "button-text", "success-text"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
    }
  }

  render() {
    const buttonText = this.getAttribute("button-text") || "Copy";

    this.shadowRoot.innerHTML = `
            <style>
                .copy-span {
                    width: 100%;
                    display: inline-block;
                }
            </style>
            <span class="copy-span">
                ${buttonText}
            </span>
        `;
  }

  setupListeners() {
    const button = this.shadowRoot.querySelector(".copy-span");

    button.addEventListener("click", async () => {
      try {
        let textToCopy;
        const targetSelector = this.getAttribute("target");

        if (targetSelector) {
          // Try to find target element in light DOM
          const targetElement = document.querySelector(targetSelector);
          if (!targetElement) {
            throw new Error("Target element not found");
          }
          textToCopy = targetElement.value || targetElement.textContent;
        } else {
          // If no target specified, use slot content
          textToCopy = this.textContent;
        }

        await navigator.clipboard.writeText(textToCopy.trim());

        // Visual feedback
        const successText = this.getAttribute("success-text") || "Copied!";
        button.textContent = successText;
        button.classList.add("success");

        // Reset button after 2 seconds
        setTimeout(() => {
          button.textContent = this.getAttribute("button-text") || "Copy";
          button.classList.remove("success");
        }, 2000);

        // Dispatch success event
        this.dispatchEvent(
          new CustomEvent("copy-success", {
            bubbles: true,
            composed: true,
            detail: { copiedText: textToCopy },
          })
        );
      } catch (err) {
        console.error("Failed to copy text:", err);
        button.textContent = "Failed to copy";

        // Dispatch error event
        this.dispatchEvent(
          new CustomEvent("copy-error", {
            bubbles: true,
            composed: true,
            detail: { error: err },
          })
        );
      }
    });
  }
}

// Register the custom element
customElements.define("copy-button", CopyButton);
