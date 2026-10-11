import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { BookOpen, Hand, Gem, ShieldCheck } from "lucide-react";
import traditionalKitchenImg from "@/assets/traditional-kitchen.jpg";

const features = [
  {
    icon: BookOpen,
    title: "Generational Recipes",
    description: "Time-honored family recipes passed down through decades of culinary tradition.",
  },
  {
    icon: Hand,
    title: "Handcrafted in Small Batches",
    description: "Every jar is made with personal attention, ensuring consistency and love in each bite.",
  },
  {
    icon: Gem,
    title: "Premium Quality Ingredients",
    description: "Sourced directly from trusted farmers — only the finest spices and produce.",
  },
  {
    icon: ShieldCheck,
    title: "No Artificial Preservatives",
    description: "Pure, clean ingredients. No chemicals, no shortcuts — just authentic flavor.",
  },
];

const WhyChooseSection = () => {
  const { ref, inView } = useInView({ triggerOnce: false, threshold: 0.1 });

  return (
    <section
      ref={ref}
      className="relative overflow-hidden py-12 md:py-16 lg:py-24"
      style={{ background: "linear-gradient(135deg, #3b1f12, #1f0f08)" }}
    >
      <div className="w-full px-4 md:px-8 lg:px-12 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12 items-center">
          {/* Left Column */}
          <div className="lg:col-span-3 space-y-6 md:space-y-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6 }}
            >
              <span className="font-heritage text-base md:text-lg tracking-wide" style={{ color: "#F4A261" }}>
                Our Promise
              </span>
              <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-heritage font-bold text-white mt-2 md:mt-3 mb-3 md:mb-5 leading-tight">
                Why Choose Us
              </h2>
              <p className="text-white/80 text-sm md:text-base lg:text-lg max-w-xl leading-relaxed">
                At Marwad Maratha, every product tells a story — of heritage kitchens,
                of sun-drenched spices, and of recipes that have stood the test of time.
              </p>
            </motion.div>

            <div className="space-y-4 md:space-y-7">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  className="flex items-start gap-3 md:gap-5"
                  initial={{ opacity: 0, x: -30 }}
                  animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                >
                  <div
                    className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: "rgba(244, 162, 97, 0.15)" }}
                  >
                    <feature.icon size={20} style={{ color: "#F4A261" }} />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold text-base md:text-lg mb-1">
                      {feature.title}
                    </h4>
                    <p className="text-white/70 text-sm md:text-base leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right Column - Image */}
          <motion.div
            className="lg:col-span-2 order-first lg:order-last"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <div className="overflow-hidden rounded-2xl" style={{ boxShadow: "0 25px 60px rgba(0, 0, 0, 0.4)" }}>
              <img
                src={traditionalKitchenImg}
                alt="Traditional Indian kitchen with handcrafted pickles and spices"
                className="w-full h-auto object-cover aspect-[4/3] lg:aspect-[3/4]"
                loading="lazy"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseSection;
