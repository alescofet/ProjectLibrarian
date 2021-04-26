let acc = document.getElementsByClassName("acordeon");
let i;

for (i = 0; i < acc.length; i++) {
  acc[i].addEventListener("click", function() { 
    this.classList.toggle("activo");
    let booksProf = this.nextElementSibling;
    if (booksProf.style.display === "flex") {
      booksProf.style.display = "none";
    } else {
      booksProf.style.display = "flex";
    }
  });
}