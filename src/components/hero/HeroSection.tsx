
import { motion } from "framer-motion";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { useState, useEffect } from "react";
import { productImages } from "@/utils/imageAssets";
import type { CarouselApi } from "@/components/ui/carousel";

const HeroSection = () => {
  // Use the uploaded images in the exact sequence provided
  const heroImages = [
    {
      src: productImages.mangoPickle,
      alt: "Authentic Mango Pickle in Traditional Glass Jar",
      title: "Premium Mango Pickle"
    },
    {
      src: productImages.traditionalSetup,
      alt: "Traditional Indian Heritage - Royal Culinary Setup",
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
    <section
      id="home"
      className="relative h-screen w-full overflow-hidden"
    >
      {/* Background Image Carousel */}
      <div className="absolute inset-0 w-full h-full">
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
                    className="w-full h-full object-cover"
                    onLoad={() => handleImageLoad(index)}
                    onError={() => handleImageError(index)}
                    loading="eager"
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
          <CarouselPrevious className="left-4 z-20" />
          <CarouselNext className="right-4 z-20" />
        </Carousel>
      </div>

      {/* Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#5d1f1f]/80 via-[#5d1f1f]/40 to-transparent z-10"></div>

      {/* Hero Content */}
      <div className="relative z-20 h-full flex items-center justify-center">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="space-y-6 max-w-4xl mx-auto"
          >
            {/* Headline */}
            <h1 
              className="font-display text-white text-[28px] md:text-[42px] lg:text-[48px] font-bold leading-tight"
              style={{ 
                textShadow: '2px 2px 5px rgba(0,0,0,0.4)',
                fontFamily: 'Playfair Display, serif'
              }}
            >
              <span className="block">Flavours of Tradition.</span>
              <span className="block">Taste of Home.</span>
            </h1>

            {/* Subtitle */}
            <motion.p 
              className="text-[#f9f1e7] text-[16px] md:text-[20px] max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6, ease: "easeInOut" }}
              style={{ 
                textShadow: '1px 1px 3px rgba(0,0,0,0.3)',
              }}
            >
              Discover authentic homemade pickles and papads, crafted with
              time-honored recipes from Rajasthan and Maharashtra's culinary heritage.
            </motion.p>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6, ease: "easeInOut" }}
              className="pt-4"
            >
              <motion.button
                onClick={() => {
                  const element = document.getElementById('products');
                  if (element) element.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-[#ff9933] hover:bg-[#cc7a29] text-white font-medium text-lg px-6 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                style={{
                  padding: '12px 24px',
                  borderRadius: '12px',
                  fontWeight: '600'
                }}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
                }}
                whileTap={{ scale: 0.98 }}
              >
                Explore Products
              </motion.button>
            </motion.div>

            {/* Social Proof */}
            <motion.div
              className="flex items-center justify-center gap-4 pt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.6, ease: "easeInOut" }}
            >
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full border-2 border-white bg-gradient-to-br from-saffron/80 to-maroon/80"
                  ></div>
                ))}
              </div>
              <div className="text-sm text-[#f9f1e7]" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.3)' }}>
                <p className="font-semibold">2000+ Happy Customers</p>
                <p className="opacity-90">Across India</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center z-20">
        <motion.p 
          className="text-sm text-[#f9f1e7] mb-2"
          style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.3)' }}
        >
          Scroll to explore
        </motion.p>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-[#f9f1e7]"
            style={{ filter: 'drop-shadow(1px 1px 3px rgba(0,0,0,0.3))' }}
          >
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
