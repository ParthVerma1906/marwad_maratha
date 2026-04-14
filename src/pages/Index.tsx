import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/hero/HeroSection";
import MarqueeDivider from "@/components/layout/MarqueeDivider";
import ProductShowcase from "@/components/products/ProductShowcase";
import WhyChooseSection from "@/components/why-choose/WhyChooseSection";
import StorySection from "@/components/story/StorySection";
import ContactSection from "@/components/contact/ContactSection";
import MobileSectionTransition from "@/components/layout/MobileSectionTransition";

const productMarquee = [
  "ATHANA MIRCH AACHAR", "NIMBU MITHA CHATANI", "DESI MIRCH AACHAR",
  "AAM KA AACHAR", "LASSAN AACHAR", "URAD DAL PAPAD",
  "AMLA AACHAR", "GUNDA AACHAR",
];

const trustMarquee = [
  "NO PRESERVATIVES", "FSSAI CERTIFIED", "HANDMADE IN SMALL BATCHES",
  "SHIPS PAN-INDIA", "100% HOMEMADE", "25+ VARIETIES",
  "500+ FAMILIES SERVED", "PREMIUM QUALITY",
];

const heritageMarquee = [
  "RAJASTHANI TRADITION", "MARATHI FLAVOURS", "SUN-DRIED SPICES",
  "FAMILY RECIPES", "GENERATIONAL CRAFT", "SMALL BATCH PREPARED",
  "AUTHENTIC TASTE", "MADE WITH LOVE",
];

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <HeroSection />

        {/* Products marquee — maroon strip after hero */}
        <MarqueeDivider
          items={productMarquee}
          bgColor="#8B1A1A"
          textColor="#FAF0E6"
          speed={22}
        />

        <MobileSectionTransition>
          <ProductShowcase />
        </MobileSectionTransition>

        {/* Trust marquee — dark gold strip before Why Choose */}
        <MarqueeDivider
          items={trustMarquee}
          bgColor="#1C0A04"
          textColor="#C8860A"
          dotColor="rgba(200,134,10,0.3)"
          speed={28}
          reverse
        />

        <MobileSectionTransition direction="left" delay={0.05}>
          <WhyChooseSection />
        </MobileSectionTransition>

        {/* Heritage marquee — warm strip before Story */}
        <MarqueeDivider
          items={heritageMarquee}
          bgColor="#5A1A0A"
          textColor="rgba(250,240,230,0.7)"
          dotColor="rgba(250,240,230,0.25)"
          speed={26}
        />

        <MobileSectionTransition delay={0.05}>
          <StorySection />
        </MobileSectionTransition>

        {/* Final marquee — maroon strip before Contact */}
        <MarqueeDivider
          items={[...productMarquee, ...trustMarquee.slice(0, 4)]}
          bgColor="#8B1A1A"
          textColor="#FAF0E6"
          speed={30}
          reverse
        />

        <MobileSectionTransition direction="right" delay={0.05}>
          <ContactSection />
        </MobileSectionTransition>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
