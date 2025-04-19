
/**
 * Debug utilities for the application
 */

// Log image loading issues to help diagnose problems
export const setupImageLoadingDebugger = () => {
  console.log('Setting up image loading debugger');
  
  // Monitor all image load events
  document.addEventListener('error', (e) => {
    const target = e.target;
    if (target instanceof HTMLImageElement) {
      console.error(`Image failed to load: ${target.src}`);
    }
  }, true);
};

// Call this in development to help track image issues
export const debugImagePaths = (imagePath: string): string => {
  if (imagePath.startsWith('/src/assets/')) {
    console.warn(`Image path uses source directory which may not work in production: ${imagePath}`);
    return `/images/${imagePath.split('/').pop()}`;
  }
  return imagePath;
};
