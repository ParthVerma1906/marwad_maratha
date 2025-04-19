
/**
 * This file lists all image assets used in the application.
 * In a production environment, these images would be properly processed by the build system.
 */

// Ensure images are copied to the public folder during build
export const productImages = {
  mangoPickle: "/images/mango-pickle.jpg",
  masalaPapad: "/images/masala-papad.jpg",
  mirchiPickle: "/images/mirchi-pickle.jpg",
  ricePapad: "/images/rice-papad.jpg",
  garlicPickle: "/images/garlic-pickle.jpg",
  lemonPickle: "/images/lemon-pickle.jpg",
  logo: "/lovable-uploads/6d7f352c-0c0a-4cae-bf02-fffd05703c31.png"
};

// This function would normally be part of a build process,
// but for this demo we're using public URLs directly
export const getImageUrl = (imagePath: string) => {
  // Convert src/assets paths to public paths
  if (imagePath.startsWith('/src/assets/')) {
    return `/images/${imagePath.split('/').pop()}`;
  }
  return imagePath;
};
