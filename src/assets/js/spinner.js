const spinner = document.querySelector("#spinner");
const btnTxt = document.querySelector("#btn-txt");

export function toggleSpinnerOn() {
  btnTxt.classList.toggle("invisible");
  spinner.classList.toggle("d-none");
}

export function toggleSpinnerOff() {
  spinner.classList.toggle("d-none");
  btnTxt.classList.toggle("invisible");
}
