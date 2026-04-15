import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Sun, Layers, Leaf, Quote, Heart, Award, Shield } from "lucide-react";
import kitchenImage from "@/assets/kitchen-origin.jpg";

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.1 },
  }),
};

const subtlePatternStyle = {
  backgroundImage:
    "url(\"data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 5L35 15H25L30 5zM15 30L25 35V25L15 30zM45 30L35 35V25L45 30zM30 55L25 45H35L30 55z' fill='%237A1E1E' fill-opacity='0.04'/%3E%3C/svg%3E\")",
};

/* ───── Origin Story ───── */
const OriginStory = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.15 });
  return (
    <div ref={ref} className="grid md:grid-cols-2 gap-6 md:gap-10 items-center">
      <motion.div className="rounded-xl overflow-hidden shadow-md" variants={fadeUp} custom={0} initial="hidden" animate={inView ? "visible" : "hidden"}>
        <img src={kitchenImage} alt="Traditional Indian kitchen" className="w-full h-full object-cover aspect-[4/3]" loading="lazy" />
      </motion.div>
      <motion.div className="space-y-3 md:space-y-4" variants={fadeUp} custom={1} initial="hidden" animate={inView ? "visible" : "hidden"}>
        <span className="text-secondary font-heritage text-sm tracking-widest uppercase">Our Story</span>
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-heritage font-bold leading-tight text-foreground">
          About Marwad Maratha
        </h2>
        <div className="space-y-3 text-muted-foreground text-sm md:text-base leading-relaxed">
          <p>Marwad Maratha began not as a business, but as a family tradition. What started in our kitchens in Rajasthan and Maharashtra — preparing pickles and papads for loved ones — slowly became something we wanted to share with more homes.</p>
          <p>These are not new recipes. They are inheritances. Preserved with patience. Prepared with care. Made the same way our grandmothers did.</p>
        </div>
      </motion.div>
    </div>
  );
};

/* ───── Our Process ───── */
const processItems = [
  { icon: Sun, title: "Sun-Dried Ingredients", desc: "Traditional sun-drying for authentic flavour." },
  { icon: Layers, title: "Small Batch Preparation", desc: "Prepared in limited quantities for freshness." },
  { icon: Leaf, title: "No Artificial Preservatives", desc: "Pure ingredients. No shortcuts." },
];

const OurProcess = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.15 });
  return (
    <div ref={ref} className="text-center">
      <motion.h2 className="text-2xl md:text-3xl lg:text-4xl font-heritage font-bold mb-5 md:mb-7 text-foreground" variants={fadeUp} custom={0} initial="hidden" animate={inView ? "visible" : "hidden"}>
        How We Preserve Tradition
      </motion.h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-5 max-w-3xl mx-auto">
        {processItems.map((item, i) => (
          <motion.div key={item.title} className="flex flex-col items-center gap-2 p-4 md:p-5 rounded-xl bg-card border border-border" variants={fadeUp} custom={i + 1} initial="hidden" animate={inView ? "visible" : "hidden"}>
            <item.icon className="w-6 h-6 md:w-7 md:h-7 text-secondary" strokeWidth={1.5} />
            <h3 className="font-heritage font-semibold text-base md:text-lg text-foreground">{item.title}</h3>
            <p className="text-muted-foreground text-xs md:text-sm">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

/* ───── Our Values ───── */
const valueItems = [
  { icon: Heart, label: "Authenticity Over Trends" },
  { icon: Award, label: "Quality Over Quantity" },
  { icon: Shield, label: "Tradition Over Shortcuts" },
];

const OurValues = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });
  return (
    <div ref={ref} className="rounded-xl py-6 md:py-8 px-4" style={{ backgroundColor: "hsl(33 35% 82%)" }}>
      <motion.h2 className="text-2xl md:text-3xl lg:text-4xl font-heritage font-bold text-center mb-4 md:mb-6 text-foreground" variants={fadeUp} custom={0} initial="hidden" animate={inView ? "visible" : "hidden"}>
        What We Stand For
      </motion.h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 max-w-3xl mx-auto">
        {valueItems.map((v, i) => (
          <motion.div key={v.label} className="flex flex-col items-center gap-2 bg-card rounded-lg border border-primary/20 p-4 md:p-5" variants={fadeUp} custom={i + 1} initial="hidden" animate={inView ? "visible" : "hidden"}>
            <v.icon className="w-5 h-5 md:w-6 md:h-6 text-secondary" strokeWidth={1.6} />
            <span className="font-heritage font-bold text-sm md:text-base text-foreground text-center">{v.label}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

/* ───── Testimonials ───── */
const testimonials = [
  { name: "Priya Sharma", location: "Mumbai", quote: "The mango pickle is exactly like my grandmother used to make in Rajasthan. That raw, tangy punch with the perfect balance of spices — it's hard to find this kind of authenticity anywhere else." },
  { name: "Vikram Singh", location: "Jaipur", quote: "I've tried garlic pickles from many brands, but Marwad Maratha's is on another level. Bold, aromatic, and you can tell it's made with real care — not factory-produced." },
];

const TestimonialSnapshot = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.15 });
  return (
    <div ref={ref} className="max-w-3xl mx-auto">
      <motion.p className="text-center text-muted-foreground text-xs md:text-sm mb-1.5 tracking-wide" variants={fadeUp} custom={0} initial="hidden" animate={inView ? "visible" : "hidden"}>
        Trusted by families across Rajasthan and Maharashtra.
      </motion.p>
      <motion.h2 className="text-2xl md:text-3xl lg:text-4xl font-heritage font-bold text-center mb-4 md:mb-6 text-foreground" variants={fadeUp} custom={0} initial="hidden" animate={inView ? "visible" : "hidden"}>
        Customer Reviews
      </motion.h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
        {testimonials.map((t, i) => (
          <motion.div key={t.name} className="bg-card rounded-lg p-4 md:p-5 shadow-sm border-l-[3px] border-l-primary" variants={fadeUp} custom={i + 1} initial="hidden" animate={inView ? "visible" : "hidden"}>
            <Quote className="w-4 h-4 md:w-5 md:h-5 text-secondary/50 mb-2" />
            <p className="text-foreground/80 italic leading-relaxed mb-3 text-xs md:text-sm">"{t.quote}"</p>
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-primary flex items-center justify-center text-[0.6rem] md:text-[0.65rem] font-bold text-primary-foreground">
                {t.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <div>
                <p className="font-semibold text-xs md:text-sm text-foreground">{t.name}</p>
                <p className="text-muted-foreground text-[10px] md:text-xs">{t.location}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

/* ───── Main ───── */
const StorySection = () => (
  <section id="story" className="py-8 md:py-10 lg:py-14 relative overflow-hidden bg-background">
    <div className="absolute inset-0 pointer-events-none" style={subtlePatternStyle} />
    <div className="w-full px-4 md:px-8 lg:px-12 max-w-7xl mx-auto space-y-8 md:space-y-10 lg:space-y-12 relative z-10">
      <OriginStory />
      <OurProcess />
      <OurValues />
      <TestimonialSnapshot />
    </div>
  </section>
);

export default StorySection;
