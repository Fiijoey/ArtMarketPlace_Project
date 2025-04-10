export async function loadHeaderFooter() {
    const headerTemplate = await loadTemplate("../partials/header.html");
    const footerTemplate = await loadTemplate("../partials/footer.html");
  
    const headerElement = document.querySelector("#main-header");
    const footerElement = document.querySelector("#main-footer");
  
    renderWithTemplate(headerTemplate, headerElement, true, updateCartCount);
    renderWithTemplate(footerTemplate, footerElement, true, updateCartCount);
  }