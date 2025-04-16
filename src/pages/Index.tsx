
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/hero/HeroSection";
import ProductShowcase from "@/components/products/ProductShowcase";
import StorySection from "@/components/story/StorySection";
import TestimonialSection from "@/components/testimonials/TestimonialSection";
import ContactSection from "@/components/contact/ContactSection";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <HeroSection />
        <ProductShowcase />
        <StorySection />
        <TestimonialSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
