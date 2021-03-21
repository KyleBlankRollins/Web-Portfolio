function moveDivider() {
  let divider = document.querySelector(".divider");
  let slider = document.querySelector(".slider");
  divider.style.width = slider.value + "%";
}
