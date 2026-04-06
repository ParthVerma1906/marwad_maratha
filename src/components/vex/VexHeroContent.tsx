import { useEffect, useState } from "react";

const AnimatedText = ({
  text,
  delayMs = 200,
  staggerMs = 30,
  durationMs = 500,
}: {
  text: string;
  delayMs?: number;
  staggerMs?: number;
  durationMs?: number;
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delayMs);
    return () => clearTimeout(timer);
  }, [delayMs]);

  const lines = text.split("\n");
  let charIndex = 0;

  return (
    <span>
      {lines.map((line, lineIdx) => (
        <span key={lineIdx} className="block">
          {line.split("").map((char) => {
            const idx = charIndex++;
            return (
              <span
                key={idx}
                className="inline-block transition-all"
                style={{
                  transform: visible ? "translateX(0)" : "translateX(-18px)",
                  opacity: visible ? 1 : 0,
                  transitionDuration: `${durationMs}ms`,
                  transitionDelay: `${idx * staggerMs}ms`,
                  transitionTimingFunction: "cubic-bezier(0.25, 0.1, 0.25, 1)",
                }}
              >
                {char === " " ? "\u00A0" : char}
              </span>
            );
          })}
        </span>
      ))}
    </span>
  );
};

const FadeIn = ({
  children,
  delayMs,
  durationMs = 1000,
  className = "",
}: {
  children: React.ReactNode;
  delayMs: number;
  durationMs?: number;
  className?: string;
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delayMs);
    return () => clearTimeout(timer);
  }, [delayMs]);

  return (
    <div
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(12px)",
        transition: `opacity ${durationMs}ms ease-out, transform ${durationMs}ms ease-out`,
      }}
    >
      {children}
    </div>
  );
};

const VexHeroContent = () => {
  return (
    <div className="min-h-[calc(100vh-80px)] flex items-end px-4 sm:px-8 lg:px-12 pb-10 sm:pb-16">
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-end">
        {/* Left column */}
        <div className="space-y-6">
          <h1
            className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-bold text-white leading-[1.08]"
            style={{ letterSpacing: "-0.04em" }}
          >
            <AnimatedText
              text={"Shaping tomorrow\nwith vision and action."}
              delayMs={200}
              staggerMs={30}
              durationMs={500}
            />
          </h1>

          <FadeIn delayMs={800} durationMs={1000}>
            <p className="text-gray-300 text-base lg:text-lg max-w-lg leading-relaxed">
              We back visionaries and craft ventures that define what comes
              next.
            </p>
          </FadeIn>

          <FadeIn delayMs={1200} durationMs={1000} className="flex flex-wrap gap-3">
            <button className="bg-white text-black text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-white/90 transition-colors duration-200">
              Start a Chat
            </button>
            <button className="liquid-glass text-white text-sm font-medium px-5 py-2.5 rounded-lg border border-white/20 hover:bg-white/10 transition-colors duration-200">
              Explore Now
            </button>
          </FadeIn>
        </div>

        {/* Right column - tag */}
        <FadeIn
          delayMs={1400}
          durationMs={1000}
          className="flex justify-start lg:justify-end items-end"
        >
          <div className="liquid-glass rounded-xl px-5 py-3 border border-white/20">
            <span className="text-white text-lg sm:text-xl xl:text-2xl font-light">
              Investing. Building. Advisory.
            </span>
          </div>
        </FadeIn>
      </div>
    </div>
  );
};

export default VexHeroContent;
