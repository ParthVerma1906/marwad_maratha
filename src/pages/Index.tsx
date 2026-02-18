
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/hero/HeroSection";
import ProductShowcase from "@/components/products/ProductShowcase";
import WhyChooseSection from "@/components/why-choose/WhyChooseSection";
import StorySection from "@/components/story/StorySection";
import TestimonialSection from "@/components/testimonials/TestimonialSection";
import ContactSection from "@/components/contact/ContactSection";
import { CartProvider } from "@/hooks/useCart";

const Index = () => {
  return (
    <CartProvider>
      <div className="min-h-screen">
        <Navbar />
        <main>
          <HeroSection />
          <ProductShowcase />
          <WhyChooseSection />
          <StorySection />
          <TestimonialSection />
          <ContactSection />
        </main>
        <Footer />
      </div>
    </CartProvider>
  );
};

export default Index;
