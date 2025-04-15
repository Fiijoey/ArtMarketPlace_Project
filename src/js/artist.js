import { loadHeaderFooter, clearHtml } from "./utilities.mjs";

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

  // Fetch and display artists data
  try {
    // Select the vision container
    const visionContainer = document.querySelector(".vision");

    if (visionContainer) {
      // Fetch artists data from JSON file
      const response = await fetch("../json/artists.json");

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const artists = await response.json();

      // Clear any existing content
      clearHtml(visionContainer);

      // Create a heading for the section
      const sectionHeading = document.createElement("h2");
      sectionHeading.textContent = "Meet Our Artists";
      visionContainer.appendChild(sectionHeading);

      // Create a container for all artist cards
      const artistsGrid = document.createElement("div");
      artistsGrid.className = "artists-grid";

      // Iterate through artists and create elements for each
      artists.forEach((artist) => {
        // Create anchor element for the artist detail page
        const artistLink = document.createElement("a");
        artistLink.href = `artist-detail.html?artist=${encodeURIComponent(artist.name)}`;
        artistLink.style.textDecoration = "none";
        artistLink.style.color = "inherit";

        // Create artist card
        const artistCard = document.createElement("div");
        artistCard.className = "artist-card";

        // Create HTML content for the artist card
        artistCard.innerHTML = `
            <div class="artistDetail-image">
              <img src="${artist.image}" alt="${artist.name}">
            </div>
            <div class="artist-info">
              <h3>${artist.name}</h3>
              <p class="artist-age">Age: ${artist.age}</p>
              <p class="artist-field">Field: ${artist.field_of_interest}</p>
              <p class="artist-story">${artist.story}</p>
            </div>
          `;

        // Wrap the card in the anchor
        artistLink.appendChild(artistCard);

        // Add the linked artist card to the grid
        artistsGrid.appendChild(artistLink);
      });

      // Add the grid to the vision container
      visionContainer.appendChild(artistsGrid);
    }
  } catch (error) {
    console.error("Error fetching artists data:", error);

    // Display error message in the vision section
    const visionContainer = document.querySelector(".vision");
    if (visionContainer) {
      clearHtml(visionContainer);
      const errorMessage = document.createElement("div");
      errorMessage.className = "error-message";
      errorMessage.innerHTML = `
          <h2>Oops! Something went wrong</h2>
          <p>We couldn't load the artists information. Please try again later.</p>
        `;
      visionContainer.appendChild(errorMessage);
    }
  }
})();
