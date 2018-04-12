
function hideDescriptions () {
    var jobDesc = document.getElementsByClassName("jobDesc")[0];
    var i;

    for (i = 0; i < acc.length; i++) {
        this.classList.add("hide");
    }
}


jobDesc.classList.add("hide");

function heightToggle () {
    var acc = document.getElementsByClassName("jobTitle");
    var i;

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
}
