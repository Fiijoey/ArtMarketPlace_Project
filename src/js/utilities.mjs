import { updateCartCount } from "./shared";

const LOCAL_STORAGE_KEY = "so-cart";

// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}
// or a more concise version if you are into that sort of thing:
// export const qs = (selector, parent = document) => parent.querySelector(selector);

// retrieve data from localstorage
export function getLocalStorage(key = LOCAL_STORAGE_KEY) {
  return JSON.parse(localStorage.getItem(key)) || [];
}

// save data to local storage
export function setLocalStorage(data, key = LOCAL_STORAGE_KEY) {
  let dataArray = data;
  localStorage.setItem(key, JSON.stringify(dataArray));
}

export function addToLocalStorage(data, key = LOCAL_STORAGE_KEY) {
  if (localStorage.getItem(key) == null) {
    // If the key doesn't exist in localStorage, create a new array with the item
    let dataArray = [];
    dataArray.push(data);
    localStorage.setItem(key, JSON.stringify(dataArray));
  } else {
    // Get the existing array from localStorage
    let dataArray = JSON.parse(localStorage.getItem(key));

    // Check if an item with the same art_name already exists in the cart
    const existingItem = dataArray.find(
      (item) => item.art_name === data.art_name,
    );

    if (existingItem) {
      // If the item already exists, increment its quantity
      existingItem.quantity += data.quantity;
    } else {
      // If the item doesn't exist, add it to the beginning of the array
      dataArray.unshift(data);
    }

    // Save the updated array back to localStorage
    localStorage.setItem(key, JSON.stringify(dataArray));
  }
}
// set a listener for both touchend and click
export function setClick(selector, callback) {
  qs(selector).addEventListener("touchend", (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener("click", callback);
}
export function clearHtml(element) {
  element.innerHTML = "";
}

//getParam function for return a parameter from the URL when requested

export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const value = urlParams.get(param);
  return value;
}

export function renderListWithTemplate(
  templateFn,
  parentElement,
  list,
  position = "afterbegin",
  clear = false,
) {
  if (clear) {
    clearHtml(parentElement);
  }
  const htmlStrings = list.map(templateFn);
  parentElement.insertAdjacentHTML(position, htmlStrings.join(""));
}

export function renderWithTemplate(template, parentElement, data, callback) {
  parentElement.innerHTML = template;
  if (callback) {
    callback(data);
  }
}

export async function loadTemplate(path) {
  const res = await fetch(path);
  const template = await res.text();
  return template;
}

export async function loadHeaderFooter() {
  const headerTemplate = await loadTemplate("../partials/header.html");
  const footerTemplate = await loadTemplate("../partials/footer.html");

  const headerElement = document.querySelector("#mainHeader");
  const footerElement = document.querySelector("#mainFooter");

  renderWithTemplate(headerTemplate, headerElement, true, updateCartCount);
  renderWithTemplate(footerTemplate, footerElement, true, updateCartCount);

  assignActiveNav();
}

export function assignActiveNav() {
  const currentPath = window.location.pathname;
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
