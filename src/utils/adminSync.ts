// This is a simple utility to help synchronize data between the admin panel and the frontend

// Product synchronization
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
  return JSON.parse(localStorage.getItem("adminProducts") || "[]");
};

// Business information synchronization
export const syncBusinessInfo = (info) => {
  localStorage.setItem("businessInfo", JSON.stringify(info));
  
  // Create and dispatch a custom event
  const event = new Event("businessInfoUpdated");
  window.dispatchEvent(event);
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

// Get all products or filter by categories
export const getProducts = (category = null) => {
  try {
    const products = JSON.parse(localStorage.getItem("adminProducts") || "[]");
    if (category) {
      return products.filter(p => p.category === category);
    }
    return products;
  } catch (error) {
    console.error("Error retrieving products", error);
    return [];
  }
};

// Get popular products (those marked as isPopular or a sampling of each category)
export const getPopularProducts = (limit = 8) => {
  try {
    const products = JSON.parse(localStorage.getItem("adminProducts") || "[]");
    
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
