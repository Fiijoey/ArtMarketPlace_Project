import { loadHeaderFooter, getParam, clearHtml } from "./utilities.mjs";

// IIFE to execute code on page load
(function () {
  // 1. Load header and footer
  loadHeaderFooter();

  // 2. Get artist parameter from URL
  const artistName = getParam("artist");

  // 3. Fetch artists data and find matching artist
  fetch("../public/json/artists.json")
    .then((response) => response.json())
    .then((artists) => {
      // Find artist with a matching name
      const artist = artists.find((item) => item.name === artistName);
      if (!artist) {
        // Display error if artist is not found
        const artistInfoSection = document.getElementById("artist-info");
        clearHtml(artistInfoSection);
        artistInfoSection.innerHTML = "<p>No matching artist found.</p>";
        throw new Error("Artist not found");
      }

      // 4. Populate #artist-info with artist data
      const artistInfoSection = document.getElementById("artist-info");
      clearHtml(artistInfoSection);
      artistInfoSection.innerHTML = `
        <img src="${artist.image}" alt="${artist.name}" class="artist-image">
        <h2>${artist.name}</h2>
        <p>Age: ${artist.age}</p>
        <p>Field: ${artist.field}</p>
        <p>${artist.story}</p>
      `;

      // 5. Fetch artworks data and filter by artist name
      return fetch("../public/json/artWorks.json")
        .then((response) => response.json())
        .then((artworks) => ({ artist, artworks }));
    })
    .then(({ artist, artworks }) => {
      // Filter artworks based on the artist's name
      const filteredArtworks = artworks.filter(
        (art) => art.designed_by === artist.name,
      );
      const artworksGrid = document.getElementById("artworks-grid");
      clearHtml(artworksGrid);

      // Add class for grid layout
      artworksGrid.classList.add("artist-artworks-grid");

      if (filteredArtworks.length === 0) {
        artworksGrid.innerHTML = "<p>No artworks found for this artist.</p>";
        return;
      }

      // 6. Render artwork cards in the grid
      filteredArtworks.forEach((artwork) => {
        const cardDiv = document.createElement("div");
        cardDiv.classList.add("artwork-card");

        cardDiv.innerHTML = `
          <img src="${artwork.image}" alt="${artwork.title}" class="artwork-image">
          <h3>${artwork.title}</h3>
          <p>${artwork.description || ""}</p>
        `;

        artworksGrid.appendChild(cardDiv);
      });
    })
    .catch((error) => {
      console.error("Error:", error);
    });

  // Pseudocode:
  // 1. Load header and footer
  // 2. Get artist parameter from URL
  // 3. Fetch artists.json and find matching artist
  // 4. Populate #artist-info with artist data
  // 5. Fetch artWorks.json, filter by artist name, and render cards in #artworks-grid
})();
