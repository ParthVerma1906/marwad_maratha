
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
      className="relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #3b1f12, #1f0f08)",
        padding: "100px 0",
      }}
    >
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-5 gap-12 items-center">
          {/* Left Column - 60% */}
          <div className="lg:col-span-3 space-y-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6 }}
            >
              <span
                className="font-heritage text-lg tracking-wide"
                style={{ color: "#F4A261" }}
              >
                Our Promise
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-heritage font-bold text-white mt-3 mb-5 leading-tight">
                Rooted in Tradition.{" "}
                <span style={{ color: "#F4A261" }}>Crafted with Care.</span>
              </h2>
              <p className="text-white/80 text-lg max-w-xl leading-relaxed">
                At Marwad Maratha, every product tells a story — of heritage kitchens,
                of sun-drenched spices, and of recipes that have stood the test of time.
                We bring you flavors that are as authentic as the hands that craft them.
              </p>
            </motion.div>

            <div className="space-y-7">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  className="flex items-start gap-5"
                  initial={{ opacity: 0, x: -30 }}
                  animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                >
                  <div
                    className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: "rgba(244, 162, 97, 0.15)" }}
                  >
                    <feature.icon size={22} style={{ color: "#F4A261" }} />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold text-lg mb-1">
                      {feature.title}
                    </h4>
                    <p className="text-white/70 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right Column - Image */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <div
              className="overflow-hidden"
              style={{
                borderRadius: "24px",
                boxShadow: "0 25px 60px rgba(0, 0, 0, 0.4)",
              }}
            >
              <img
                src={traditionalKitchenImg}
                alt="Traditional Indian kitchen with handcrafted pickles and spices"
                className="w-full h-auto object-cover aspect-[3/4]"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseSection;
