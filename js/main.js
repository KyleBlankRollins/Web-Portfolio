// (function () {
//   window.addEventListener("DOMContentLoaded", (event) => {
//     let tocItems = document.querySelectorAll(".toc-item");

//     addEventListeners(tocItems);
//   });
// })();

function moveDivider() {
  let divider = document.querySelector(".divider");
  let slider = document.querySelector(".slider");
  divider.style.width = slider.value + "%";
}

// function checkHash(event) {
//   let hash = window.location.hash;

//   console.log(event);
//   console.log(hash);
// }

// function addEventListeners(tocItems) {
//   tocItems.forEach((item) => {
//     item.addEventListener("click", () => {
//       console.log(item);
//     });
//   });
// }
