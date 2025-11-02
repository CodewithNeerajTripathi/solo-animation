// simu.js - Clean JavaScript Logic
// All styles moved to CSS, structure to HTML

document.addEventListener("DOMContentLoaded", () => {
  
  /* ========================================
     ELEMENT REFERENCES
     ======================================== */
  const rotateMessage = document.getElementById("rotate-message");
  const mainContent = document.querySelector(".main");
  const items = Array.from(document.querySelectorAll(".items img"));
  const allToyImages = Array.from(document.querySelectorAll(".toys-above-self-A img, .toys-above-self-B img"));
  const contElement = document.querySelector(".cont");
  const miloImg = document.querySelector(".milo");
  const clickImg = document.querySelector(".click");
  const img4 = document.querySelector(".img4");
  const img5 = document.querySelector(".img5");
  const moreImg = document.querySelector(".more");
  const lessImg = document.querySelector(".less");
  const homeBtn = document.getElementById("home");
  const musicBtn = document.getElementById("musi");
  const infoBtn = document.getElementById("info");
  const iconLeftImages = Array.from(document.querySelectorAll(".icon-left img"));
  const bottomArrow = document.getElementById("bottom-arrow");

  /* ========================================
     INITIAL SETUP - HIDE ELEMENTS
     ======================================== */
  allToyImages.forEach(img => img.style.display = "none");
  if (miloImg) miloImg.style.display = "none";
  if (clickImg) {
    clickImg.style.display = "none";
    clickImg.style.opacity = "0";
  }
  if (img4) img4.style.display = "none";
  if (img5) img5.style.display = "none";
  if (moreImg) moreImg.style.display = "none";
  if (lessImg) lessImg.style.display = "none";

  /* ========================================
     AUDIO SUBTITLES - LINE BY LINE (HTML elements)
     ======================================== */
  function getAudioSubtitles(audioNum) {
    switch(audioNum) {
      case 1:
        return {
          0: "subtitle-1",
          1: "subtitle-1-line2"
        };
      case 2:
        return {
          0: "subtitle-2",
          1: "subtitle-2-line2"
        };
      case 3:
        return {
          0: "subtitle-3",
          1: "subtitle-3-line2",
          2: "subtitle-3-line3"
        };
      case 4:
        return {
          0: "subtitle-4",
          1: "subtitle-4-line2"
        };
      case 5:
        return {
          0: "subtitle-5"
        };
      case 6:
        return {
          0: "subtitle-6"
        };
      case 7:
        return {
          0: "subtitle-7"
        };
      case 8:
        return {
          0: "subtitle-8"
        };
      case 9:
        return {
          0: "subtitle-9",
          1: "subtitle-9-line2"
        };
      case 10:
        return {
          0: "subtitle-10",
          1: "subtitle-10-line2"
        };
      case 11:
        return {
          0: "subtitle-11",
          1: "subtitle-11-line2"
        };
      case 12:
        return {
          0: "subtitle-12"
        };
      default:
        return {};
    }
  }

  /* ========================================
     STATE VARIABLES
     ======================================== */
  const placedItems = new Set();
  const audioQueue = [];
  let isPlayingAudio = false;
  let toysClickable = false;
  let currentAudioElement = null;
  let subtitleIntervalId = null;
  let started = false;
  let endSequenceStarted = false;
  
  // Background Music - Now using shared audio-manager.js
  // The audio-manager.js handles music for all pages
  let backgroundMusic = null;
  let isMusicMuted = false;

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
      if (mainContent) mainContent.style.display = "block";
    }
  }
  
  checkOrientation();
  window.addEventListener("resize", checkOrientation);

  /* ========================================
     BACKGROUND MUSIC SETUP
     ======================================== */
  function setupBackgroundMusic() {
    // Use shared audio manager if available (audio-manager.js handles music now)
    if (window.audioManager && window.audioManager.getMusic) {
      backgroundMusic = window.audioManager.getMusic();
      isMusicMuted = !window.audioManager.getState();
    } else {
      // Fallback: create our own only if audio-manager didn't load
      // This should rarely happen since audio-manager.js loads before simu.js
      backgroundMusic = new Audio("./audio/Main-version.wav");
      backgroundMusic.loop = true;
      backgroundMusic.volume = 0.3; // Match audio-manager volume
    }
  }
  
  // Initialize background music
  setupBackgroundMusic();
  
  // Music button toggle - now handled by audio-manager.js
  // We don't need to add click listener here since audio-manager.js handles it

  /* ========================================
     HELPER: TOGGLE SPECIAL IMAGES
     ======================================== */
  function toggleImagesOnAudio(audioNum, show) {
    const imageMap = {
      9: img5,
      10: img4,
      11: moreImg,
      12: lessImg
    };
    
    const img = imageMap[audioNum];
    if (img) {
      img.style.display = show ? "block" : "none";
    }
  }

  /* ========================================
     HELPER: RESIZE REMAINING TOYS
     ======================================== */
  function resizeRemainingItems(containerClass) {
    const container = document.querySelector(containerClass);
    if (!container) return;
    
    const remaining = Array.from(container.querySelectorAll("img"))
      .filter(img => img.style.display !== "none");
    const remainingCount = remaining.length || 1;
    const vw = window.innerWidth;
    
    remaining.forEach(img => {
      const sizeMap = {
        "duck": 7, "hore": 11, "house": 6, "train": 7,
        "ship": 10, "ball": 7, "fan": 6, "roll": 8, "dino": 8
      };
      
      const percent = sizeMap[img.id] || Math.max(6, Math.min(12, Math.round(100 / remainingCount)));
      const px = Math.round((vw * percent) / 100);
      
      img.style.width = `${px}px`;
      img.style.minWidth = `${px}px`;
      img.style.maxWidth = `${px}px`;
      img.style.flexShrink = "0";
      img.style.flexGrow = "0";
    });
  }

  /* ========================================
     DISPLAY SUBTITLE (INSTANT)
     ======================================== */
  function displaySubtitle(className) {
    const element = document.querySelector(`.${className}`);
    if (element) {
      element.style.setProperty("display", "flex", "important");
      element.classList.add("show");
      // Force a reflow to ensure CSS transition works
      void element.offsetHeight;
    }
  }

  /* ========================================
     HIDE SUBTITLE (SMOOTH)
     ======================================== */
  function hideSubtitle() {
    // Hide all subtitle elements
    const allSubtitles = document.querySelectorAll('.subtitle-text');
    allSubtitles.forEach(sub => {
      sub.classList.remove("show");
      sub.style.setProperty("display", "none", "important");
    });
  }

  /* ========================================
     SHOW SUBTITLES SYNCED WITH AUDIO
     ======================================== */
  function showSubtitlesWithAudio(lines, audioDuration) {
    const linesCount = Object.keys(lines).length;
    if (!lines || linesCount === 0) return;
    
    // Clear any existing interval
    if (subtitleIntervalId) {
      clearInterval(subtitleIntervalId);
      subtitleIntervalId = null;
    }
    
    // Hide all previous subtitles first
    hideSubtitle();
    
    // Calculate time per line - har line ko equal time
    const timePerLine = (audioDuration * 1000) / linesCount; // milliseconds mein
    
    // Show first line immediately
    displaySubtitle(lines[0]);
    
    // Schedule remaining lines with proper timing
    if (linesCount > 1) {
      let currentLineIndex = 1; // Start from second line (index 1)
      
      // Schedule each remaining line at equal intervals
      subtitleIntervalId = setInterval(() => {
        if (currentLineIndex < linesCount) {
          // Hide previous line
          if (currentLineIndex > 0) {
            const prevElement = document.querySelector(`.${lines[currentLineIndex - 1]}`);
            if (prevElement) {
              prevElement.classList.remove("show");
              prevElement.style.setProperty("display", "none", "important");
            }
          }
          displaySubtitle(lines[currentLineIndex]);
          currentLineIndex++;
        } else {
          clearInterval(subtitleIntervalId);
          subtitleIntervalId = null;
        }
      }, timePerLine); // Already in milliseconds
    }
  }

  /* ========================================
     TOY CLICK CONTROLS
     ======================================== */
  function disableToyClicks() {
    toysClickable = false;
    items.forEach(item => {
      item.style.pointerEvents = "none";
      item.style.cursor = "not-allowed";
    });
  }
  
  function enableToyClicks() {
    toysClickable = true;
    items.forEach(item => {
      if (!placedItems.has(item)) {
        item.style.pointerEvents = "auto";
        item.style.cursor = "pointer";
      }
    });
  }

  /* ========================================
     AUDIO PLAYBACK LOGIC
     ======================================== */
  function playNextAudio() {
    if (isPlayingAudio || audioQueue.length === 0) return;
    
    const audioNum = audioQueue.shift();
    if (!audioNum || audioNum > 12) return;
    
    isPlayingAudio = true;
    const audio = new Audio(`./audio/${String(audioNum).padStart(2, "0")}.mp3`);
    currentAudioElement = audio;
    
    const subtitleLines = getAudioSubtitles(audioNum);
    
    // Start subtitles when audio actually starts playing
    audio.addEventListener('playing', () => {
      const audioDuration = audio.duration;
      const linesCount = Object.keys(subtitleLines || {}).length;
      
      if (subtitleLines && linesCount > 0 && audioDuration > 0 && isFinite(audioDuration)) {
        showSubtitlesWithAudio(subtitleLines, audioDuration);
      }
    }, { once: true });

    // Show clickImg overlay
    if (clickImg && subtitleLines) {
      clickImg.style.display = "block";
      clickImg.style.opacity = "1";
      if (typeof clickImg.textContent !== "undefined") {
        clickImg.textContent = Object.values(subtitleLines).join(" ");
      }
    }

    // Show special images for certain audios
    toggleImagesOnAudio(audioNum, true);

    // Audio-specific actions
    if (audioNum === 4 && miloImg) {
      miloImg.style.display = "block";
    }
    
    if (audioNum === 5 && contElement) {
      const inst = contElement.querySelector("h1");
      if (inst) {
        inst.innerHTML = '<span style="color:red;font-weight:bold;">Click</span> the toys';
        inst.style.opacity = "1";
      }
    }

    // When audio ends
    audio.onended = () => {
      // Clear subtitle interval if still running
      if (subtitleIntervalId) {
        clearInterval(subtitleIntervalId);
        subtitleIntervalId = null;
      }
      
      // Hide subtitle smoothly
      hideSubtitle();
      
      if (clickImg) {
        clickImg.style.opacity = "0";
      }

      // Hide special images
      toggleImagesOnAudio(audioNum, false);

      // Reverse specific actions
      if (audioNum === 4 && miloImg) {
        miloImg.style.display = "none";
      }
      
      if (audioNum === 5) {
        if (contElement) {
          const inst = contElement.querySelector("h1");
          if (inst) {
            inst.innerHTML = '<span style="color:red;font-weight:bold;">Tap</span> and <span style="color:red;font-weight:bold;">drag</span> toys<br>to the shelves';
            inst.style.opacity = "0";
          }
        }
        enableToyClicks();
        // Show bottom arrow after audio 5 finishes (when toys become clickable)
        if (bottomArrow) {
          bottomArrow.style.display = "block";
        }
      }

      currentAudioElement = null;
      isPlayingAudio = false;

      // Continue queue or show Play Again
      if (audioQueue.length > 0) {
        setTimeout(() => playNextAudio(), 400);
      } else if (audioNum === 12) {
        setTimeout(() => showPlayAgainPage(), 800);
      }
    };

    audio.play().catch(err => {
      console.warn("Audio play failed:", err);
      if (subtitleIntervalId) {
        clearInterval(subtitleIntervalId);
        subtitleIntervalId = null;
      }
      currentAudioElement = null;
      isPlayingAudio = false;
      playNextAudio();
    });
  }

  /* ========================================
     START INITIAL AUDIOS
     ======================================== */
  function playInitialAudios() {
    disableToyClicks();
    setTimeout(() => {
      audioQueue.push(1, 2, 3, 4, 5);
      playNextAudio();
    }, 600);
  }

  // Start on first click
  document.addEventListener("click", () => {
    if (!started) {
      started = true;
      
      // Ensure background music plays on first interaction
      if (backgroundMusic && backgroundMusic.paused && !isMusicMuted) {
        backgroundMusic.play().catch(err => console.log("Background music play failed:", err));
      }
      
      playInitialAudios();
    }
  }, { once: true });

  /* ========================================
     TOY CLICK HANDLER
     ======================================== */
  const itemIdMap = {
    "duck": "duck-toy",
    "hore": "hore-toy",
    "dino": "dino-toy",
    "house": "house-toy",
    "ball": "ball-toy",
    "train": "train-toy",
    "roll": "roll-toy",
    "ship": "ship-toy",
    "fan": "fan-toy"
  };

  items.forEach((item) => {
    item.addEventListener("click", () => {
      if (!toysClickable || placedItems.has(item)) return;

      // Play Collect Star audio on each click
      const collectStarAudio = new Audio("./audio/Collect Star.mp3");
      collectStarAudio.play().catch(err => console.log("Collect Star audio play failed:", err));

      // Mark as placed
      placedItems.add(item);
      
      // Hide clicked toy
      item.style.display = "none";
      item.style.pointerEvents = "none";

      // Find container
      let containerClass = null;
      if (item.closest(".items-img-A")) containerClass = ".items-img-A";
      else if (item.closest(".items-img-B")) containerClass = ".items-img-B";
      else if (item.closest(".items-img-C")) containerClass = ".items-img-C";
      else if (item.closest(".items-img-D")) containerClass = ".items-img-D";

      // Resize remaining toys
      if (containerClass) resizeRemainingItems(containerClass);

      // Show toy on shelf
      const toyImageId = itemIdMap[item.id];
      const toyImageElement = document.getElementById(toyImageId);
      if (toyImageElement) {
        toyImageElement.style.display = "block";
        
        const toyText = document.getElementById(`${toyImageId}-text`);
        if (toyText) toyText.style.display = "none";
      }

      // Check if all toys placed
      if (placedItems.size === items.length && !endSequenceStarted) {
        endSequenceStarted = true;
        
        // Hide bottom arrow when all toys are placed
        if (bottomArrow) {
          bottomArrow.style.display = "none";
        }
        
        // Play Collect Star audio when all toys are placed
        const collectStarAudio = new Audio("./audio/Collect Star.mp3");
        collectStarAudio.play().catch(err => console.log("Collect Star audio play failed:", err));
        
        setTimeout(() => {
          for (let i = 6; i <= 12; i++) {
            audioQueue.push(i);
          }
          if (!isPlayingAudio) {
            playNextAudio();
          }
        }, 500);
      }
    });
  });

  /* ========================================
     ICON LEFT IMAGES - COLLECT STAR AUDIO
     ======================================== */
  iconLeftImages.forEach(img => {
    img.addEventListener("click", () => {
      const collectStarAudio = new Audio("./audio/Collect Star.mp3");
      collectStarAudio.play().catch(err => console.log("Collect Star audio play failed:", err));
    });
  });

  /* ========================================
     HOME BUTTON
     ======================================== */
  // Home button functionality moved to popup section below

  /* ========================================
     PLAY AGAIN OVERLAY 
     ======================================== */
  function showPlayAgainPage() {
    // Create overlay
    const overlay = document.createElement("div");
    overlay.className = "play-again-overlay";
    document.body.appendChild(overlay);

    // Create box with image
    const box = document.createElement("div");
    box.className = "play-again-box";
    overlay.appendChild(box);

    // Image
    const img = document.createElement("img");
    img.src = "./IMAGES/the-end-slide (0-00-01-08).png";
    img.alt = "Great Job!";
    img.style.width = "100%";
    img.style.height = "100%";
    img.style.objectFit = "contain";
    box.appendChild(img);

    // Close button (X) at bottom
    const closeBtn = document.createElement("img");
    closeBtn.src = "./Index-page/x.png";
    closeBtn.alt = "Close";
    closeBtn.style.position = "absolute";
    closeBtn.style.bottom = "18%";
    closeBtn.style.left = "50%";
    closeBtn.style.transform = "translateX(-50%)";
    closeBtn.style.width = "3vw";
    closeBtn.style.height = "auto";
    closeBtn.style.cursor = "pointer";
    closeBtn.style.zIndex = "10005";
    closeBtn.style.transition = "transform 0.2s ease";
    box.style.position = "relative";
    box.appendChild(closeBtn);

    // Close button hover effect
    closeBtn.addEventListener("mouseenter", () => {
      closeBtn.style.transform = "translateX(-50%) scale(1.1)";
    });
    closeBtn.addEventListener("mouseleave", () => {
      closeBtn.style.transform = "translateX(-50%) scale(1)";
    });

    // Close button click handler
    closeBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      location.reload();
    });

    // Make overlay clickable to reload
    overlay.addEventListener("click", () => location.reload());

    // Animate in
    setTimeout(() => {
      box.classList.add("show");
    }, 80);
  }

  /* ========================================
     HOME POPUP FUNCTIONALITY (Modal with buttons)
     ======================================== */
  const homePopup = document.getElementById("home-popup");
  const stayBtn = document.getElementById("stay-btn");
  const leaveBtn = document.getElementById("leave-btn");

  // Function to disable all interactions when home popup is open
  function disableInteractionsForHomePopup() {
    // Disable pointer events on main content
    if (mainContent) {
      mainContent.style.pointerEvents = "none";
    }
    // Disable all buttons including info button
    if (homeBtn) homeBtn.style.pointerEvents = "none";
    if (infoBtn) infoBtn.style.pointerEvents = "none";
    if (musicBtn) musicBtn.style.pointerEvents = "none";
    
    // Disable all items (toys)
    items.forEach(item => {
      item.style.pointerEvents = "none";
    });
    
    // Disable all icon left images
    iconLeftImages.forEach(img => {
      img.style.pointerEvents = "none";
    });
    
    // Disable body but allow home popup
    document.body.style.pointerEvents = "none";
    if (homePopup) {
      homePopup.style.pointerEvents = "auto";
    }
  }

  // Function to enable all interactions when home popup is closed
  function enableInteractionsAfterHomePopup() {
    // Re-enable pointer events
    if (mainContent) {
      mainContent.style.pointerEvents = "auto";
    }
    if (homeBtn) homeBtn.style.pointerEvents = "auto";
    if (infoBtn) infoBtn.style.pointerEvents = "auto";
    if (musicBtn) musicBtn.style.pointerEvents = "auto";
    
    // Re-enable items (toys)
    items.forEach(item => {
      if (!placedItems.has(item)) {
        item.style.pointerEvents = "auto";
      }
    });
    
    // Re-enable icon left images
    iconLeftImages.forEach(img => {
      img.style.pointerEvents = "auto";
    });
    
    document.body.style.pointerEvents = "auto";
  }

  // Open home popup when home button is clicked
  if (homeBtn && homePopup) {
    homeBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      // Play Collect Star audio on click - same as icon buttons
      const collectStarAudio = new Audio("./audio/Collect Star.mp3");
      collectStarAudio.play().catch(err => console.log("Collect Star audio play failed:", err));
      homePopup.style.display = "flex";
      // Disable all interactions when popup opens
      disableInteractionsForHomePopup();
    });
  }

  // Close popup when Stay button is clicked
  if (stayBtn && homePopup) {
    stayBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      // Play Collect Star audio on click - same as icon buttons
      const collectStarAudio = new Audio("./audio/Collect Star.mp3");
      collectStarAudio.play().catch(err => console.log("Collect Star audio play failed:", err));
      homePopup.style.display = "none";
      // Re-enable all interactions when popup closes
      enableInteractionsAfterHomePopup();
    });
  }

  // Handle Leave button click
  if (leaveBtn && homePopup) {
    leaveBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      // Play Collect Star audio on click - same as icon buttons
      const collectStarAudio = new Audio("./audio/Collect Star.mp3");
      collectStarAudio.play().catch(err => console.log("Collect Star audio play failed:", err));
      // Add delay before redirect to allow audio to play
      setTimeout(() => {
        window.location.href = "main.html";
      }, 200);
    });
  }

  // Home popup can only be closed by clicking Stay or Leave buttons
  // Background click to close has been disabled

  /* ========================================
     INFO POPUP FUNCTIONALITY (Image popup)
     ======================================== */
  const infoPopup = document.getElementById("info-popup");
  const popupImg = document.getElementById("popup-img");
  const closePopup = document.getElementById("close-popup");

  // Function to disable all interactions except popup
  function disablePageInteractions() {
    // Disable pointer events on main content
    if (mainContent) {
      mainContent.style.pointerEvents = "none";
    }
    // Disable all buttons and clickable elements
    if (homeBtn) homeBtn.style.pointerEvents = "none";
    if (infoBtn) infoBtn.style.pointerEvents = "none";
    if (musicBtn) musicBtn.style.pointerEvents = "none";
    
    // Disable all items (toys)
    items.forEach(item => {
      item.style.pointerEvents = "none";
    });
    
    // Disable all icon left images
    iconLeftImages.forEach(img => {
      if (img !== infoBtn) { // Don't disable info button that opened the popup
        img.style.pointerEvents = "none";
      }
    });
    
    // Disable body but allow popup
    document.body.style.pointerEvents = "none";
    if (infoPopup) {
      infoPopup.style.pointerEvents = "auto";
    }
  }

  // Function to enable all interactions
  function enablePageInteractions() {
    // Re-enable pointer events
    if (mainContent) {
      mainContent.style.pointerEvents = "auto";
    }
    if (homeBtn) homeBtn.style.pointerEvents = "auto";
    if (infoBtn) infoBtn.style.pointerEvents = "auto";
    if (musicBtn) musicBtn.style.pointerEvents = "auto";
    
    // Re-enable items (toys)
    items.forEach(item => {
      if (!placedItems.has(item)) {
        item.style.pointerEvents = "auto";
      }
    });
    
    // Re-enable icon left images
    iconLeftImages.forEach(img => {
      img.style.pointerEvents = "auto";
    });
    
    document.body.style.pointerEvents = "auto";
  }

  // Open info popup when info button is clicked
  if (infoBtn && infoPopup && popupImg) {
    infoBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      // Don't allow info popup to open if home popup is open
      if (homePopup && homePopup.style.display === "flex") {
        return;
      }
      // Play Collect Star audio on click - same as icon buttons
      const collectStarAudio = new Audio("./audio/Collect Star.mp3");
      collectStarAudio.play().catch(err => console.log("Collect Star audio play failed:", err));
      // Get image source from data-img attribute
      const imgSrc = infoBtn.getAttribute("data-img");
      if (imgSrc) {
        popupImg.src = imgSrc;
        infoPopup.style.display = "flex";
        // Disable all other interactions
        disablePageInteractions();
      }
    });
  }

  // Close info popup when close button is clicked (ONLY way to close)
  if (closePopup && infoPopup) {
    closePopup.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      // Play Collect Star audio on click - same as icon buttons
      const collectStarAudio = new Audio("./audio/Collect Star.mp3");
      collectStarAudio.play().catch(err => console.log("Collect Star audio play failed:", err));
      infoPopup.style.display = "none";
      // Re-enable all interactions
      enablePageInteractions();
    });
  }

  // Remove background click to close - info popup can only be closed by X button
});