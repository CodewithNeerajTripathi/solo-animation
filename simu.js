document.addEventListener("DOMContentLoaded", () => {
  const items = document.querySelectorAll(".items img");
  const shelfA = document.querySelector(".shelfi-A .shelf-items");
  const shelfB = document.querySelector(".shelfi-B .shelf-items");

  items.forEach((item, index) => {
    item.addEventListener("click", () => {
      // Clone item for shelf
      const clone = item.cloneNode(true);
      clone.style.width = "60px";
      clone.style.opacity = "0";
      clone.style.transform = "translateY(100px)";
      clone.style.transition = "all 0.5s ease";

      // Append to correct shelf
      if (index < 5) {
        shelfA.appendChild(clone);
      } else {
        shelfB.appendChild(clone);
      }

      // Fade out original from bottom
      item.style.transition = "opacity 0.4s ease, transform 0.4s ease";
      item.style.opacity = "0";
      item.style.transform = "translateY(-50px) scale(0.8)";

      // After fade-out, hide it completely
      setTimeout(() => {
        item.style.display = "none";
      }, 400);

      // Animate new clone appearing in shelf
      setTimeout(() => {
        clone.style.opacity = "1";
        clone.style.transform = "translateY(0)";
      }, 100);
    });
  });
});
