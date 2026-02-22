import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Sun, Layers, Leaf, Quote } from "lucide-react";
import kitchenImage from "@/assets/kitchen-origin.jpg";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.12 },
  }),
};

/* ───── Section 1: Origin Story ───── */
const OriginStory = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.15 });

  return (
    <div ref={ref} className="grid md:grid-cols-2 gap-10 md:gap-14 items-center">
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
        className="space-y-5"
        variants={fadeUp}
        custom={1}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
      >
        <span className="text-maroon font-heritage text-base tracking-wide">
          Our Story
        </span>
        <h2 className="text-3xl md:text-4xl font-heritage font-bold leading-tight">
          From Our Kitchen to Your Home
        </h2>
        <div className="space-y-4 text-foreground/80 leading-relaxed">
          <p>
            Marwad Maratha began as a family tradition rooted in the kitchens of
            Rajasthan and Maharashtra. What started as homemade pickles and
            papads for loved ones slowly became something more.
          </p>
          <p>
            Our recipes are not inventions — they are inheritances. Passed down
            through generations, preserved with patience, and prepared with care.
          </p>
          <p>
            Today, we continue the same small-batch process, ensuring every jar
            carries the taste of home.
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
    desc: "Carefully dried using traditional methods for authentic flavour.",
  },
  {
    icon: Layers,
    title: "Small Batch Preparation",
    desc: "Made in limited quantities to maintain consistency and quality.",
  },
  {
    icon: Leaf,
    title: "No Artificial Preservatives",
    desc: "Only pure ingredients. No chemicals. No shortcuts.",
  },
];

const OurProcess = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.15 });

  return (
    <div ref={ref} className="text-center">
      <motion.h2
        className="text-3xl md:text-4xl font-heritage font-bold mb-10"
        variants={fadeUp}
        custom={0}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
      >
        How We Preserve Tradition
      </motion.h2>

      <div className="grid sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
        {processItems.map((item, i) => (
          <motion.div
            key={item.title}
            className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-card/60"
            variants={fadeUp}
            custom={i + 1}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
          >
            <item.icon className="w-8 h-8 text-maroon" strokeWidth={1.4} />
            <h3 className="font-heritage font-semibold text-lg">{item.title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {item.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

/* ───── Section 3: Our Values ───── */
const values = [
  "Authenticity Over Trends",
  "Quality Over Quantity",
  "Tradition Over Shortcuts",
];

const OurValues = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <div ref={ref} className="text-center max-w-2xl mx-auto">
      <motion.h2
        className="text-3xl md:text-4xl font-heritage font-bold mb-8"
        variants={fadeUp}
        custom={0}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
      >
        What We Stand For
      </motion.h2>

      <div className="space-y-4">
        {values.map((v, i) => (
          <motion.p
            key={v}
            className="text-xl md:text-2xl font-heritage text-foreground/85"
            variants={fadeUp}
            custom={i + 1}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
          >
            {v}
          </motion.p>
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
      "The mango pickle reminds me of my childhood in Rajasthan. The authentic taste brings back memories of my grandmother's kitchen.",
  },
  {
    name: "Vikram Singh",
    location: "Jaipur",
    quote:
      "As someone from Rajasthan, I'm very particular about my pickles. Marwad Maratha's garlic pickle is exceptional — perfectly spiced and preserved.",
  },
];

const TestimonialSnapshot = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.15 });

  return (
    <div ref={ref} className="max-w-3xl mx-auto">
      <motion.h2
        className="text-3xl md:text-4xl font-heritage font-bold text-center mb-8"
        variants={fadeUp}
        custom={0}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
      >
        Loved by Families
      </motion.h2>

      <div className="grid sm:grid-cols-2 gap-6">
        {testimonials.map((t, i) => (
          <motion.div
            key={t.name}
            className="bg-card rounded-2xl p-6 shadow-sm relative"
            variants={fadeUp}
            custom={i + 1}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
          >
            <Quote className="w-6 h-6 text-saffron/40 mb-3" />
            <p className="text-foreground/80 italic leading-relaxed mb-4 text-sm">
              "{t.quote}"
            </p>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-saffron/70 to-maroon/70 flex items-center justify-center text-xs font-bold text-white">
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
      className="py-14 md:py-20 relative overflow-hidden bg-background"
    >
      {/* Subtle paper texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
        }}
      />

      <div className="container mx-auto px-4 space-y-16 md:space-y-20 relative z-10">
        <OriginStory />
        <OurProcess />
        <OurValues />
        <TestimonialSnapshot />
      </div>
    </section>
  );
};

export default StorySection;
