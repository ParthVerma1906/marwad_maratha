import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Sun, Layers, Leaf, Quote, Heart, Award, Shield } from "lucide-react";
import kitchenImage from "@/assets/kitchen-origin.jpg";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1 },
  }),
};

/* ───── Section 1: Origin Story ───── */
const OriginStory = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.15 });

  return (
    <div ref={ref} className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
      <motion.div
        className="rounded-2xl overflow-hidden shadow-lg"
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
        <span className="text-maroon font-heritage text-base tracking-wide">
          Our Story
        </span>
        <h2 className="text-3xl md:text-4xl font-heritage font-bold leading-tight">
          From Our Family Kitchen to Your Home
        </h2>
        <div className="space-y-3 text-foreground/80 leading-relaxed text-[0.95rem]">
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
        className="text-3xl md:text-4xl font-heritage font-bold mb-8"
        variants={fadeUp}
        custom={0}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
      >
        How We Preserve Tradition
      </motion.h2>

      <div className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
        {processItems.map((item, i) => (
          <motion.div
            key={item.title}
            className="flex flex-col items-center gap-2.5 p-5 rounded-2xl bg-card/60"
            variants={fadeUp}
            custom={i + 1}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
          >
            <item.icon className="w-7 h-7 text-maroon" strokeWidth={1.4} />
            <h3 className="font-heritage font-semibold text-lg">{item.title}</h3>
            <p className="text-muted-foreground text-sm">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

/* ───── Section 3: Our Values (Horizontal Badges) ───── */
const valueItems = [
  { icon: Heart, label: "Authenticity Over Trends" },
  { icon: Award, label: "Quality Over Quantity" },
  { icon: Shield, label: "Tradition Over Shortcuts" },
];

const OurValues = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <div ref={ref} className="rounded-2xl bg-accent/30 py-8 px-4">
      <motion.h2
        className="text-3xl md:text-4xl font-heritage font-bold text-center mb-6"
        variants={fadeUp}
        custom={0}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
      >
        What We Stand For
      </motion.h2>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-3xl mx-auto">
        {valueItems.map((v, i) => (
          <motion.div
            key={v.label}
            className="flex items-center gap-3 bg-card/80 rounded-full px-5 py-3 shadow-sm"
            variants={fadeUp}
            custom={i + 1}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
          >
            <v.icon className="w-5 h-5 text-saffron" strokeWidth={1.6} />
            <span className="font-heritage font-semibold text-sm md:text-base text-foreground/90">
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
        className="text-center text-muted-foreground text-sm mb-2 tracking-wide"
        variants={fadeUp}
        custom={0}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
      >
        Trusted by families across Rajasthan and Maharashtra.
      </motion.p>
      <motion.h2
        className="text-3xl md:text-4xl font-heritage font-bold text-center mb-6"
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
            className="bg-accent/20 rounded-2xl p-5 shadow-[0_2px_12px_-4px_hsl(var(--foreground)/0.06)] relative"
            variants={fadeUp}
            custom={i + 1}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
          >
            <Quote className="w-5 h-5 text-saffron/40 mb-2" />
            <p className="text-foreground/80 italic leading-relaxed mb-3 text-sm">
              "{t.quote}"
            </p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-saffron/70 to-maroon/70 flex items-center justify-center text-[0.65rem] font-bold text-white">
                {t.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <div>
                <p className="font-semibold text-sm">{t.name}</p>
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
      className="py-12 md:py-16 relative overflow-hidden bg-background"
    >
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
        }}
      />

      <div className="container mx-auto px-4 space-y-12 md:space-y-14 relative z-10">
        <OriginStory />
        <OurProcess />
        <OurValues />
        <TestimonialSnapshot />
      </div>
    </section>
  );
};

export default StorySection;
