var samples = document.getElementById("samples");
var techExpand = document.getElementById("techExpand");
var designExpand = document.getElementById("designExpand");
var pubExpand = document.getElementById("pubExpand");
var acc = document.getElementsByClassName("accordion");
var i;

techExpand.classList.remove("panel");
designExpand.classList.add("hide");
pubExpand.classList.add("hide");

for (i = 0; i < acc.length; i++) {
  acc[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var panel = this.nextElementSibling;
    if (panel.style.maxWidth){
      panel.style.maxWidth = null;
    } else {
      panel.style.maxWidth = "90%";
    }
  });
}

if(document.readyState === 'complete') {
    function getSiblings() {
        var siblings = samples.parentNode.childNodes;

        console.log(siblings);
    }
}
