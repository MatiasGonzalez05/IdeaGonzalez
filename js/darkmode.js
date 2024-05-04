
const body = document.querySelector("body");
const toggle = document.querySelector("#toggle");
const sunIcon = document.querySelector(".toggle .ri-sun-line");
const moonIcon = document.querySelector(".toggle .ri-moon-line");

toggle.addEventListener("change", () => {
    if (body.classList.contains("dark")) {
        // Cambiar de modo oscuro a modo claro
        body.classList.remove("dark");
        body.classList.toggle("light"); 
        
        
    } else {
        // Cambiar de modo claro a modo oscuro
        body.classList.remove("light");
        body.classList.toggle("dark");
    }
});


