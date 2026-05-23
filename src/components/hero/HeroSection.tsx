
import HeroCarousel from "./HeroCarousel";
import HeroContent from "./HeroContent";
import HeroScrollIndicator from "./HeroScrollIndicator";

const HeroSection = () => {
  return (
    <section
      id="home"
      className="relative h-[90vh] md:h-screen w-full overflow-hidden"
      style={{ zIndex: 1 }}
    >
      <HeroCarousel />
      <HeroContent />
      <HeroScrollIndicator />
    </section>
  );
};

export default HeroSection;
