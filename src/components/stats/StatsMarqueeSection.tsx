import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const stats = [
  { number: "25+", label: "VARIETIES OF AACHAR" },
  { number: "500+", label: "FAMILIES SERVED" },
  { number: "0", label: "ARTIFICIAL PRESERVATIVES" },
  { number: "100%", label: "HOMEMADE ALWAYS" },
];

const marqueeItems = [
  "ATHANA MIRCH AACHAR",
  "NIMBU MITHA CHATANI",
  "DESI MIRCH AACHAR",
  "AAM KA AACHAR",
  "LASSAN AACHAR",
  "URAD DAL PAPAD",
  "AMLA AACHAR",
  "GUNDA AACHAR",
  "NO PRESERVATIVES",
  "SHIPS PAN-INDIA",
  "HANDMADE IN SMALL BATCHES",
  "FSSAI CERTIFIED",
];

const MarqueeContent = () => (
  <>
    {marqueeItems.map((item, i) => (
      <span key={i} className="whitespace-nowrap">
        {item}
        <span className="mx-3" style={{ color: "rgba(250,240,230,0.4)" }}>·</span>
      </span>
    ))}
  </>
);

const StatsMarqueeSection = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section className="w-full">
      {/* Stats Grid */}
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="grid grid-cols-2"
        style={{ backgroundColor: "#1C0A04" }}
      >
        {stats.map((stat, i) => (
          <div
            key={i}
            className="flex flex-col items-center justify-center text-center
                       py-6 px-10 max-[480px]:py-4 max-[480px]:px-5"
            style={{ border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <span
              className="font-heritage max-[480px]:text-[1.6rem]"
              style={{
                fontSize: "2.2rem",
                fontWeight: 600,
                color: "#C8860A",
                lineHeight: 1.2,
              }}
            >
              {stat.number}
            </span>
            <span
              className="mt-1"
              style={{
                fontSize: "0.72rem",
                fontWeight: 400,
                textTransform: "uppercase",
                letterSpacing: "0.07em",
                color: "rgba(255,255,255,0.45)",
              }}
            >
              {stat.label}
            </span>
          </div>
        ))}
      </motion.div>

      {/* Marquee Strip */}
      <div
        className="w-full overflow-hidden whitespace-nowrap"
        style={{ backgroundColor: "#8B1A1A", padding: "0.7rem 0" }}
      >
        <div
          className="inline-flex animate-marquee"
          style={{
            fontSize: "0.72rem",
            fontWeight: 500,
            color: "#FAF0E6",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
          }}
        >
          <MarqueeContent />
          <MarqueeContent />
        </div>
      </div>
    </section>
  );
};

export default StatsMarqueeSection;
