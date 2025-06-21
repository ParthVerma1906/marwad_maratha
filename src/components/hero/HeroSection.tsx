
import HeroCarousel from "./HeroCarousel";
import HeroContent from "./HeroContent";
import HeroScrollIndicator from "./HeroScrollIndicator";

const HeroSection = () => {
  return (
    <section
      id="home"
      className="relative h-screen w-full overflow-hidden"
    >
      <HeroCarousel />
      <HeroContent />
      <HeroScrollIndicator />
    </section>
  );
};

export default HeroSection;
