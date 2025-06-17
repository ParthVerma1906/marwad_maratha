
/**
 * This file lists all image assets used in the application.
 * In a production environment, these images would be properly processed by the build system.
 */

// Updated with actual uploaded images for hero carousel
export const productImages = {
  mangoPickle: "/lovable-uploads/aea4bde8-31cc-4d62-a906-6b79f9900eeb.png", // Beautiful mango pickle with papads
  masalaPapad: "/lovable-uploads/0a90b903-0fbf-493c-afbf-529d351c55c3.png", // Traditional hands with pickle jars
  mirchiPickle: "/lovable-uploads/12e66f00-6879-4cb0-b527-7e1d813a2663.png", // Royal heritage setting with pickles
  ricePapad: "/lovable-uploads/aea4bde8-31cc-4d62-a906-6b79f9900eeb.png", // Reusing the appetizing jar image
  garlicPickle: "/lovable-uploads/0a90b903-0fbf-493c-afbf-529d351c55c3.png", // Reusing the traditional hands image
  lemonPickle: "/lovable-uploads/12e66f00-6879-4cb0-b527-7e1d813a2663.png", // Reusing the heritage image
  logo: "/lovable-uploads/6d7f352c-0c0a-4cae-bf02-fffd05703c31.png"
};

export const getImageUrl = (imagePath: string) => {
  if (imagePath.startsWith('/src/assets/')) {
    return `/images/${imagePath.split('/').pop()}`;
  }
  return imagePath;
};
