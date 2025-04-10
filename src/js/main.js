import { loadHeaderFooter } from "./utilities.mjs";

// Using async IIFE to ensure header is loaded before adding event listeners
(async function () {
  await loadHeaderFooter();

  // Get hamburger menu and mobile nav elements
  const hamburger = document.querySelector(".hamburger-menu");
  const mobileNav = document.querySelector(".mobile-nav");

  // Add click event listener to hamburger menu
  if (hamburger && mobileNav) {
    hamburger.addEventListener("click", () => {
      mobileNav.classList.toggle("active");
    });

    // Optional: Close mobile nav when a link inside it is clicked
    const mobileNavLinks = mobileNav.querySelectorAll("a");
    mobileNavLinks.forEach((link) => {
      link.addEventListener("click", () => {
        mobileNav.classList.remove("active");
      });
    });
  }
})();
