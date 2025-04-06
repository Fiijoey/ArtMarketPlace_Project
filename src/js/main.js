async function loadPartial(containerId, partialPath) {
  try {
    const response = await fetch(partialPath);
    if (response.ok) {
      const html = await response.text();
      const container = document.getElementById(containerId);
      if (container) {
        container.innerHTML = html;
      } else {
        console.error(`Container with ID '${containerId}' not found.`);
      }
    } else {
      console.error(`Failed to load ${partialPath}: `, response.status);
    }
  } catch (error) {
    console.error(`Error loading ${partialPath}: `, error);
  }
}

// Ensure that the DOM is fully loaded before attempting to load partials and attach event listeners
window.addEventListener("DOMContentLoaded", () => {
  // Adjusted paths relative to the served HTML file
  loadPartial("header-placeholder", "./partials/header.html");
  loadPartial("footer-placeholder", "./partials/footer.html");

  // Add event listener for hamburger menu toggle
  document.addEventListener("click", (event) => {
    if (event.target && event.target.id === "hamburger-menu") {
      const mobileMenu = document.getElementById("mobile-menu");
      if (mobileMenu) {
        mobileMenu.classList.toggle("hidden");
      } else {
        console.error("Mobile menu element with ID 'mobile-menu' not found.");
      }
    }
  });
});
