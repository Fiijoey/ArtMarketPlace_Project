import {
  loadHeaderFooter,
  getLocalStorage,
  setLocalStorage,
} from "./utilities.mjs";

// Function to render cart items
function renderCartItems() {
  const cartItems = getLocalStorage();
  const container = document.querySelector(".cart-items");

  // Clear existing content except the heading
  const heading = container.querySelector("h1");
  container.innerHTML = "";
  container.appendChild(heading);

  if (cartItems.length === 0) {
    // Display message if cart is empty
    const emptyMessage = document.createElement("p");
    emptyMessage.textContent = "Your cart is empty";
    emptyMessage.classList.add("empty-cart-message");
    container.appendChild(emptyMessage);

    // Hide the cart summary section
    const summarySection = document.querySelector(".cart-summary");
    if (summarySection) {
      summarySection.style.display = "none";
    }
    return;
  }

  // Show the cart summary section if it was hidden
  const summarySection = document.querySelector(".cart-summary");
  if (summarySection) {
    summarySection.style.display = "block";
  }

  // Calculate total price
  let subtotal = 0;

  // Loop through each cart item and generate HTML
  cartItems.forEach((item, index) => {
    const itemPrice = parseFloat(item.price) * item.quantity;
    subtotal += itemPrice;

    const itemHtml = `
      <div class="cart-item" data-id="${index}">
        <img src="${item.image}" alt="${item.art_name}">
        <div class="item-details">
          <h2>${item.art_name}</h2>
          <p>${item.description || "Art Print"}</p>
          <label>
            Qty:
            <input type="number" value="${item.quantity}" min="1" class="qty-input" data-id="${index}">
          </label>
          <button class="remove-btn" data-id="${index}">Remove</button>
        </div>
        <div class="item-price">GHs${itemPrice.toFixed(2)}</div>
      </div>
    `;
    container.insertAdjacentHTML("beforeend", itemHtml);
  });

  // Update subtotal in the summary section
  const subtotalElement = document.querySelector(".cart-summary p strong");
  if (subtotalElement) {
    subtotalElement.textContent = `GHs${subtotal.toFixed(2)}`;
  }

  // Add event listeners for remove buttons
  const removeButtons = document.querySelectorAll(".remove-btn");
  removeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const itemIndex = button.getAttribute("data-id");
      removeCartItem(itemIndex);
    });
  });

  // Add event listeners for quantity inputs
  const qtyInputs = document.querySelectorAll(".qty-input");
  qtyInputs.forEach((input) => {
    input.addEventListener("change", () => {
      const itemIndex = input.getAttribute("data-id");
      updateCartItemQuantity(itemIndex, parseInt(input.value));
    });
  });
}

// Function to remove an item from the cart
function removeCartItem(index) {
  const cartItems = getLocalStorage();
  cartItems.splice(index, 1);
  setLocalStorage(cartItems);
  renderCartItems();
}

// Function to update cart item quantity
function updateCartItemQuantity(index, quantity) {
  if (quantity < 1) return;

  const cartItems = getLocalStorage();
  cartItems[index].quantity = quantity;
  setLocalStorage(cartItems);
  renderCartItems();
}

// Using async IIFE to ensure header is loaded before rendering cart
(async function () {
  await loadHeaderFooter();

  // Render cart items
  renderCartItems();

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

  // Add event listener for checkout button
  const checkoutBtn = document.querySelector(".checkout-btn");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      alert("Checkout functionality will be implemented in a future update.");
    });
  }
})();
