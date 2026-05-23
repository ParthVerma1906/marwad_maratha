
import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { productImages } from "@/utils/imageAssets";
import type { CarouselApi } from "@/components/ui/carousel";

const HeroCarousel = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.8, 0.5]);

  // Use the uploaded images in the exact sequence provided
  const heroImages = [
    {
      src: productImages.mangoPickle,
      alt: "Marwad Maratha 25 Plus Varieties Homemade Aachar and Papad Collection",
      title: "Premium Mango Pickle"
    },
    {
      src: productImages.traditionalSetup,
      alt: "Marwad Maratha Traditional Indian Heritage - Royal Culinary Setup",
      title: "Royal Heritage Recipes"
    }
  ];

  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());
  const [api, setApi] = useState<CarouselApi>();

  // Auto-rotate carousel
  useEffect(() => {
    if (!api) {
      return;
    }

    const interval = setInterval(() => {
      if (api.canScrollNext()) {
        api.scrollNext();
      } else {
        api.scrollTo(0);
      }
    }, 4000); // Change image every 4 seconds

    return () => clearInterval(interval);
  }, [api]);

  // Preload images to ensure they're available
  useEffect(() => {
    heroImages.forEach((image, index) => {
      const img = new Image();
      img.onload = () => {
        console.log(`Hero image ${index + 1} loaded successfully: ${image.src}`);
        setLoadedImages(prev => new Set([...prev, index]));
      };
      img.onerror = () => {
        console.error(`Hero image ${index + 1} failed to load: ${image.src}`);
        setImageErrors(prev => new Set([...prev, index]));
      };
      img.src = image.src;
    });
  }, []);

  const handleImageLoad = (index: number) => {
    console.log(`Image ${index + 1} displayed successfully`);
    setLoadedImages(prev => new Set([...prev, index]));
  };

  const handleImageError = (index: number) => {
    console.error(`Image ${index + 1} display failed, marking as error`);
    setImageErrors(prev => new Set([...prev, index]));
  };

  const getImageSrc = (index: number) => {
    if (imageErrors.has(index)) {
      console.log(`Using placeholder for image ${index + 1} due to error`);
      return "/placeholder.svg";
    }
    return heroImages[index].src;
  };

  return (
    <>
      {/* Background Image Carousel with Parallax Effect */}
      <motion.div 
        ref={ref}
        className="absolute inset-0 w-full h-full"
        style={{ y, opacity }}
      >
        <Carousel
          className="w-full h-full"
          setApi={setApi}
          opts={{
            align: "start",
            loop: true,
          }}
        >
          <CarouselContent className="h-full">
            {heroImages.map((image, index) => (
              <CarouselItem key={index} className="h-full">
                <div className="relative w-full h-full">
                  <img
                    src={getImageSrc(index)}
                    alt={image.alt}
                    className="w-full h-full object-cover object-[center_top] md:object-center"
                    width={1200}
                    height={800}
                    onLoad={() => handleImageLoad(index)}
                    onError={() => handleImageError(index)}
                    loading="eager"
                    fetchPriority="high"
                  />
                  
                  {/* Loading indicator */}
                  {!loadedImages.has(index) && !imageErrors.has(index) && (
                    <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-saffron"></div>
                    </div>
                  )}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </motion.div>

      {/* Overlay: base dim + strong bottom gradient for text contrast (mobile especially) */}
      <div className="absolute inset-0 bg-black/30 md:bg-black/30 z-10" />
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10 pointer-events-none" />
    </>
  );
};

export default HeroCarousel;
