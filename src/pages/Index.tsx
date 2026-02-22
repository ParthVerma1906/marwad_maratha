
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/hero/HeroSection";
import ProductShowcase from "@/components/products/ProductShowcase";
import WhyChooseSection from "@/components/why-choose/WhyChooseSection";
import StorySection from "@/components/story/StorySection";
import ContactSection from "@/components/contact/ContactSection";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <HeroSection />
        <ProductShowcase />
        <WhyChooseSection />
        <StorySection />
        {/* Testimonials now included in StorySection */}
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
