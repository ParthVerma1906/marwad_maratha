
// This is a simple utility to help synchronize product data between the admin panel and the product showcase

export const syncProductData = (products) => {
  // Save products to localStorage
  localStorage.setItem("adminProducts", JSON.stringify(products));
  
  // Create and dispatch a custom event that the ProductShowcase can listen for
  const event = new Event("productsUpdated");
  window.dispatchEvent(event);
};

// Initialize with default products if not already set
export const initializeProducts = (defaultProducts) => {
  if (!localStorage.getItem("adminProducts")) {
    localStorage.setItem("adminProducts", JSON.stringify(defaultProducts));
  }
};
