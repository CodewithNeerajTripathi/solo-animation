document.addEventListener("DOMContentLoaded", () => {
    const rotateMessage = document.getElementById("rotate-message");
    const mainContent = document.querySelector(".main");
    const playButton = document.querySelector(".button");
    
    /* ========================================
       ORIENTATION CHECK (MOBILE)
       ======================================== */
    function checkOrientation() {
        const isPortrait = window.innerHeight > window.innerWidth;
        const isMobile = window.innerWidth <= 767;
        
        if (isMobile && isPortrait) {
            if (rotateMessage) rotateMessage.classList.add("show");
            if (mainContent) mainContent.style.display = "none";
        } else {
            if (rotateMessage) rotateMessage.classList.remove("show");
            if (mainContent) mainContent.style.display = "flex";
        }
    }
    
    checkOrientation();
    window.addEventListener("resize", checkOrientation);
    window.addEventListener("orientationchange", () => {
        setTimeout(checkOrientation, 100);
    });

    /* ========================================
       PLAY BUTTON CLICK SOUND
       ======================================== */
    // Create audio element once when page loads
    const clickSound = new Audio('./audio/Click.mp3');
    
    if (playButton) {
        const parentLink = playButton.closest('a');
        
        if (parentLink) {
            // Prevent default link behavior
            parentLink.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const targetUrl = parentLink.getAttribute('href');
                
                // Play sound and wait for it
                clickSound.currentTime = 0; // Reset sound to start
                clickSound.play().then(() => {
                    // Navigate after 400ms
                    setTimeout(() => {
                        window.location.href = targetUrl;
                    }, 400);
                }).catch((error) => {
                    // If sound fails, still navigate
                    console.log('Audio play failed:', error);
                    setTimeout(() => {
                        window.location.href = targetUrl;
                    }, 400);
                });
            });
        }
    }

    /* ========================================
       NURSERY TEXT ANIMATION
       ======================================== */
    const nurseryText = document.querySelector("#nur");
    if (nurseryText) {
        const nurseryLetters = nurseryText.textContent.split("");
        nurseryText.textContent = "";

        nurseryLetters.forEach(letter => {
            const span = document.createElement("span");
            span.textContent = letter;
            span.style.display = "inline-block";
            nurseryText.appendChild(span);
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
    }

    /* ========================================
       SIMULATION TEXT ANIMATION
       ======================================== */
    const simText = document.querySelector("#sim");
    if (simText) {
        const simLetters = simText.textContent.split("");
        simText.textContent = "";

        simLetters.forEach(letter => {
            const span = document.createElement("span");
            span.textContent = letter;
            span.style.display = "inline-block";
            simText.appendChild(span);
        });

        // GSAP: SIMULATION letters wave animation
        gsap.to("#sim span", {
            y: -20,
            duration: 0.6,
            stagger: 0.1,
            ease: "power1.inOut",
            repeat: -1,
            yoyo: true
        });
    }
});