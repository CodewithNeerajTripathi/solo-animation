document.addEventListener("DOMContentLoaded", () => {
  const rotateMessage = document.getElementById("rotate-message");
  const mainContent = document.querySelector(".main");
  
  // ==================== CLICK SOUND WITH DEBUG ====================
  console.log("🎵 Loading click sound...");
  const clickSound = new Audio("./draft_audio/Click.mp3");
  clickSound.preload = "auto";
  clickSound.volume = 1.0; // Max volume
  
  // Check if audio loaded successfully
  clickSound.addEventListener("loadeddata", () => {
    console.log("✅ Click sound loaded successfully!");
  });
  
  clickSound.addEventListener("error", (e) => {
    console.error("❌ Click sound failed to load:", e);
    console.log("Check if file exists at: ./draft_audio/Click.mp3");
  });
  
  // Function to play click sound
  function playClickSound() {
    console.log("🔊 Attempting to play click sound...");
    clickSound.currentTime = 0; // Reset to start
    const playPromise = clickSound.play();
    
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          console.log("✅ Click sound is playing!");
        })
        .catch(e => {
          console.error("❌ Click sound play failed:", e);
        });
    }
  }
  
  /* ========================================
     ORIENTATION CHECK (MOBILE)
     ======================================== */
  function checkOrientation() {
    const isPortrait = window.innerHeight > window.innerWidth;
    const isMobile = window.innerWidth <= 767;
    
    if (isMobile && isPortrait) {
      if (rotateMessage) {
        rotateMessage.classList.add("show");
        rotateMessage.style.display = "flex";
        rotateMessage.style.pointerEvents = "auto";
      }
      if (mainContent) {
        mainContent.style.display = "none";
        mainContent.style.pointerEvents = "none";
      }
      document.body.style.overflow = "hidden";
      document.body.style.pointerEvents = "none";
      if (rotateMessage) {
        rotateMessage.style.pointerEvents = "auto";
      }
    } else {
      if (rotateMessage) {
        rotateMessage.classList.remove("show");
        rotateMessage.style.display = "none";
      }
      if (mainContent) {
        mainContent.style.display = "block";
        mainContent.style.pointerEvents = "auto";
      }
      document.body.style.overflow = "";
      document.body.style.pointerEvents = "auto";
    }
  }
  
  checkOrientation();
  window.addEventListener("resize", checkOrientation);
  window.addEventListener("orientationchange", () => {
    setTimeout(checkOrientation, 100);
  });

  const popup = document.getElementById("info-popup");
  const popupImg = document.getElementById("popup-img");
  const closePopup = document.getElementById("close-popup");
  const popupContent = document.querySelector(".popup-content");

  function openPopup(imgSrc) {
    popupImg.src = imgSrc;
    popup.style.display = "flex";
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => {
      setTimeout(() => {
        popup.classList.add("show");
      }, 10);
    });
  }

  function closePopupFunc() {
    popup.classList.remove("show");
    setTimeout(() => {
      popup.style.display = "none";
      document.body.style.overflow = "";
      popupImg.src = "";
    }, 300);
  }

  // ==================== ADD CLICK SOUND TO ALL BUTTONS ====================
  
  // Story, Simulation, Game buttons - Multiple approaches
  console.log("🔍 Setting up button click handlers...");
  
  // Approach 1: Direct link targeting
  const storyLink = document.querySelector('a[href="intro.html"]');
  const simulationLink = document.querySelector('a[href="./main.html"]');
  const gameLink = document.querySelector('a[href="./Simulation/simu.html"]');
  
  console.log("Story Link found:", !!storyLink);
  console.log("Simulation Link found:", !!simulationLink);
  console.log("Game Link found:", !!gameLink);
  
  if (storyLink) {
    storyLink.addEventListener("click", (e) => {
      console.log("📖 Story button clicked!");
      e.preventDefault();
      const targetUrl = storyLink.href;
      
      // Play sound first, then navigate after sound ends
      clickSound.currentTime = 0;
      clickSound.play().then(() => {
        console.log("✅ Sound playing...");
        // Wait for sound to finish (or at least 300ms)
        setTimeout(() => {
          window.location.href = targetUrl;
        }, 300);
      }).catch(err => {
        console.error("Sound play failed:", err);
        // Navigate anyway even if sound fails
        setTimeout(() => {
          window.location.href = targetUrl;
        }, 100);
      });
    });
  }
  
  if (simulationLink) {
    simulationLink.addEventListener("click", (e) => {
      console.log("🔬 Simulation button clicked!");
      e.preventDefault();
      const targetUrl = simulationLink.href;
      
      clickSound.currentTime = 0;
      clickSound.play().then(() => {
        console.log("✅ Sound playing...");
        setTimeout(() => {
          window.location.href = targetUrl;
        }, 300);
      }).catch(err => {
        console.error("Sound play failed:", err);
        setTimeout(() => {
          window.location.href = targetUrl;
        }, 100);
      });
    });
  }
  
  if (gameLink) {
    gameLink.addEventListener("click", (e) => {
      console.log("🎮 Game button clicked!");
      e.preventDefault();
      const targetUrl = gameLink.href;
      
      clickSound.currentTime = 0;
      clickSound.play().then(() => {
        console.log("✅ Sound playing...");
        setTimeout(() => {
          window.location.href = targetUrl;
        }, 300);
      }).catch(err => {
        console.error("Sound play failed:", err);
        setTimeout(() => {
          window.location.href = targetUrl;
        }, 100);
      });
    });
  }
  
  // Approach 2: Also add to button images themselves
  const btn1 = document.getElementById("btn1");
  const btn2 = document.getElementById("btn2");
  const btn3 = document.getElementById("btn3");
  
  if (btn1) {
    btn1.addEventListener("click", (e) => {
      console.log("🖱️ btn1 image clicked!");
      playClickSound();
    });
  }
  
  if (btn2) {
    btn2.addEventListener("click", (e) => {
      console.log("🖱️ btn2 image clicked!");
      playClickSound();
    });
  }
  
  if (btn3) {
    btn3.addEventListener("click", (e) => {
      console.log("🖱️ btn3 image clicked!");
      playClickSound();
    });
  }
  
  // Info buttons
  const infoButtons = document.querySelectorAll(".info-btn");
  console.log("Info buttons found:", infoButtons.length);
  
  infoButtons.forEach((btn, index) => {
    btn.addEventListener("click", (e) => {
      console.log(`ℹ️ Info button ${index + 1} clicked!`);
      e.stopPropagation();
      playClickSound();
      const imgSrc = btn.getAttribute("data-img");
      if (imgSrc) {
        openPopup(imgSrc);
      }
    });
  });

  // Home button
  const homeButton = document.getElementById("home");
  if (homeButton) {
    console.log("🏠 Home button found");
    homeButton.addEventListener("click", (e) => {
      console.log("🏠 Home button clicked!");
      playClickSound();
    });
  }

  // Audio/Music button
  const audioButton = document.getElementById("audio");
  if (audioButton) {
    console.log("🎵 Audio button found");
    audioButton.addEventListener("click", (e) => {
      console.log("🎵 Audio button clicked!");
      playClickSound();
    });
  }

  // Close button
  if (closePopup) {
    closePopup.addEventListener("click", (e) => {
      console.log("❌ Close button clicked!");
      e.stopPropagation();
      playClickSound();
      closePopupFunc();
    });
  }

  popup.addEventListener("click", (e) => {
    if (e.target === popup) {
      closePopupFunc();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && popup.classList.contains("show")) {
      closePopupFunc();
    }
  });
  
  console.log("✅ All event listeners set up!");
});