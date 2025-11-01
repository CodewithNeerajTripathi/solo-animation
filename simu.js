document.addEventListener("DOMContentLoaded", () => {
  const items = document.querySelectorAll(".items img");
  const shelfA = document.querySelector(".shelfi-A .shelf-items");
  const shelfB = document.querySelector(".shelfi-B .shelf-items");
  const lipA = document.querySelector(".shelfi-A .lip"); // ✅ Lip A reference
  const lipB = document.querySelector(".shelfi-B .lip"); // ✅ Lip B reference

  console.log("Items found:", items.length);

  const placedItems = new Set();

  // ✅ Hide all images in toys-above-self-A and toys-above-self-B by default
  const allToyImages = document.querySelectorAll(".toys-above-self-A img, .toys-above-self-B img");
  allToyImages.forEach(img => {
    img.style.display = "none";
  });

  // ✅ LIP-RELATIVE POSITIONS - Lip ke ANDAR ke coordinates
  function getToyPositionsRelativeToLip() {
    const screenWidth = window.innerWidth;
    
    let scale = 1;
    if (screenWidth <= 1400 && screenWidth >= 1200) {
      scale = 0.87;
    } else if (screenWidth < 1200 && screenWidth >= 1024) {
      scale = 0.75;
    } else if (screenWidth < 1024 && screenWidth >= 768) {
      scale = 0.62;
    } else if (screenWidth < 768) {
      scale = 0.48;
    }

    // ✅ Shelf A - Top shelf positions (lip ke andar perfectly fit)
    // ✅ Shelf B - Bottom shelf positions (lip ke andar perfectly fit)
    return {
      scale: scale,
      A: [
        { x: 40 * scale, y: 100 * scale },    // Train - top shelf left
        { x: 180 * scale, y: 70 * scale },   // Horse - top shelf center-right
        { x: 40 * scale, y: 250 * scale },   // Dino - bottom shelf left
        { x: 175 * scale, y: 278 * scale },  // House - bottom shelf center
        { x: 300 * scale, y: 255 * scale },  // Ball - bottom shelf right
      ],
      B: [
        { x: 15 * scale, y: 80 * scale },    // Duck - top shelf left
        { x: 210 * scale, y: 90 * scale },   // Roll - top shelf right
        { x: 20 * scale, y: 270 * scale },   // Ship - bottom shelf left
        { x: 220 * scale, y: 290 * scale },  // Fan - bottom shelf right
      ]
    };
  }

  let toyPositions = getToyPositionsRelativeToLip();

  // ✅ Resize handler
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      console.log('🔄 Screen resized - updating positions...');
      toyPositions = getToyPositionsRelativeToLip();
      updatePlacedItemsPositions();
    }, 200);
  });

  // ✅ Update placed items based on LIP position
  function updatePlacedItemsPositions() {
    const toySizes = getToySizes();
    
    // Shelf A items
    const shelfAItems = shelfA.querySelectorAll('img');
    shelfAItems.forEach((clone, idx) => {
      if (toyPositions.A[idx] && lipA) {
        const lipRect = lipA.getBoundingClientRect();
        const shelfRect = shelfA.getBoundingClientRect();
        
        // ✅ Lip ke relative position calculate karo
        const relativeX = lipRect.left - shelfRect.left;
        const relativeY = lipRect.top - shelfRect.top;
        
        clone.style.left = `${relativeX + toyPositions.A[idx].x}px`;
        clone.style.top = `${relativeY + toyPositions.A[idx].y}px`;
        
        const originalIndex = parseInt(clone.dataset.originalIndex);
        if (!isNaN(originalIndex) && toySizes[originalIndex]) {
          clone.style.width = toySizes[originalIndex];
        }
      }
    });

    // Shelf B items
    const shelfBItems = shelfB.querySelectorAll('img');
    shelfBItems.forEach((clone, idx) => {
      if (toyPositions.B[idx] && lipB) {
        const lipRect = lipB.getBoundingClientRect();
        const shelfRect = shelfB.getBoundingClientRect();
        
        const relativeX = lipRect.left - shelfRect.left;
        const relativeY = lipRect.top - shelfRect.top;
        
        clone.style.left = `${relativeX + toyPositions.B[idx].x}px`;
        clone.style.top = `${relativeY + toyPositions.B[idx].y}px`;
        
        const originalIndex = parseInt(clone.dataset.originalIndex);
        if (!isNaN(originalIndex) && toySizes[originalIndex]) {
          clone.style.width = toySizes[originalIndex];
        }
      }
    });
  }

  // ✅ Dynamic toy sizes - proper sizing to avoid overlap
  function getToySizes() {
    const scale = toyPositions.scale;
    return {
      0: `${85 * scale}px`,   // Train - reduced size
      1: `${115 * scale}px`,  // Horse - reduced size
      2: `${95 * scale}px`,   // Dino - reduced size
      3: `${95 * scale}px`,   // House - reduced size
      4: `${85 * scale}px`,   // Ball - reduced size
      5: `${140 * scale}px`,  // Duck - reduced size
      6: `${110 * scale}px`,  // Roll - reduced size
      7: `${140 * scale}px`,  // Ship - reduced size
      8: `${105 * scale}px`,  // Fan - reduced size
    };
  }

  // ✅ Instruction & image elements
  const instruction = document.querySelector(".cont h1");
  const miloImg = document.querySelector(".milo");
  const clickImg = document.querySelector(".click");
  const img4 = document.querySelector(".img4");
  const img5 = document.querySelector(".img5");
  const moreImg = document.querySelector(".more");
  const lessImg = document.querySelector(".less");

  [miloImg, clickImg, img4, img5, moreImg, lessImg].forEach(img => {
    if (img) img.style.display = "none";
  });
  if (instruction) instruction.style.opacity = "0";
  
  // ✅ Initialize .click element - hide by default
  if (clickImg) {
    clickImg.style.display = "none";
    clickImg.style.opacity = "0";
  }

  // ✅ Subtitle system - Add your custom text for each audio here
  const audioSubtitles = {
    1: "Welcome to the toy shelf!",
    2: "Let's organize our toys together.",
    3: "There are two shelves waiting for toys.",
    4: "Look at the empty shelves above",
    5: "Click on any toy below to place it on the shelf",
    6: "Great! Let's keep organizing.",
    7: "You're doing an amazing job!",
    8: "Keep going, almost there!",
    9: "Excellent placement!",
    10: "More toys are waiting for you",
    11: "Keep organizing the toys",
    12: "Wonderful work!",
    13: "You're a great helper!",
    14: "All toys are being organized perfectly",
    15: "Almost finished!",
    16: "Great job completing the activity!"
  };

  // ✅ Create subtitle element in .cont
  const contElement = document.querySelector(".cont");
  let subtitleElement = null;
  if (contElement) {
    subtitleElement = document.createElement("div");
    subtitleElement.className = "subtitle-text";
    subtitleElement.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: #333;
      font-size: 28px;
      font-weight: bold;
      text-align: center;
      opacity: 0;
      transition: opacity 0.3s ease;
      pointer-events: none;
      z-index: 100;
      background: rgba(255, 255, 255, 0.9);
      padding: 15px 30px;
      border-radius: 10px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    `;
    contElement.appendChild(subtitleElement);
  }

  let isPlayingAudio = false;
  let toysClickable = false;
  const audioQueue = [];
  let typewriterTimeout = null;

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

  // ✅ Typing animation function
  function typeText(element, text, speed = 50) {
    // Clear any existing timeout
    if (typewriterTimeout) {
      clearTimeout(typewriterTimeout);
    }
    
    element.textContent = "";
    let index = 0;
    
    function type() {
      if (index < text.length) {
        element.textContent += text.charAt(index);
        index++;
        typewriterTimeout = setTimeout(type, speed);
      }
    }
    
    type();
  }

  function playNextAudio() {
    if (isPlayingAudio || audioQueue.length === 0) return;
    const audioNum = audioQueue.shift();
    if (audioNum > 16) return;
    isPlayingAudio = true;

    const audio = new Audio(`./audio/${String(audioNum).padStart(2, "0")}.mp3`);
    console.log("🎵 Playing audio:", audioNum);

    // ✅ Show subtitle text when audio starts with typing animation
    if (subtitleElement && audioSubtitles[audioNum] && audioSubtitles[audioNum].trim() !== "") {
      subtitleElement.style.opacity = "1";
      typeText(subtitleElement, audioSubtitles[audioNum], 30);
    }

    // ✅ Update .click element with audio subtitle text with typing animation
    if (clickImg && audioSubtitles[audioNum] && audioSubtitles[audioNum].trim() !== "") {
      clickImg.style.display = "block";
      clickImg.style.opacity = "1";
      // Note: clickImg might be an image element, so we'll check if it has textContent property
      if (clickImg.textContent !== undefined) {
        typeText(clickImg, audioSubtitles[audioNum], 30);
      }
    }

    switch (audioNum) {
      case 4:
        if (miloImg) miloImg.style.display = "block";
        if (instruction) instruction.style.opacity = "1";
        break;
      case 5:
        if (instruction) {
          instruction.style.opacity = "1";
          instruction.innerHTML = '<span style="color:red;font-weight:bold;">Click</span> the beds';
        }
        break;
      case 9:
        if (img5) img5.style.display = "block";
        break;
      case 10:
        if (img4) img4.style.display = "block";
        break;
      case 11:
        if (moreImg) moreImg.style.display = "block";
        break;
      case 12:
        if (lessImg) lessImg.style.display = "block";
        break;
    }

    audio.onended = () => {
      // ✅ Hide subtitle text when audio ends
      if (subtitleElement) {
        subtitleElement.style.opacity = "0";
      }

      // ✅ Hide .click element when audio ends (will show again with next audio if it has text)
      if (clickImg) {
        clickImg.style.opacity = "0";
        // Don't hide completely, just fade out - next audio will update it
      }

      switch (audioNum) {
        case 4:
          if (miloImg) miloImg.style.display = "none";
          if (instruction) instruction.style.opacity = "0";
          break;
        case 5:
          if (instruction) {
            instruction.innerHTML =
              '<span style="color:red;font-weight:bold;">Tap</span> and <span style="color:red;font-weight:bold;">drag</span> toys<br>to the shelves';
            instruction.style.opacity = "0";
          }
          enableToyClicks();
          break;
        case 9:
          if (img5) img5.style.display = "none";
          break;
        case 10:
          if (img4) img4.style.display = "none";
          break;
        case 11:
          if (moreImg) moreImg.style.display = "none";
          break;
        case 12:
          if (lessImg) lessImg.style.display = "none";
          break;
      }

      if (audioNum === 16) {
        showPlayAgainPage();
      }

      isPlayingAudio = false;
      playNextAudio();
    };

    audio.play().catch(err => console.log("Audio play error:", err));
  }

  function playInitialAudios() {
    disableToyClicks();
    setTimeout(() => {
      audioQueue.push(1, 3, 4, 5);
      playNextAudio();
    }, 1000);
  }

  let started = false;
  document.addEventListener("click", () => {
    if (!started) {
      started = true;
      playInitialAudios();
      console.log("▶️ Audio sequence started after user click");
    }
  });

  items.forEach((item, index) => {
    item.addEventListener("click", () => {
      if (!toysClickable || placedItems.has(item)) return;

      toyPositions = getToyPositionsRelativeToLip();

      const targetShelf = index < 5 ? "A" : "B";
      const positionIndex = targetShelf === "A" ? index : index - 5;
      const shelfContainer = targetShelf === "A" ? shelfA : shelfB;
      const lipElement = targetShelf === "A" ? lipA : lipB;

      console.log("🧸 Item clicked:", item.alt, "→ Shelf:", targetShelf);

      placedItems.add(item);
      // ✅ Hide the original image from .items - preserve size of remaining items
      // Before hiding, ensure remaining visible items maintain their size
      item.style.display = "none";
      item.style.pointerEvents = "none";
      
      // ✅ Force remaining visible images to maintain their size
      const widthPercentages = {
        "duck": 7,
        "hore": 11,
        "house": 6,
        "train": 7,
        "ship": 10,
        "ball": 7,
        "fan": 6
      };
      
      // Handle items-img-A (for Shelf A)
      if (targetShelf === "A") {
        const itemsImgA = document.querySelector(".items-img-A");
        if (itemsImgA) {
          setTimeout(() => {
            const allItemsInA = itemsImgA.querySelectorAll("img");
            allItemsInA.forEach(img => {
              const imgId = img.id;
              const correspondingItem = Array.from(items).find(i => i.id === imgId);
              const isPlaced = correspondingItem && placedItems.has(correspondingItem);
              
              if (!isPlaced && widthPercentages[imgId]) {
                const percent = widthPercentages[imgId];
                const viewportWidth = window.innerWidth;
                const pixelWidth = (viewportWidth * percent) / 100;
                img.style.width = `${pixelWidth}px`;
                img.style.minWidth = `${pixelWidth}px`;
                img.style.maxWidth = `${pixelWidth}px`;
                img.style.flexShrink = "0";
                img.style.flexGrow = "0";
              }
            });
          }, 0);
        }
      }
      
      // Handle items-img-B (for Shelf B)
      if (targetShelf === "B") {
        const itemsImgB = document.querySelector(".items-img-B");
        if (itemsImgB) {
          setTimeout(() => {
            const allItemsInB = itemsImgB.querySelectorAll("img");
            allItemsInB.forEach(img => {
              const imgId = img.id;
              const correspondingItem = Array.from(items).find(i => i.id === imgId);
              const isPlaced = correspondingItem && placedItems.has(correspondingItem);
              
              if (!isPlaced && widthPercentages[imgId]) {
                const percent = widthPercentages[imgId];
                const viewportWidth = window.innerWidth;
                const pixelWidth = (viewportWidth * percent) / 100;
                img.style.width = `${pixelWidth}px`;
                img.style.minWidth = `${pixelWidth}px`;
                img.style.maxWidth = `${pixelWidth}px`;
                img.style.flexShrink = "0";
                img.style.flexGrow = "0";
              }
            });
          }, 0);
        }
      }

      // ✅ Map clicked item ID to corresponding toy image ID in toys-above divs
      const itemIdMap = {
        "train": "train-toy",
        "hore": "hore-toy",
        "dino": "dino-toy",
        "house": "house-toy",
        "ball": "ball-toy",
        "duck": "duck-toy",
        "roll": "roll-toy",
        "ship": "ship-toy",
        "fan": "fan-toy"
      };

      const toyImageId = itemIdMap[item.id] || `${item.id}-toy`;
      const toyImageElement = document.getElementById(toyImageId);

      // ✅ Get alt text from the clicked image or the corresponding toy image
      let toyName = item.alt && item.alt.trim() !== "" ? item.alt : "";
      if (!toyName && toyImageElement && toyImageElement.alt) {
        toyName = toyImageElement.alt;
      }
      if (!toyName && item.id) {
        // Use ID if alt is empty
        toyName = item.id.charAt(0).toUpperCase() + item.id.slice(1);
      }

      // ✅ Display image in toys-above-self-A or toys-above-self-B (show image, hide text)
      if (toyImageElement) {
        // Show the image (display: block)
        toyImageElement.style.display = "block";
        
        // Hide any existing text element if it exists
        const toyTextId = `${toyImageId}-text`;
        const toyTextElement = document.getElementById(toyTextId);
        if (toyTextElement) {
          toyTextElement.style.display = "none";
        }
      }

      // ✅ LIP KE RELATIVE POSITION CALCULATE KARO
      const lipRect = lipElement.getBoundingClientRect();
      const shelfRect = shelfContainer.getBoundingClientRect();
      
      // Lip ka shelf ke andar relative position
      const relativeX = lipRect.left - shelfRect.left;
      const relativeY = lipRect.top - shelfRect.top;
      
      // Toy ka lip ke andar position
      const toyPos = toyPositions[targetShelf][positionIndex];

      const clone = item.cloneNode(true);
      clone.dataset.originalIndex = index;
      
      clone.style.position = "absolute";
      // ✅ Final position = Lip position + Toy offset
      clone.style.left = `${relativeX + toyPos.x}px`;
      clone.style.top = `${relativeY + toyPos.y}px`;

      const toySizes = getToySizes();
      clone.style.width = toySizes[index] || `${100 * toyPositions.scale}px`;
      clone.style.height = "auto";
      clone.style.zIndex = "1";
      clone.style.pointerEvents = "none";
      clone.style.opacity = "1";
      clone.style.transition = "all 0.3s ease";

      shelfContainer.appendChild(clone);

      if (placedItems.size === items.length) {
        console.log("✅ All toys placed!");
        for (let i = 9; i <= 16; i++) audioQueue.push(i);
        playNextAudio();
      }
    });
  });

  const homeBtn = document.getElementById("home");
  if (homeBtn) {
    homeBtn.addEventListener("click", () => {
      window.location.href = "main.html";
    });
  }
});

function showPlayAgainPage() {
  const overlay = document.createElement("div");
  overlay.style.position = "fixed";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100%";
  overlay.style.height = "100%";
  overlay.style.background = "transparent";
  overlay.style.display = "flex";
  overlay.style.justifyContent = "center";
  overlay.style.alignItems = "center";
  overlay.style.zIndex = "10";
  overlay.style.pointerEvents = "none";
  document.body.appendChild(overlay);

  const box = document.createElement("div");
  box.style.pointerEvents = "auto";
  box.style.width = "30%";
  box.style.minWidth = "320px";
  box.style.aspectRatio = "1 / 1";
  box.style.background = "linear-gradient(135deg, #ff7e00, #ffc300, #ffe766)";
  box.style.borderRadius = "30px";
  box.style.boxShadow = "0 8px 25px rgba(0,0,0,0.4)";
  box.style.display = "flex";
  box.style.flexDirection = "column";
  box.style.justifyContent = "center";
  box.style.alignItems = "center";
  box.style.color = "#fff";
  box.style.fontFamily = "'Comic Sans MS', cursive, sans-serif";
  box.style.fontSize = "28px";
  box.style.transform = "scale(0)";
  box.style.transition = "transform 0.5s ease";
  overlay.appendChild(box);

  const title = document.createElement("h2");
  title.innerText = "Great Job! 🎉";
  title.style.marginBottom = "20px";
  title.style.textShadow = "2px 2px 5px rgba(0,0,0,0.3)";
  box.appendChild(title);

  const btn = document.createElement("button");
  btn.innerText = "Play Again";
  btn.style.padding = "15px 40px";
  btn.style.fontSize = "22px";
  btn.style.border = "none";
  btn.style.borderRadius = "50px";
  btn.style.background = "linear-gradient(90deg, #692517ff, #8e5144ff)";
  btn.style.color = "white";
  btn.style.cursor = "pointer";
  btn.style.boxShadow = "0 4px 15px rgba(0,0,0,0.3)";
  btn.style.transition = "all 0.3s ease";
  btn.addEventListener("mouseover", () => {
    btn.style.transform = "scale(1.1)";
    btn.style.boxShadow = "0 6px 20px rgba(255,165,0,0.6)";
  });
  btn.addEventListener("mouseout", () => {
    btn.style.transform = "scale(1)";
    btn.style.boxShadow = "0 4px 15px rgba(0,0,0,0.3)";
  });
  btn.addEventListener("click", () => location.reload());
  box.appendChild(btn);

  setTimeout(() => {
    box.style.transform = "scale(1)";
  }, 100);
}