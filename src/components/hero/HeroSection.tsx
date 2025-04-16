
import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { motion } from "framer-motion";
import HeroScene from "./HeroScene";

const HeroSection = () => {
  return (
    <section
      id="home"
      className="min-h-screen pt-16 relative overflow-hidden bg-gradient-to-br from-spiceYellow/30 via-background to-background"
    >
      {/* Decorative elements */}
      <div className="absolute top-20 right-20 w-32 h-32 rounded-full bg-turmeric/20 blur-3xl"></div>
      <div className="absolute bottom-10 left-10 w-64 h-64 rounded-full bg-maroon/10 blur-3xl"></div>

      {/* Pattern overlay */}
      <div className="absolute inset-0 bg-spice-pattern opacity-5"></div>

      <div className="container mx-auto grid md:grid-cols-2 gap-8 items-center min-h-[calc(100vh-4rem)] py-12">
        <div className="order-2 md:order-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <span className="inline-block font-display text-saffron tracking-wider">
              Est. 2017
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heritage font-bold leading-tight">
              <span className="text-maroon">Flavours of Tradition.</span>
              <br />
              <span className="text-saffron">Taste of Home.</span>
            </h1>
            <p className="text-lg md:text-xl text-foreground/80 max-w-lg">
              Discover authentic homemade pickles and papads, crafted with
              time-honored recipes from Rajasthan and Maharashtra's culinary heritage.
            </p>

            <div className="flex flex-wrap gap-4">
              <motion.button
                className="bg-maroon hover:bg-maroon/90 text-white rounded-full py-3 px-8 font-medium flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Explore Products
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M6 12h12m-6-6 6 6-6 6"></path>
                </svg>
              </motion.button>
              <motion.button
                className="border-2 border-saffron text-saffron hover:bg-saffron/10 rounded-full py-3 px-8 font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Our Story
              </motion.button>
            </div>

            <div className="flex items-center gap-4 pt-4">
              <motion.div
                className="flex -space-x-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full border-2 border-white bg-gradient-to-br from-saffron/80 to-maroon/80"
                  ></div>
                ))}
              </motion.div>
              <div className="text-sm">
                <p className="font-semibold">2000+ Happy Customers</p>
                <p className="text-muted-foreground">Across India</p>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="order-1 md:order-2 h-[400px] md:h-[500px]">
          <motion.div
            className="w-full h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
              <ambientLight intensity={0.5} />
              <directionalLight position={[10, 10, 5]} intensity={1} />
              <Suspense fallback={null}>
                <HeroScene />
              </Suspense>
              <OrbitControls enableZoom={false} />
            </Canvas>
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
        <p className="text-sm text-muted-foreground mb-2">Scroll to explore</p>
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
          >
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
