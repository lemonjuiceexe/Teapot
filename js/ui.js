const hamburger = document.querySelector(".hamburger");
const menu = document.querySelector(".menu-content");
// Hamburger menu
let menuUnwrapped = false;
function toggleMenu(){
    menuUnwrapped = !menuUnwrapped;
    hamburger.innerText = menuUnwrapped ? "X" : "|||";
    menu.classList.toggle("wrapped");
}
// Clock
setInterval(() => {
    const date = new Date();
    const time = `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}:${date.getSeconds().toString().padStart(2, "0")}`;
    document.querySelector(".clock").innerHTML = time;
}, 250);