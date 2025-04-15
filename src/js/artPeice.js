import { loadHeaderFooter, addToLocalStorage } from "./utilities.mjs";
import { updateCartCount } from "./shared.js";

// Function to get URL parameters
function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get(param);
}

// Function to load and display artwork details
async function loadArtworkDetails() {
  const productId = getParam("art");

  if (!productId) {
    console.error("No artwork ID provided in URL");
    document.querySelector(".product-details").innerHTML =
      "<p>Artwork not found</p>";
    return;
  }

  try {
    const response = await fetch("../public/json/artWorks.json");
    const artworks = await response.json();

    const artwork = artworks.find(
      (p) => p.art_name === decodeURIComponent(productId),
    );

    if (artwork) {
      // Update the product details in the DOM
      document.querySelector(".product-image img").src = artwork.image;
      document.querySelector(".product-image img").alt = artwork.art_name;
      document.querySelector(".product-details h1").textContent =
        artwork.art_name;
      document.querySelector(".product-details .price").textContent =
        `$${artwork.price}`;
      document.querySelector(".product-details .description").textContent =
        artwork.description;

      // Add event listener to the Add to Cart button
      const addToCartButton = document.querySelector(".add-to-cart");
      if (addToCartButton) {
        addToCartButton.addEventListener("click", (event) => {
          event.preventDefault();

          // Get quantity from input or default to 1
          const quantityInput = document.querySelector("#quantity");
          const quantity = quantityInput ? Number(quantityInput.value) : 1;

          // Create a copy of the artwork object with quantity
          const artworkToAdd = { ...artwork, quantity: quantity || 1 };

          // Add to cart
          addToLocalStorage(artworkToAdd);

          // Update cart count with animation
          updateCartCount(true);
        });
      }
    } else {
      // Handle product not found
      document.querySelector(".product-details").innerHTML =
        "<p>Artwork not found</p>";
    }
  } catch (error) {
    console.error("Error loading artwork details:", error);
    document.querySelector(".product-details").innerHTML =
      "<p>Error loading artwork details</p>";
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

  // Load and display artwork details
  await loadArtworkDetails();

  // Initialize cart count
  updateCartCount();
})();
