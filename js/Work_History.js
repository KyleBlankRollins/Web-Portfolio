
var jobDesc = document.getElementsByClassName("jobDesc");
var i;

console.log(jobDesc);

for (i = 0; i < jobDesc.length; i++) {
    jobDesc[i].addEventListener("click", function() { // TODO: need to add an event for "onLoad" or similar that invokes the function when the document is ready.
        this.classList.add("hide"); // REVIEW: may need to add new hide and show classes for jobDesc.
    }
}

// function heightToggle () { // TODO: modify this so that on click, jobDesc show or hide classes are added.
//     var acc = document.getElementsByClassName("jobTitle");
//     var i;
//
//     for (i = 0; i < acc.length; i++) {
//       acc[i].addEventListener("click", function() {
//         this.classList.toggle("active");
//         var panel = this.nextElementSibling;
//         if (panel.style.maxWidth){
//           panel.style.maxWidth = null;
//         } else {
//           panel.style.maxWidth = "90%";
//         }
//       });
//     }
// }
