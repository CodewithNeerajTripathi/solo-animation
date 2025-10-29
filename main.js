document.addEventListener("DOMContentLoaded", () => {
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
});
