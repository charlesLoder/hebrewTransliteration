//@ts-check
export class Wizard {
  /**
   *
   * @param {HTMLCollection} HTMLCollection
   * @param {string} onClass - css class to control if panel is visible
   * @param {string} offClass - css class to control if panel is not visible
   * @param {{btn: HTMLButtonElement, text: string}} prevBtn
   * @param {{btn: HTMLButtonElement, text: string, initText?: string}} nextBtn
   * @param {{btn: HTMLButtonElement, text: string}} finalBtn
   */
  constructor(HTMLCollection, onClass, offClass, prevBtn, nextBtn, finalBtn) {
    this.steps = HTMLCollection;
    this.index = 0;
    this.onClass = onClass;
    this.offClass = offClass;
    this.prevBtn = prevBtn;
    this.nextBtn = nextBtn;
    this.finalBtn = finalBtn;
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
  /**
   *
   * @param {Element} step
   */
  turnOn(step) {
    step.classList.toggle(this.offClass);
    step.classList.toggle(this.onClass);
  }
  /**
   *
   * @param {Element} step
   */
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
  prevWindow = () => {
    if (!this.previous()) return;

    if (!this.next()) {
      this.turnOff(this.finalBtn.btn);
      this.turnOn(this.nextBtn.btn);
    }

    this.decreaseStep();

    if (!this.previous()) {
      this.turnOn(this.prevBtn.btn);
    }

    if (this.index) {
      this.prevBtn.btn.innerText = this.prevBtn.text;
    }
    if (!this.index) {
      this.nextBtn.btn.innerText = this.nextBtn.initText ?? this.nextBtn.text;
    }
  };
  nextWindow = () => {
    if (!this.next()) return;

    if (!this.previous()) {
      this.turnOn(this.prevBtn.btn);
    }

    this.increaseStep();

    if (this.index) {
      this.nextBtn.btn.innerText = this.nextBtn.text;
    }

    if (!this.next()) {
      this.turnOff(this.nextBtn.btn);
      this.turnOn(this.finalBtn.btn);
    }
  };
  resetModalWindow = () => {
    this.reset();
    if (this.next()) {
      this.turnOn(this.nextBtn.btn);
      this.turnOff(this.finalBtn.btn);
      this.turnOff(this.prevBtn.btn);
    }
  };
  init() {
    this.nextBtn.btn.addEventListener("click", this.nextWindow);
    this.prevBtn.btn.addEventListener("click", this.prevWindow);
    this.finalBtn.btn.addEventListener("click", this.resetModalWindow);
    if (!this.next()) {
      this.turnOff(this.nextBtn.btn);
      this.turnOn(this.finalBtn.btn);
    }
  }
}
