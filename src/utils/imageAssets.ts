
/**
 * This file lists all image assets used in the application.
 * In a production environment, these images would be properly processed by the build system.
 */

// Replace `mangoPickle` with a usable placeholder pickles/papadum photo.
export const productImages = {
  mangoPickle: "/images/photo-1618160702438-9b02ab6515c9.jpg", // This should be a real photo you upload
  masalaPapad: "/images/masala-papad.jpg",
  mirchiPickle: "/images/mirchi-pickle.jpg",
  ricePapad: "/images/rice-papad.jpg",
  garlicPickle: "/images/garlic-pickle.jpg",
  lemonPickle: "/images/lemon-pickle.jpg",
  logo: "/lovable-uploads/6d7f352c-0c0a-4cae-bf02-fffd05703c31.png"
};

export const getImageUrl = (imagePath: string) => {
  if (imagePath.startsWith('/src/assets/')) {
    return `/images/${imagePath.split('/').pop()}`;
  }
  return imagePath;
};
