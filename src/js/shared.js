import { getLocalStorage } from "./utilities.mjs";

export function updateCartCount(loaded) {
  if (loaded) {
    const cartItems = getLocalStorage("so-cart") || [];
    const cartCountElement = document.querySelector(".cart-count");

    if (cartCountElement) {
      let count = 0;

      cartItems.forEach((item) => {
        count += item.quantity;
      });

      if (count > 0) {
        cartCountElement.textContent = count; // Update the number
        cartCountElement.style.display = "block"; // Show the cart count
      } else {
        cartCountElement.style.display = "none"; // Hide the cart count if the cart is empty
      }

      // Trigger the animation on cart icon
      const cartIcon = document.querySelector(".cartIcon");
      if (cartIcon) {
        cartIcon.classList.remove("cart-icon-animate");
        // Force reflow to restart the animation
        void cartIcon.offsetWidth;
        cartIcon.classList.add("cart-icon-animate");
      }
    }
  }
}
