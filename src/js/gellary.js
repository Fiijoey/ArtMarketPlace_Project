import { loadHeaderFooter, clearHtml, qs } from "./utilities.mjs";

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

  // Gallery functionality
  await loadGalleryArtworks();

  // Load Instagram posts
  await loadInstagramPosts();
})();

/**
 * Fetches artwork data from JSON file and initializes gallery
 */
async function loadGalleryArtworks() {
  try {
    const response = await fetch("/public/json/artWorks.json");
    if (!response.ok) {
      throw new Error("Failed to fetch artwork data");
    }
    const data = await response.json();
    const artworks = data;

    renderGallery(artworks);
    setupFilterAndSort(artworks);
  } catch (error) {
    console.error("Error loading gallery artworks:", error);
    const gallery = document.querySelector(".art-gallery");
    if (gallery) {
      gallery.innerHTML =
        '<p class="error-message">Failed to load artwork data. Please try again later.</p>';
    }
  }
}

/**
 * Renders artwork cards in the gallery
 * @param {Array} artworks - Array of artwork objects
 */
function renderGallery(artworks) {
  const gallery = document.querySelector(".art-gallery");
  if (!gallery) return;

  clearHtml(gallery);

  // Generate HTML for each artwork card
  const cardsHTML = artworks
    .map(
      (artwork) => `
        <div class="art-card">
            <img src="${artwork.image}" alt="${artwork.art_name}">
            <h3>${artwork.art_name}</h3>
            <p class="description">${artwork.description}</p>
            <p class="artist">Artist: ${artwork.designed_by}</p>
            <p class="price">${artwork.price || "Price on request"}</p>
        </div>
    `,
    )
    .join("");

  gallery.innerHTML = cardsHTML;
}

/**
 * Sets up event listeners for filtering and sorting
 * @param {Array} artworks - Original array of artwork objects
 */
function setupFilterAndSort(artworks) {
  const filterInput = document.querySelector(".filter-input");
  const sortSelect = document.querySelector("#sort-filter");
  const categorySelect = document.querySelector("#category-filter");

  const updateGallery = () => {
    let filtered = [...artworks];

    // Apply filtering
    if (filterInput && filterInput.value) {
      const searchTerm = filterInput.value.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.art_name.toLowerCase().includes(searchTerm) ||
          item.designed_by.toLowerCase().includes(searchTerm),
      );
    }

    // Apply category filtering
    const selectedCategory = categorySelect ? categorySelect.value : "";
    if (selectedCategory && selectedCategory !== "all") {
      filtered = filtered.filter(
        (item) => getCategory(item) === selectedCategory,
      );
    }

    // Apply sorting
    if (sortSelect) {
      switch (sortSelect.value) {
        case "title-asc":
          filtered.sort((a, b) => a.art_name.localeCompare(b.art_name));
          break;
        case "title-desc":
          filtered.sort((a, b) => b.art_name.localeCompare(a.art_name));
          break;
        case "artist-asc":
          filtered.sort((a, b) => a.designed_by.localeCompare(b.designed_by));
          break;
        case "artist-desc":
          filtered.sort((a, b) => b.designed_by.localeCompare(a.designed_by));
          break;
        case "price-low":
          filtered.sort((a, b) => {
            const priceA = a.price
              ? parseFloat(a.price.replace(/[^0-9.-]+/g, ""))
              : Number.MAX_VALUE;
            const priceB = b.price
              ? parseFloat(b.price.replace(/[^0-9.-]+/g, ""))
              : Number.MAX_VALUE;
            return priceA - priceB;
          });
          break;
        case "price-high":
          filtered.sort((a, b) => {
            const priceA = a.price
              ? parseFloat(a.price.replace(/[^0-9.-]+/g, ""))
              : 0;
            const priceB = b.price
              ? parseFloat(b.price.replace(/[^0-9.-]+/g, ""))
              : 0;
            return priceB - priceA;
          });
          break;
        case "popular":
          // No sorting for popular as we don't have popularity data
          break;
        // Default case - no sorting
      }
    }

    renderGallery(filtered);
  };

  // Add event listeners to filter and sort controls
  if (filterInput) {
    filterInput.addEventListener("input", updateGallery);
  }

  if (sortSelect) {
    sortSelect.addEventListener("change", updateGallery);
  }

  if (categorySelect) {
    categorySelect.addEventListener("change", updateGallery);
  }
}

/**
 * Filters artworks by category
 * @param {Array} artworks - Array of artwork objects
 * @param {String} category - Category to filter by
 * @returns {Array} - Filtered array of artworks
 */
function filterByCategory(artworks, category) {
  if (!category || category === "all") {
    return artworks;
  }

  return artworks.filter((artwork) => {
    // Assuming there might be a category field in the future
    // For now, we can filter by artist as a demonstration
    return artwork.designed_by.toLowerCase() === category.toLowerCase();
  });
}

/**
 * Gets unique categories from artwork data
 * @param {Array} artworks - Array of artwork objects
 * @returns {Array} - Array of unique categories
 */
function getUniqueCategories(artworks) {
  // For now, we'll use artists as categories
  const artists = artworks.map((artwork) => artwork.designed_by);
  return [...new Set(artists)];
}

/**
 * Determines the category of an artwork based on its image filename
 * @param {Object} artwork - Artwork object
 * @returns {String} - Category name
 */
function getCategory(artwork) {
  const image = artwork.image.toLowerCase();
  if (image.includes("paint")) return "painting";
  if (image.includes("sculp")) return "sculpture";
  if (image.includes("watercolor")) return "digital";
  return "other";
}

/**
 * Fetches Instagram posts from JSON file and renders them
 */
async function loadInstagramPosts() {
  try {
    const response = await fetch("/public/json/instagramData.json");
    if (!response.ok) {
      throw new Error("Failed to load Instagram posts");
    }
    const instaData = await response.json();
    renderInstagramPosts(instaData);
  } catch (error) {
    console.error("Error loading Instagram posts:", error);
    const instaContainer = document.querySelector(".instaPosts");
    if (instaContainer) {
      instaContainer.innerHTML =
        '<p class="error-message">Unable to load Instagram posts.</p>';
    }
  }
}

/**
 * Renders Instagram posts in the designated container
 * @param {Array} posts - Array of Instagram post objects
 */
function renderInstagramPosts(posts) {
  const container = document.querySelector(".instaPosts");
  if (!container) return;

  clearHtml(container);

  let html = "";
  posts.forEach((post) => {
    html += `
      <div class="insta-post">
        <a href="${post.permalink}" target="_blank">
          <img src="${post.media_url}" alt="${post.caption || "Instagram post"}">
        </a>
        <p>${post.caption || ""}</p>
      </div>
    `;
  });

  container.innerHTML = html;
}
