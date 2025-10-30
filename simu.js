document.addEventListener("DOMContentLoaded", () => {
  const items = document.querySelectorAll("#items-container img");
  const shelfA = document.getElementById("shelfA-items");
  const shelfB = document.getElementById("shelfB-items");
  const itemsContainer = document.getElementById("items-container");
  
  console.log("Items found:", items.length); // Debug: check if items are found

  // Track which items have been placed
  const placedItems = new Set();
  
  // Percent-based shelf positions for responsiveness
  const shelfPositionsPct = {
    A: [
      { x: 0.08, y: 0.22 }, // Train
      { x: 0.70, y: 0.22 }, // Horse
      { x: 0.08, y: 0.63 }, // Dino
      { x: 0.37, y: 0.63 }, // Block
      { x: 0.75, y: 0.63 }, // Ball
    ],
    B: [
      { x: 0.10, y: 0.22 }, // Duck
      { x: 0.67, y: 0.22 }, // Pinwheel
      { x: 0.23, y: 0.63 }, // Boat
      { x: 0.60, y: 0.63 }, // Roll
    ]
  };

  // Toy shelf image sizes: customize per toy per device
  const toySizes = {
    "Dinosaur":     { desktop: {w:150,h:150}, tablet: {w:20,h:20}, phone: {w:40,h:40} },
    "Train":        { desktop: {w:150,h:150}, tablet: {w:20,h:20}, phone: {w:40,h:40} },
    "Duck":         { desktop: {w:150,h:150}, tablet: {w:20,h:20}, phone: {w:40,h:40} },
    "Boat":         { desktop: {w:150,h:150}, tablet: {w:20,h:20}, phone: {w:40,h:40} },
    "Horse":        { desktop: {w:150,h:150}, tablet: {w:20,h:20}, phone: {w:40,h:40} },
    "Ball":         { desktop: {w:120,h:120}, tablet: {w:20,h:20},  phone: {w:45,h:45} },
    "Block House":  { desktop: {w:150,h:150}, tablet: {w:20,h:20}, phone: {w:40,h:40} },
    "Fan":          { desktop: {w:150,h:150}, tablet: {w:20,h:20}, phone: {w:40,h:40} },
    "Roll":         { desktop: {w:150,h:150}, tablet: {w:20,h:20}, phone: {w:40,h:40} },
    // Add more or adjust values per your needs
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
      const pos = shelfPositionsPct[targetShelf][positionIndex];

      // Create clone for shelf with specific position (immediately, no animation)
      const clone = item.cloneNode(true);
      // --- UNIQUE TOY SIZE PER DEVICE LOGIC ---
      const shelfWidth = shelfContainer.offsetWidth;
      const toyName = item.alt;
      let size = toySizes[toyName] || toySizes["Dinosaur"];
      if (shelfWidth <= 480 && size.phone) {
        clone.style.width = size.phone.w + "px";
        clone.style.height = size.phone.h + "px";
      } else if (shelfWidth <= 1023 && size.tablet) {
        clone.style.width = size.tablet.w + "px";
        clone.style.height = size.tablet.h + "px";
      } else {
        clone.style.width = size.desktop.w + "px";
        clone.style.height = size.desktop.h + "px";
      }
      // --- END SIZING BLOCK ---
      clone.style.position = "absolute";
      // When placing a toy on a shelf, use percent-based coordinates for responsive placement
      clone.style.left = `${shelfRect.width * pos.x}px`;
      clone.style.top  = `${shelfRect.height * pos.y}px`;
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
