import { loadHeaderFooter } from "./utilities.mjs";

// Using async IIFE to ensure header is loaded before adding event listeners
(async function () {
  await loadHeaderFooter();

  // Set active navigation link based on current page
  assignActiveNav();

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

  // Load and display artwork cards
  await loadArtworks();
})();

/**
 * Assigns 'active' class to navigation links that match the current page
 */
function assignActiveNav() {
  const currentPath = window.location.pathname;

  // Handle desktop navigation links
  const desktopNavLinks = document.querySelectorAll(".desktop-nav a");
  desktopNavLinks.forEach((link) => {
    const linkPath = new URL(link.href).pathname;
    if (
      (currentPath === "/" && linkPath === "/index.html") ||
      linkPath === currentPath
    ) {
      link.classList.add("active");
    }
  });

  // Handle mobile navigation links
  const mobileNavLinks = document.querySelectorAll(".mobile-nav a");
  mobileNavLinks.forEach((link) => {
    const linkPath = new URL(link.href).pathname;
    if (
      (currentPath === "/" && linkPath === "/index.html") ||
      linkPath === currentPath
    ) {
      link.classList.add("active");
    }
  });
}
/**
 * Shuffles an array randomly
 * @param {Array} array - The array to shuffle
 * @returns {Array} - The shuffled array
 */
function shuffleArray(array) {
  const newArray = [...array]; // Create a copy to avoid modifying the original
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]]; // Swap elements
  }
  return newArray;
}

/**
 * Creates HTML for a single artwork card
 * @param {Object} artwork - The artwork data object
 * @returns {string} - HTML string for the card
 */
function createArtworkCard(artwork) {
  return `
    <div class="blog-card">
      <img class="blog-card-image" src="${artwork.image}" alt="${artwork.art_name}">
      <div class="blog-card-content">
        <h3 class="blog-card-title">${artwork.art_name}</h3>
        <p class="blog-card-excerpt">${artwork.description}</p>
        <small>Designed by ${artwork.designed_by}</small>
      </div>
    </div>
  `;
}

/**
 * Fetches artwork data, shuffles it, and renders it to the page
 */
async function loadArtworks() {
  try {
    // Fetch artwork data from JSON file
    const response = await fetch("/public/json/artWorks.json");
    if (!response.ok) {
      throw new Error("Failed to fetch artwork data");
    }

    const data = await response.json();
    const artworks = data;

    // Shuffle the artworks array for random display
    const shuffledArtworks = shuffleArray(artworks);

    // Limit to only 3 artworks for the homepage
    const limitedArtworks = shuffledArtworks.slice(0, 3);

    // Generate HTML for only 3 artwork cards
    const cardsHTML = limitedArtworks
      .map((artwork) => createArtworkCard(artwork))
      .join("");

    // Insert the cards into the blog-cards container
    const blogCardsContainer = document.querySelector(".blog-cards");
    if (blogCardsContainer) {
      blogCardsContainer.innerHTML = cardsHTML;
    } else {
      console.error("Blog cards container not found in the DOM");
    }
  } catch (error) {
    console.error("Error loading artworks:", error);
  }
}
