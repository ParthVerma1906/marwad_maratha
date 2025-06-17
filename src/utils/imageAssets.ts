
/**
 * This file lists all image assets used in the application.
 * Using reliable placeholder images from Unsplash for hero carousel
 */

// Using reliable Unsplash images for hero carousel
export const productImages = {
  mangoPickle: "https://images.unsplash.com/photo-1506368083636-6defb67639a7?w=800&h=600&fit=crop", // Traditional Indian spices and food
  masalaPapad: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&h=600&fit=crop", // Indian traditional cooking
  mirchiPickle: "https://images.unsplash.com/photo-1571091655789-405eb7a3a3a8?w=800&h=600&fit=crop", // Indian spices and traditional preparation
  ricePapad: "/lovable-uploads/aea4bde8-31cc-4d62-a906-6b79f9900eeb.png", // Fallback to uploaded if available
  garlicPickle: "/lovable-uploads/0a90b903-0fbf-493c-afbf-529d351c55c3.png", // Fallback to uploaded if available
  lemonPickle: "/lovable-uploads/12e66f00-6879-4cb0-b527-7e1d813a2663.png", // Fallback to uploaded if available
  logo: "/lovable-uploads/6d7f352c-0c0a-4cae-bf02-fffd05703c31.png"
};

export const getImageUrl = (imagePath: string) => {
  // Handle lovable uploads
  if (imagePath.startsWith('/lovable-uploads/')) {
    return imagePath;
  }
  // Handle legacy src/assets paths
  if (imagePath.startsWith('/src/assets/')) {
    return `/images/${imagePath.split('/').pop()}`;
  }
  // Handle external URLs
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  return imagePath;
};
