document.addEventListener("DOMContentLoaded", () => {
  const items = document.querySelectorAll("#items-container img");
  const shelfA = document.getElementById("shelfA-items");
  const shelfB = document.getElementById("shelfB-items");
  const itemsContainer = document.getElementById("items-container");
  
  console.log("Items found:", items.length); // Debug: check if items are found

  // Track which items have been placed
  const placedItems = new Set();
  
  // Predefined positions for each toy (matching image layout exactly)
  // Format: [x offset from shelf left, y offset from shelf top]
  // Shelf A: Top tier - Train (left), Horse (right); Bottom tier - Dino (left), Block House (middle), Ball (right)
  // Shelf B: Top tier - Duck (left), Pinwheel (right); Bottom tier - Boat (left), Spinning Top (right)
  const shelfPositions = {
    A: [
      { x: 10,  y: 120 },   // 0 Train  (top-left)
      { x: 200, y: 120 },   // 1 Horse  (top-right)
      { x: 10,  y: 270 },  // 2 Dino   (bottom-left)
      { x: 120, y: 270 },  // 3 Block  (bottom-center)
      { x: 225, y: 270 },  // 4 Ball   (bottom-right)
    ],
    B: [
      { x: 25,  y: 120 },   // 0 Duck   (top-left)
      { x: 220, y: 120 },   // 1 Fan    (top-right)
      { x: 65,  y: 270 },  // 2 Boat   (bottom-left)
      { x: 235, y: 270 },  // 3 Roll   (bottom-right)
    ]
  };

  items.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      // Prevent clicking same item twice
      if (placedItems.has(item) || item.classList.contains("moving")) {
        return;
      }

      const targetShelf = item.getAttribute("data-shelf");
      const positionIndex = parseInt(item.getAttribute("data-position"));
      const shelfContainer = targetShelf === "A" ? shelfA : shelfB;
      
      console.log("Item clicked:", item.src, "Target shelf:", targetShelf, "Position:", positionIndex); // Debug
      
      // Mark item as moving and hide immediately
      item.classList.add("moving");
      placedItems.add(item);
      
      // Hide item immediately from bottom - use !important to override Tailwind
      item.style.setProperty("display", "none", "important");
      item.style.setProperty("opacity", "0", "important");
      item.style.setProperty("visibility", "hidden", "important");

      // Get target shelf position using predefined positions
      const shelfRect = shelfContainer.getBoundingClientRect();
      const position = shelfPositions[targetShelf][positionIndex];

      // Create clone for shelf with specific position (immediately, no animation)
      const clone = item.cloneNode(true);
      clone.style.width = "60px";
      clone.style.height = "auto";
      clone.style.position = "absolute";
      clone.style.left = `${position.x}px`;
      clone.style.top = `${position.y}px`;
      clone.style.margin = "0";
      clone.style.padding = "0";
      clone.classList.remove("moving");
      
      // Remove all Tailwind classes and attributes that might interfere
      clone.className = "";
      clone.removeAttribute("data-shelf");
      clone.removeAttribute("data-position");
      clone.removeAttribute("class");
      
      // Reset all styles for shelf placement
      clone.style.zIndex = "1";
      clone.style.opacity = "1";
      clone.style.transform = "none";
      clone.style.display = "block";
      clone.style.cursor = "default";
      clone.style.pointerEvents = "none";
      clone.style.visibility = "visible";
      clone.style.transition = "none";
      
      // Add to shelf container immediately
      shelfContainer.appendChild(clone);
    });
  });

  // Home button navigation
  const homeBtn = document.getElementById("home");
  if (homeBtn) {
    homeBtn.addEventListener("click", () => {
      window.location.href = "main.html";
    });
  }

  // Optional: Reset functionality (can add a reset button if needed)
  function resetSimulation() {
    placedItems.clear();
    items.forEach(item => {
      item.style.display = "";
      item.style.animation = "";
      item.style.zIndex = "";
      item.classList.remove("moving");
    });
    shelfA.innerHTML = "";
    shelfB.innerHTML = "";
  }
});
