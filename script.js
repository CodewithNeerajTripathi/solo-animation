
const nurseryText = document.querySelector("#nur");
const nurseryLetters = nurseryText.textContent.split("");
nurseryText.textContent = "";

nurseryLetters.forEach(letter => {
    const span = document.createElement("span");
    span.textContent = letter;
    span.style.display = "inline-block";
    nurseryText.appendChild(span);
});


const simText = document.querySelector("#sim");
const simLetters = simText.textContent.split("");
simText.textContent = "";

simLetters.forEach(letter => {
    const span = document.createElement("span");
    span.textContent = letter;
    span.style.display = "inline-block";
    simText.appendChild(span);
});

// GSAP: NURSERY letters wave animation
gsap.to("#nur span", {
    y: -20,              
    duration: 0.6,
    stagger: 0.1,
    ease: "power1.inOut",
    repeat: -1,           
    yoyo: true            
});

// GSAP: SIMULATION letters same wave animation
gsap.to("#sim span", {
    y: -20,
    duration: 0.6,
    stagger: 0.1,
    ease: "power1.inOut",
    repeat: -1,
    yoyo: true
});
