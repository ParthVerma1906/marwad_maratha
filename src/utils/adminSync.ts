
// This is a utility to synchronize data between the admin panel and the frontend

// Product synchronization
export const syncProductData = (products) => {
  try {
    // Process products to ensure all required fields are preserved
    const processedProducts = products.map(product => ({
      ...product,
      ingredients: product.ingredients || [],
      // Ensure these fields are always included even if undefined
      description: product.description || "",
      isPopular: Boolean(product.isPopular)
    }));
    
    // Save products to localStorage with proper handling for base64 images
    localStorage.setItem("adminProducts", JSON.stringify(processedProducts));
    
    // Create and dispatch a custom event that components can listen for
    const event = new CustomEvent("productsUpdated", { detail: processedProducts });
    window.dispatchEvent(event);
    
    console.log("Products successfully synced to localStorage:", processedProducts.length);
    return true;
  } catch (error) {
    console.error("Error syncing product data:", error);
    return false;
  }
};

// Business information synchronization
export const syncBusinessInfo = (info) => {
  localStorage.setItem("businessInfo", JSON.stringify(info));
  
  // Create and dispatch a custom event with the updated info
  const event = new CustomEvent("businessInfoUpdated", { detail: info });
  window.dispatchEvent(event);
};

// Initialize with default products if not already set
export const initializeProducts = (defaultProducts) => {
  // Process default products to ensure consistent structure
  const processedProducts = defaultProducts.map(product => ({
    ...product,
    ingredients: product.ingredients || [],
    description: product.description || "",
    isPopular: Boolean(product.isPopular)
  }));
  
  // Only initialize if no products exist in localStorage
  if (!localStorage.getItem("adminProducts")) {
    localStorage.setItem("adminProducts", JSON.stringify(processedProducts));
    console.log("Initialized products in localStorage:", processedProducts.length);
  }
  
  // Return the current products from localStorage
  try {
    const storedProducts = JSON.parse(localStorage.getItem("adminProducts") || "[]");
    return storedProducts;
  } catch (error) {
    console.error("Error parsing stored products, returning defaults:", error);
    return processedProducts;
  }
};

// Get business information
export const getBusinessInfo = () => {
  const defaultInfo = {
    name: "Marwad Maratha",
    email: "durgagurhudyoggondia@gmail.com",
    phone: "+91-8830257574",
    address: "Gokuldham Colony, Near gaurav Furniture, Fulture Peth, Gondia (441601)",
  };
  
  const savedInfo = localStorage.getItem("businessInfo");
  if (savedInfo) {
    try {
      return JSON.parse(savedInfo);
    } catch (error) {
      console.error("Error parsing business info", error);
      return defaultInfo;
    }
  }
  return defaultInfo;
};

// Get all products or filter by categories with consistent structure
export const getProducts = (category = null) => {
  try {
    const products = JSON.parse(localStorage.getItem("adminProducts") || "[]").map(product => ({
      ...product,
      ingredients: product.ingredients || [],
      description: product.description || "",
      isPopular: Boolean(product.isPopular)
    }));
    
    if (category) {
      return products.filter(p => p.category === category);
    }
    return products;
  } catch (error) {
    console.error("Error retrieving products", error);
    return [];
  }
};

// Get popular products with consistent structure
export const getPopularProducts = (limit = 8) => {
  try {
    const products = JSON.parse(localStorage.getItem("adminProducts") || "[]").map(product => ({
      ...product,
      ingredients: product.ingredients || [],
      description: product.description || "",
      isPopular: Boolean(product.isPopular)
    }));
    
    // First try to get products specifically marked as popular
    const popularProducts = products.filter(p => p.isPopular);
    
    // If we have enough popular products, return those
    if (popularProducts.length >= limit) {
      return popularProducts.slice(0, limit);
    }
    
    // Otherwise, get a sampling of products from each category
    const categories = [...new Set(products.map(p => p.category))];
    let result = [...popularProducts];
    
    // Take products from each category until we reach the limit
    for (const category of categories) {
      if (result.length >= limit) break;
      
      const categoryProducts = products
        .filter(p => p.category === category && !p.isPopular)
        .slice(0, Math.ceil((limit - result.length) / categories.length));
        
      result = [...result, ...categoryProducts];
    }
    
    // If we still need more products, just take from the top of the list
    if (result.length < limit) {
      const remaining = products
        .filter(p => !result.some(rp => rp.id === p.id))
        .slice(0, limit - result.length);
        
      result = [...result, ...remaining];
    }
    
    return result.slice(0, limit);
  } catch (error) {
    console.error("Error retrieving popular products", error);
    return [];
  }
};
