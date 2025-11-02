document.addEventListener("DOMContentLoaded", () => {
  const rotateMessage = document.getElementById("rotate-message");
  const mainContent = document.querySelector(".main");
  
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
  window.addEventListener("orientationchange", () => {
    setTimeout(checkOrientation, 100);
  });

  const popup = document.getElementById("info-popup");
  const popupImg = document.getElementById("popup-img");
  const closePopup = document.getElementById("close-popup");

  // Sare info buttons select karo
  const infoButtons = document.querySelectorAll(".info-btn");

  infoButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const imgSrc = btn.getAttribute("data-img"); // jo image dikhani hai
      popupImg.src = imgSrc;
      popup.style.display = "flex"; // show popup
    });
  });

  // Close karne ke liye
  closePopup.addEventListener("click", () => {
    popup.style.display = "none";
  });

  // Background pe click karne se bhi close
  popup.addEventListener("click", (e) => {
    if (e.target === popup) {
      popup.style.display = "none";
    }
  });

  // All hover effects removed - no scaling on info buttons
});
