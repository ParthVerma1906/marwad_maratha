import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Sun, Layers, Leaf, Quote, Heart, Award, Shield } from "lucide-react";
import kitchenImage from "@/assets/kitchen-origin.jpg";

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1 },
  }),
};

/* ───── Block-print texture style ───── */
const subtlePatternStyle = {
  backgroundImage:
    "url(\"data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 5L35 15H25L30 5zM15 30L25 35V25L15 30zM45 30L35 35V25L45 30zM30 55L25 45H35L30 55z' fill='%237A1E1E' fill-opacity='0.04'/%3E%3C/svg%3E\")",
};

/* ───── Section 1: Origin Story ───── */
const OriginStory = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.15 });

  return (
    <div ref={ref} className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
      <motion.div
        className="rounded-xl overflow-hidden shadow-md"
        variants={fadeUp}
        custom={0}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
      >
        <img
          src={kitchenImage}
          alt="Traditional Indian kitchen with spice jars and pickles"
          className="w-full h-full object-cover aspect-[4/3]"
          loading="lazy"
        />
      </motion.div>

      <motion.div
        className="space-y-4"
        variants={fadeUp}
        custom={1}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
      >
        <span className="text-secondary font-heritage text-sm tracking-widest uppercase">
          Our Story
        </span>
        <h2 className="text-3xl md:text-4xl font-heritage font-bold leading-tight text-foreground">
          From Our Family Kitchen to Your Home
        </h2>
        <div className="space-y-3 text-muted-foreground leading-relaxed">
          <p>
            Marwad Maratha began not as a business, but as a family tradition.
            What started in our kitchens in Rajasthan and Maharashtra — preparing
            pickles and papads for loved ones — slowly became something we wanted
            to share with more homes.
          </p>
          <p>
            These are not new recipes. They are inheritances. Preserved with
            patience. Prepared with care. Made the same way our grandmothers did.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

/* ───── Section 2: Our Process ───── */
const processItems = [
  {
    icon: Sun,
    title: "Sun-Dried Ingredients",
    desc: "Traditional sun-drying for authentic flavour.",
  },
  {
    icon: Layers,
    title: "Small Batch Preparation",
    desc: "Prepared in limited quantities for freshness.",
  },
  {
    icon: Leaf,
    title: "No Artificial Preservatives",
    desc: "Pure ingredients. No shortcuts.",
  },
];

const OurProcess = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.15 });

  return (
    <div ref={ref} className="text-center">
      <motion.h2
        className="text-3xl md:text-4xl font-heritage font-bold mb-7 text-foreground"
        variants={fadeUp}
        custom={0}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
      >
        How We Preserve Tradition
      </motion.h2>

      <div className="grid sm:grid-cols-3 gap-5 max-w-3xl mx-auto">
        {processItems.map((item, i) => (
          <motion.div
            key={item.title}
            className="flex flex-col items-center gap-2 p-5 rounded-xl bg-card border border-border"
            variants={fadeUp}
            custom={i + 1}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
          >
            <item.icon className="w-7 h-7 text-secondary" strokeWidth={1.5} />
            <h3 className="font-heritage font-semibold text-lg text-foreground">
              {item.title}
            </h3>
            <p className="text-muted-foreground text-sm">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

/* ───── Section 3: Our Values ───── */
const valueItems = [
  { icon: Heart, label: "Authenticity Over Trends" },
  { icon: Award, label: "Quality Over Quantity" },
  { icon: Shield, label: "Tradition Over Shortcuts" },
];

const OurValues = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <div
      ref={ref}
      className="rounded-xl py-8 px-4"
      style={{ backgroundColor: "hsl(33 35% 82%)" }}
    >
      <motion.h2
        className="text-3xl md:text-4xl font-heritage font-bold text-center mb-6 text-foreground"
        variants={fadeUp}
        custom={0}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
      >
        What We Stand For
      </motion.h2>

      <div className="grid sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
        {valueItems.map((v, i) => (
          <motion.div
            key={v.label}
            className="flex flex-col items-center gap-2 bg-card rounded-lg border border-primary/20 p-5"
            variants={fadeUp}
            custom={i + 1}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
          >
            <v.icon className="w-6 h-6 text-secondary" strokeWidth={1.6} />
            <span className="font-heritage font-bold text-base text-foreground text-center">
              {v.label}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

/* ───── Section 4: Testimonial Snapshot ───── */
const testimonials = [
  {
    name: "Priya Sharma",
    location: "Mumbai",
    quote:
      "The mango pickle is exactly like my grandmother used to make in Rajasthan. That raw, tangy punch with the perfect balance of spices — it's hard to find this kind of authenticity anywhere else.",
  },
  {
    name: "Vikram Singh",
    location: "Jaipur",
    quote:
      "I've tried garlic pickles from many brands, but Marwad Maratha's is on another level. Bold, aromatic, and you can tell it's made with real care — not factory-produced.",
  },
];

const TestimonialSnapshot = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.15 });

  return (
    <div ref={ref} className="max-w-3xl mx-auto">
      <motion.p
        className="text-center text-muted-foreground text-sm mb-1.5 tracking-wide"
        variants={fadeUp}
        custom={0}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
      >
        Trusted by families across Rajasthan and Maharashtra.
      </motion.p>
      <motion.h2
        className="text-3xl md:text-4xl font-heritage font-bold text-center mb-6 text-foreground"
        variants={fadeUp}
        custom={0}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
      >
        Loved by Families
      </motion.h2>

      <div className="grid sm:grid-cols-2 gap-5">
        {testimonials.map((t, i) => (
          <motion.div
            key={t.name}
            className="bg-card rounded-lg p-5 shadow-sm border-l-[3px] border-l-primary"
            variants={fadeUp}
            custom={i + 1}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
          >
            <Quote className="w-5 h-5 text-secondary/50 mb-2" />
            <p className="text-foreground/80 italic leading-relaxed mb-3 text-sm">
              "{t.quote}"
            </p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-[0.65rem] font-bold text-primary-foreground">
                {t.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div>
                <p className="font-semibold text-sm text-foreground">{t.name}</p>
                <p className="text-muted-foreground text-xs">{t.location}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

/* ───── Main Section ───── */
const StorySection = () => {
  return (
    <section
      id="story"
      className="py-10 md:py-14 relative overflow-hidden bg-background"
    >
      {/* Subtle Rajasthani block-print motif */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={subtlePatternStyle}
      />

      <div className="container mx-auto px-4 space-y-10 md:space-y-12 relative z-10">
        <OriginStory />
        <OurProcess />
        <OurValues />
        <TestimonialSnapshot />
      </div>
    </section>
  );
};

export default StorySection;
