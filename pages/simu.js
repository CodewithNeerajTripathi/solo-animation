// simu.js - Drag and Drop Version (Complete User Freedom)
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
  
  // Shelf drop zones and containers
  const shelfA = document.querySelector(".shelfi-A");
  const shelfB = document.querySelector(".shelfi-B");
  const toysAboveShelfA = document.querySelector(".toys-above-self-A");
  const toysAboveShelfB = document.querySelector(".toys-above-self-B");

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
  
  // Drag and drop state
  let draggedElement = null;
  let shelfACounts = 0;
  let shelfBCounts = 0;
  const MAX_TOYS_PER_SHELF = 6;
  
  // Track which toys are on which shelf
  const toysOnShelfA = [];
  const toysOnShelfB = [];
  
  // Background Music
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
    if (window.audioManager && window.audioManager.getMusic) {
      backgroundMusic = window.audioManager.getMusic();
      isMusicMuted = !window.audioManager.getState();
    } else {
      backgroundMusic = new Audio("../audio/Main-version.wav");
      backgroundMusic.loop = true;
      backgroundMusic.volume = 0.3;
    }
  }
  
  setupBackgroundMusic();

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
      void element.offsetHeight;
    }
  }

  /* ========================================
     HIDE SUBTITLE (SMOOTH)
     ======================================== */
  function hideSubtitle() {
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
    
    if (subtitleIntervalId) {
      clearInterval(subtitleIntervalId);
      subtitleIntervalId = null;
    }
    
    hideSubtitle();
    const timePerLine = (audioDuration * 1000) / linesCount;
    displaySubtitle(lines[0]);
    
    if (linesCount > 1) {
      let currentLineIndex = 1;
      
      subtitleIntervalId = setInterval(() => {
        if (currentLineIndex < linesCount) {
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
      }, timePerLine);
    }
  }

  /* ========================================
     TOY DRAG CONTROLS
     ======================================== */
  function disableToyDrag() {
    toysClickable = false;
    items.forEach(item => {
      item.draggable = false;
      item.style.cursor = "not-allowed";
      item.style.opacity = "0.5";
    });
  }
  
  function enableToyDrag() {
    toysClickable = true;
    items.forEach(item => {
      if (!placedItems.has(item)) {
        item.draggable = true;
        item.style.cursor = "grab";
        item.style.opacity = "1";
      }
    });
  }

  /* ========================================
     HELPER: CLEAR AND REBUILD SHELF TOYS
     ======================================== */
  function rebuildShelfToys(targetContainer, toysList) {
    // Clear existing content but keep the structure
    targetContainer.innerHTML = "";
    
    // Create two rows like original HTML structure
    const row1 = document.createElement("div");
    row1.className = "dynamic-row-1";
    row1.style.cssText = `
      display: flex;
      justify-content: center;
      align-items: flex-end;
      gap: 0.1vw;
      margin-top: 2.5vw;
    `;
    
    const row2 = document.createElement("div");
    row2.className = "dynamic-row-2";
    row2.style.cssText = `
      display: flex;
      justify-content: center;
      align-items: flex-end;
      gap: 0.1vw;
      margin-top: 3vw;
    `;
    
    targetContainer.appendChild(row1);
    targetContainer.appendChild(row2);
    
    // Map toy IDs to their image sources
    const toyImageMap = {
      "duck": "../IMAGES/duck.png",
      "hore": "../IMAGES/hore.png",
      "dino": "../IMAGES/dino.png",
      "house": "../IMAGES/block-house.png",
      "ball": "../IMAGES/ball.png",
      "train": "../IMAGES/train.png",
      "roll": "../IMAGES/roll.png",
      "ship": "../IMAGES/ship.png",
      "fan": "../IMAGES/fan.png"
    };
    
    // Size mapping for each toy
    const toySizeMap = {
      "duck": "7vw",
      "hore": "11vw",
      "dino": "8vw",
      "house": "5.5vw",
      "ball": "6vw",
      "train": "8vw",
      "roll": "7vw",
      "ship": "9vw",
      "fan": "5vw"
    };
    
    // Add toys to appropriate rows with balanced distribution
    toysList.forEach((toyId, index) => {
      const toyImage = document.createElement("img");
      toyImage.src = toyImageMap[toyId] || "";
      toyImage.alt = toyId;
      toyImage.id = `placed-${toyId}`;
      toyImage.style.cssText = `
        width: ${toySizeMap[toyId] || "7vw"};
        height: auto;
        object-fit: contain;
        display: block;
      `;
      
      // Balanced distribution based on total count
      const totalToys = toysList.length;
      let row1Count;
      
      if (totalToys === 1) {
        row1Count = 1; // 1-0
      } else if (totalToys === 2) {
        row1Count = 2; // 2-0
      } else if (totalToys === 3) {
        row1Count = 1; // 1-2
      } else if (totalToys === 4) {
        row1Count = 2; // 2-2
      } else if (totalToys === 5) {
        row1Count = 2; // 2-3
      } else if (totalToys === 6) {
        row1Count = 3; // 3-3
      }
      
      if (index < row1Count) {
        row1.appendChild(toyImage);
      } else {
        row2.appendChild(toyImage);
      }
    });
  }

  /* ========================================
     DRAG AND DROP HANDLERS
     ======================================== */
  
  // Make toys draggable
  items.forEach(item => {
    item.draggable = false; // Initially not draggable
    
    item.addEventListener("dragstart", (e) => {
      if (!toysClickable || placedItems.has(item)) {
        e.preventDefault();
        return;
      }
      draggedElement = item;
      item.style.opacity = "0.5";
      item.style.cursor = "grabbing";
      e.dataTransfer.effectAllowed = "move";
    });
    
    item.addEventListener("dragend", (e) => {
      if (draggedElement) {
        draggedElement.style.opacity = "1";
        draggedElement.style.cursor = "grab";
      }
    });
  });
  
  // Setup drop zones
  function setupDropZone(shelf, isShelfA) {
    if (!shelf) return;
    
    shelf.addEventListener("dragover", (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
      
      // Check if shelf is full (max 6)
      const currentCount = isShelfA ? shelfACounts : shelfBCounts;
      if (currentCount >= MAX_TOYS_PER_SHELF) {
        e.dataTransfer.dropEffect = "none";
        return;
      }
      
      // Visual feedback
      shelf.style.opacity = "0.8";
      shelf.style.border = "3px dashed #4CAF50";
    });
    
    shelf.addEventListener("dragleave", (e) => {
      shelf.style.opacity = "1";
      shelf.style.border = "none";
    });
    
    shelf.addEventListener("drop", (e) => {
      e.preventDefault();
      shelf.style.opacity = "1";
      shelf.style.border = "none";
      
      if (!draggedElement || placedItems.has(draggedElement)) return;
      
      // Check if shelf is full (max 6 toys)
      const currentCount = isShelfA ? shelfACounts : shelfBCounts;
      if (currentCount >= MAX_TOYS_PER_SHELF) {
        alert(`This shelf is full! Maximum ${MAX_TOYS_PER_SHELF} toys allowed.`);
        return;
      }
      
      // Play Collect Star audio
      const collectStarAudio = new Audio("../audio/Collect Star.mp3");
      collectStarAudio.play().catch(err => console.log("Collect Star audio play failed:", err));
      
      // Mark as placed
      placedItems.add(draggedElement);
      
      // Update counts and track toys
      if (isShelfA) {
        shelfACounts++;
        toysOnShelfA.push(draggedElement.id);
        // Rebuild entire shelf A with all toys
        rebuildShelfToys(toysAboveShelfA, toysOnShelfA);
      } else {
        shelfBCounts++;
        toysOnShelfB.push(draggedElement.id);
        // Rebuild entire shelf B with all toys
        rebuildShelfToys(toysAboveShelfB, toysOnShelfB);
      }
      
      // Hide dragged toy from floor
      draggedElement.style.display = "none";
      draggedElement.draggable = false;
      
      // Find container and resize remaining toys
      let containerClass = null;
      if (draggedElement.closest(".items-img-A")) containerClass = ".items-img-A";
      else if (draggedElement.closest(".items-img-B")) containerClass = ".items-img-B";
      else if (draggedElement.closest(".items-img-C")) containerClass = ".items-img-C";
      else if (draggedElement.closest(".items-img-D")) containerClass = ".items-img-D";
      
      if (containerClass) resizeRemainingItems(containerClass);
      
      // Check if all toys are placed
      if (placedItems.size === items.length && !endSequenceStarted) {
        endSequenceStarted = true;
        
        // Hide bottom arrow
        if (bottomArrow) {
          bottomArrow.style.display = "none";
        }
        
        // Play Collect Star audio
        const collectStarAudio = new Audio("../audio/Collect Star.mp3");
        collectStarAudio.play().catch(err => console.log("Collect Star audio play failed:", err));
        
        // Update subtitle numbers dynamically based on user's distribution
        const num1Element = document.getElementById('num1');
        const num2Element = document.getElementById('num2');
        if (num1Element) num1Element.textContent = shelfACounts;
        if (num2Element) num2Element.textContent = shelfBCounts;
        
        setTimeout(() => {
          for (let i = 6; i <= 12; i++) {
            audioQueue.push(i);
          }
          if (!isPlayingAudio) {
            playNextAudio();
          }
        }, 500);
      }
      
      draggedElement = null;
    });
  }
  
  setupDropZone(shelfA, true);
  setupDropZone(shelfB, false);

  /* ========================================
     AUDIO PLAYBACK LOGIC
     ======================================== */
  function playNextAudio() {
    if (isPlayingAudio || audioQueue.length === 0) return;
    
    const audioNum = audioQueue.shift();
    if (!audioNum || audioNum > 12) return;
    
    isPlayingAudio = true;
    const audio = new Audio(`../audio/${String(audioNum).padStart(2, "0")}.mp3`);
    currentAudioElement = audio;
    
    const subtitleLines = getAudioSubtitles(audioNum);
    
    audio.addEventListener('playing', () => {
      const audioDuration = audio.duration;
      const linesCount = Object.keys(subtitleLines || {}).length;
      
      if (subtitleLines && linesCount > 0 && audioDuration > 0 && isFinite(audioDuration)) {
        showSubtitlesWithAudio(subtitleLines, audioDuration);
      }
    }, { once: true });

    if (clickImg && subtitleLines) {
      clickImg.style.display = "block";
      clickImg.style.opacity = "1";
      if (typeof clickImg.textContent !== "undefined") {
        clickImg.textContent = Object.values(subtitleLines).join(" ");
      }
    }

    toggleImagesOnAudio(audioNum, true);

    if (audioNum === 4 && miloImg) {
      miloImg.style.display = "block";
    }
    
    if (audioNum === 5 && contElement) {
      const inst = contElement.querySelector("h1");
      if (inst) {
        inst.innerHTML = '<span style="color:red;font-weight:bold;">Drag</span> and <span style="color:red;font-weight:bold;">Drop</span> toys<br>to the shelves';
        inst.style.opacity = "1";
      }
    }

    audio.onended = () => {
      if (subtitleIntervalId) {
        clearInterval(subtitleIntervalId);
        subtitleIntervalId = null;
      }
      
      hideSubtitle();
      
      if (clickImg) {
        clickImg.style.opacity = "0";
      }

      toggleImagesOnAudio(audioNum, false);

      if (audioNum === 4 && miloImg) {
        miloImg.style.display = "none";
      }
      
      if (audioNum === 5) {
        if (contElement) {
          const inst = contElement.querySelector("h1");
          if (inst) {
            inst.innerHTML = '<span style="color:red;font-weight:bold;">Drag</span> and <span style="color:red;font-weight:bold;">Drop</span> toys<br>to the shelves';
            inst.style.opacity = "0";
          }
        }
        enableToyDrag();
        if (bottomArrow) {
          bottomArrow.style.display = "block";
        }
      }

      currentAudioElement = null;
      isPlayingAudio = false;

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
    disableToyDrag();
    setTimeout(() => {
      audioQueue.push(1, 2, 3, 4, 5);
      playNextAudio();
    }, 600);
  }

  document.addEventListener("click", () => {
    if (!started) {
      started = true;
      
      if (backgroundMusic && backgroundMusic.paused && !isMusicMuted) {
        backgroundMusic.play().catch(err => console.log("Background music play failed:", err));
      }
      
      playInitialAudios();
    }
  }, { once: true });

  /* ========================================
     ICON LEFT IMAGES - COLLECT STAR AUDIO
     ======================================== */
  iconLeftImages.forEach(img => {
    img.addEventListener("click", () => {
      const collectStarAudio = new Audio("../audio/Click.mp3");
      collectStarAudio.play().catch(err => console.log("Collect Star audio play failed:", err));
    });
  });

  /* ========================================
     PLAY AGAIN OVERLAY 
     ======================================== */
  function showPlayAgainPage() {
    const overlay = document.createElement("div");
    overlay.className = "play-again-overlay";
    document.body.appendChild(overlay);

    const box = document.createElement("div");
    box.className = "play-again-box";
    overlay.appendChild(box);

    const img = document.createElement("img");
    img.src = "../IMAGES/Asset 1@2x.png";
    img.alt = "Great Job!";
    img.style.width = "100%";
    img.style.height = "100%";
    img.style.objectFit = "contain";
    box.appendChild(img);

    const closeBtn = document.createElement("img");
    closeBtn.src = "../Index-page/replay.png";
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

    closeBtn.addEventListener("mouseenter", () => {
      closeBtn.style.transform = "translateX(-50%) scale(1.1)";
    });
    closeBtn.addEventListener("mouseleave", () => {
      closeBtn.style.transform = "translateX(-50%) scale(1)";
    });

    closeBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      location.reload();
    });

    overlay.addEventListener("click", () => location.reload());

    setTimeout(() => {
      box.classList.add("show");
    }, 80);
  }

  /* ========================================
     HOME POPUP FUNCTIONALITY
     ======================================== */
  const homePopup = document.getElementById("home-popup");
  const stayBtn = document.getElementById("stay-btn");
  const leaveBtn = document.getElementById("leave-btn");

  function disableInteractionsForHomePopup() {
    if (mainContent) mainContent.style.pointerEvents = "none";
    if (homeBtn) homeBtn.style.pointerEvents = "none";
    if (infoBtn) infoBtn.style.pointerEvents = "none";
    if (musicBtn) musicBtn.style.pointerEvents = "none";
    
    items.forEach(item => {
      item.style.pointerEvents = "none";
    });
    
    iconLeftImages.forEach(img => {
      img.style.pointerEvents = "none";
    });
    
    document.body.style.pointerEvents = "none";
    if (homePopup) {
      homePopup.style.pointerEvents = "auto";
    }
  }

  function enableInteractionsAfterHomePopup() {
    if (mainContent) mainContent.style.pointerEvents = "auto";
    if (homeBtn) homeBtn.style.pointerEvents = "auto";
    if (infoBtn) infoBtn.style.pointerEvents = "auto";
    if (musicBtn) musicBtn.style.pointerEvents = "auto";
    
    items.forEach(item => {
      if (!placedItems.has(item)) {
        item.style.pointerEvents = "auto";
      }
    });
    
    iconLeftImages.forEach(img => {
      img.style.pointerEvents = "auto";
    });
    
    document.body.style.pointerEvents = "auto";
  }

  if (homeBtn && homePopup) {
    homeBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const collectStarAudio = new Audio("../audio/Click.mp3");
      collectStarAudio.play().catch(err => console.log("Collect Star audio play failed:", err));
      homePopup.style.display = "flex";
      disableInteractionsForHomePopup();
    });
  }

  if (stayBtn && homePopup) {
    stayBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const collectStarAudio = new Audio("../audio/Click.mp3");
      collectStarAudio.play().catch(err => console.log("Collect Star audio play failed:", err));
      homePopup.style.display = "none";
      enableInteractionsAfterHomePopup();
    });
  }

  if (leaveBtn && homePopup) {
    leaveBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const collectStarAudio = new Audio("../audio/Click.mp3");
      collectStarAudio.play().catch(err => console.log("Collect Star audio play failed:", err));
      setTimeout(() => {
        window.location.href = "main.html";
      }, 200);
    });
  }

  /* ========================================
     INFO POPUP FUNCTIONALITY
     ======================================== */
  const infoPopup = document.getElementById("info-popup");
  const popupImg = document.getElementById("popup-img");
  const closePopup = document.getElementById("close-popup");

  function disablePageInteractions() {
    if (mainContent) mainContent.style.pointerEvents = "none";
    if (homeBtn) homeBtn.style.pointerEvents = "none";
    if (infoBtn) infoBtn.style.pointerEvents = "none";
    if (musicBtn) musicBtn.style.pointerEvents = "none";
    
    items.forEach(item => {
      item.style.pointerEvents = "none";
    });
    
    iconLeftImages.forEach(img => {
      if (img !== infoBtn) {
        img.style.pointerEvents = "none";
      }
    });
    
    document.body.style.pointerEvents = "none";
    if (infoPopup) {
      infoPopup.style.pointerEvents = "auto";
    }
  }

  function enablePageInteractions() {
    if (mainContent) mainContent.style.pointerEvents = "auto";
    if (homeBtn) homeBtn.style.pointerEvents = "auto";
    if (infoBtn) infoBtn.style.pointerEvents = "auto";
    if (musicBtn) musicBtn.style.pointerEvents = "auto";
    
    items.forEach(item => {
      if (!placedItems.has(item)) {
        item.style.pointerEvents = "auto";
      }
    });
    
    iconLeftImages.forEach(img => {
      img.style.pointerEvents = "auto";
    });
    
    document.body.style.pointerEvents = "auto";
  }

  if (infoBtn && infoPopup && popupImg) {
    infoBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (homePopup && homePopup.style.display === "flex") {
        return;
      }
      const collectStarAudio = new Audio("../audio/Click.mp3");
      collectStarAudio.play().catch(err => console.log("Collect Star audio play failed:", err));
      const imgSrc = infoBtn.getAttribute("data-img");
      if (imgSrc) {
        popupImg.src = imgSrc;
        infoPopup.style.display = "flex";
        disablePageInteractions();
      }
    });
  }

  if (closePopup && infoPopup) {
    closePopup.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const collectStarAudio = new Audio("../audio/Click.mp3");
      collectStarAudio.play().catch(err => console.log("Collect Star audio play failed:", err));
      infoPopup.style.display = "none";
      enablePageInteractions();
    });
  }
});