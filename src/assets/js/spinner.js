export class Spinner {
  /**
   *
   * @param {Element} element
   * @param {Element} text
   */
  constructor(spinner, text) {
    this.spinner = spinner;
    this.text = text;
  }
  toggleSpinnerOn() {
    this.text.classList.toggle("invisible");
    this.spinner.classList.toggle("d-none");
  }
  toggleSpinnerOff() {
    this.spinner.classList.toggle("d-none");
    this.text.classList.toggle("invisible");
  }
}
