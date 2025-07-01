
/**
 * This file lists all image assets used in the application.
 * Using the newly uploaded images for hero carousel
 */

// Using the newly uploaded images for hero carousel
export const productImages = {
  mangoPickle: "/lovable-uploads/f960295d-d496-4554-a29e-b2b1faf6f6e6.png", // Mango pickle in glass jar
  traditionalSetup: "/lovable-uploads/71131b13-4efd-4c69-8555-504755507126.png", // Traditional Indian setup with royal figure
  mirchiPickle: "https://images.unsplash.com/photo-1571091655789-405eb7a3a3a8?w=800&h=600&fit=crop", // Fallback spices image
  ricePapad: "/lovable-uploads/aea4bde8-31cc-4d62-a906-6b79f9900eeb.png",
  garlicPickle: "/lovable-uploads/0a90b903-0fbf-493c-afbf-529d351c55c3.png",
  lemonPickle: "/lovable-uploads/12e66f00-6879-4cb0-b527-7e1d813a2663.png",
  logo: "/lovable-uploads/010cf85d-1380-42f9-9e85-bbad9333219c.png" // New logo
};

export const getImageUrl = (imagePath: string) => {
  // Handle lovable uploads - return as is
  if (imagePath.startsWith('/lovable-uploads/')) {
    return imagePath;
  }
  // Handle external URLs
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  return imagePath;
};
