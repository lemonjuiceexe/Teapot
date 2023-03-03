const hamburger = document.querySelector(".hamburger");
const menu = document.querySelector(".menu-content");
const buttons = document.querySelectorAll(".menu-button");
const artReload = document.querySelector(".artwork-reload");

// Hamburger menu
let menuUnwrapped = false;
function toggleMenu(){
    menuUnwrapped = !menuUnwrapped;
    console.log(menuUnwrapped);
    hamburger.innerText = menuUnwrapped ? "X" : "|||";
    
    // Duration and delay of the animation
    const duration = 1000;
    const delay = 100;
 
    // Depending on whether the menu is wrapping or unwrapping, animate buttons or the menu first
    const buttonTimeout = !menuUnwrapped ? 0 : duration + delay;
    const animationTimeout = !menuUnwrapped ? duration + delay : 0;
    const direction = menuUnwrapped ? "normal" : "reverse";
    
    // Unwrap/wrap the menu after animationTimeout
    setTimeout(() => menu.classList.toggle("wrapped"), animationTimeout);
    // Hide buttons if unwrapping the menu, so they don't appear immediately
    if(menuUnwrapped) buttons.forEach(el => el.style["visibility"] = "hidden");
    // Play animation after animationTimeout
    setTimeout(() => {
        buttons.forEach(el => el.animate([
                {
                    filter: "opacity(0)",
                    top: "30px"
                },
                {
                    filter: "opacity(1)",
                    top: "0"
                }
            ], {
                iterations: 1,
                duration: duration,
                delay: delay,
                easing: "ease-out",
                fill: "both",
                direction: direction
            })
        );
        // Undo the visibility: hidden
        if(menuUnwrapped) buttons.forEach(el => el.style["visibility"] = "visible");
    }, buttonTimeout);
}
// Clock
setInterval(() => {
    // Don't update the clock if it's not visible anyway
    if(menuUnwrapped) return;
    const date = new Date();
    const HH = date.getHours().toString().padStart(2, "0");
    const MM = date.getMinutes().toString().padStart(2, "0");
    const SS = date.getSeconds().toString().padStart(2, "0");
    document.querySelector(".clock").innerHTML = `${HH}:${MM}:${SS}`;
}, 250);