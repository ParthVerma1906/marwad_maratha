import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/hero/HeroSection";
import ProductShowcase from "@/components/products/ProductShowcase";
import WhyChooseSection from "@/components/why-choose/WhyChooseSection";
import StorySection from "@/components/story/StorySection";
import ContactSection from "@/components/contact/ContactSection";
import MobileSectionTransition from "@/components/layout/MobileSectionTransition";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <HeroSection />
        <MobileSectionTransition>
          <ProductShowcase />
        </MobileSectionTransition>
        <MobileSectionTransition direction="left" delay={0.05}>
          <WhyChooseSection />
        </MobileSectionTransition>
        <MobileSectionTransition delay={0.05}>
          <StorySection />
        </MobileSectionTransition>
        <MobileSectionTransition direction="right" delay={0.05}>
          <ContactSection />
        </MobileSectionTransition>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
