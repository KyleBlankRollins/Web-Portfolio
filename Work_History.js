// setTimeout(reveal,300);
//
// function reveal () {
//     var jobDesc = document.getElementsByClassName('jobDesc')[0];
//
//     document.getElementsByClassName('dropDownBox')[0].onclick = function() {
//       if(this.innerHTML === '▼')
//       {
//         this.innerHTML = '▲';
//         jobDesc.classList.add('jobDescShow');
//       } else {
//         this.innerHTML = '▼';
//         jobDesc.classList.remove('jobDescShow');
//       }
//     }
// }
function reveal1() {
    var description = document.getElementById("description1");
    description.style.display="block";
}

function reveal2() {
    var description = document.getElementById("description2");
    description.style.display="block";
}

// Close the dropdown if the user clicks outside of it
window.onclick = function(e) {
    var rNameDrop = document.getElementById("rNameDrop");
    var lNameDrop = document.getElementById("lNameDrop");
    if (!e.target.matches('.dropBtn')) {

        if (lNameDrop.style.display="block"){
            lNameDrop.style.display="none"
        }

        if (rNameDrop.style.display="block"){
            rNameDrop.style.display="none"
        }
    }
}
