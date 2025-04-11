import { loadHeaderFooter, addToLocalStorage } from "./utilities.mjs";

// Function to load artworks from JSON and display them
async function loadArtworks() {
  try {
    const response = await fetch("../public/json/artWorks.json");
    const artworks = await response.json();

    // Create HTML for all product cards
    const cardsHtml = artworks.map(createProductCard).join("");

    // Insert the HTML into the product cards container
    const productCardsContainer = document.querySelector(".product-cards");
    if (productCardsContainer) {
      productCardsContainer.innerHTML = cardsHtml;

      // Add event listeners to all "Add to Cart" buttons
      const addToCartButtons = document.querySelectorAll(".add-to-cart");
      addToCartButtons.forEach((button) => {
        button.addEventListener("click", (event) => {
          // Get artwork data from the button's data attribute
          const artwork = JSON.parse(event.target.dataset.artwork);

          // Set default quantity
          artwork.quantity = 1;

          // Add to cart (localStorage)
          addToLocalStorage(artwork);

          // Optional: Update cart count indicator
          updateCartCount();
        });
      });
    }
  } catch (error) {
    console.error("Error loading artworks:", error);
  }
}

// Helper function to create a product card HTML
function createProductCard(artwork) {
  return `<div class="product-card">
            <a href="../artPeice/index.html?art=${encodeURIComponent(artwork.art_name)}">
              <img src="${artwork.image}" alt="${artwork.art_name}" />
            </a>
            <h2>${artwork.art_name}</h2>
            <p>${artwork.description}</p>
            <p class="price">$${artwork.price}</p>
            <button class="add-to-cart" data-artwork='${JSON.stringify(artwork)}'>Add to Cart</button>
          </div>`;
}

// Function to update the cart count in the UI
function updateCartCount() {
  const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
  const cartCount = document.querySelector(".cart-count");
  if (cartCount) {
    cartCount.textContent = cartItems.length;
  }
}

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

  // Load and display artworks
  await loadArtworks();
})();
