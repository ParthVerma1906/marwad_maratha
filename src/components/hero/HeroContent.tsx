import { motion } from "framer-motion";

const scrollTo = (id: string) =>
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

const HeroContent = () => (
  <div className="relative z-20 h-full flex flex-col items-center justify-end pb-24 md:justify-center md:pb-0">
    <motion.div
      className="text-center w-full max-w-3xl mx-auto px-6"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <p className="text-sm md:text-base font-semibold tracking-[0.2em] uppercase text-mustard mb-4">
        Marwad Maratha · Gondia · Since 2018
      </p>
      <h1 className="font-heritage font-bold text-earth-foreground leading-[1.1] text-[clamp(2.25rem,7vw,4.5rem)] [text-shadow:0_2px_16px_hsl(var(--earth)/0.6)]">
        Flavours of Tradition.
        <span className="block italic font-semibold">Taste of Home.</span>
      </h1>
      <p className="mt-6 text-base md:text-lg text-earth-foreground/90 max-w-xl mx-auto">
        Homemade aachar and papad from a family kitchen in Gondia — recipes carried
        from Rajasthan to Maharashtra, made in small batches.
      </p>
      <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={() => scrollTo("products")}
          className="min-h-[48px] px-8 rounded-full bg-primary text-primary-foreground font-semibold text-base transition-transform hover:scale-[1.03] active:scale-[0.98]"
        >
          Explore Our Flavours
        </button>
        <button
          onClick={() => scrollTo("story")}
          className="min-h-[48px] px-8 rounded-full border-2 border-earth-foreground/70 text-earth-foreground font-semibold text-base transition-colors hover:bg-earth-foreground/10"
        >
          Our Story
        </button>
      </div>
    </motion.div>
  </div>
);

export default HeroContent;
