import { useRef, useEffect, useState } from "react";

interface MarqueeDividerProps {
  items: string[];
  bgColor?: string;
  textColor?: string;
  dotColor?: string;
  speed?: number; // seconds for full loop
  reverse?: boolean;
}

const MarqueeDivider = ({
  items,
  bgColor = "#8B1A1A",
  textColor = "#FAF0E6",
  dotColor = "rgba(250,240,230,0.4)",
  speed = 24,
  reverse = false,
}: MarqueeDividerProps) => {
  const Content = () => (
    <>
      {items.map((item, i) => (
        <span key={i} className="whitespace-nowrap">
          {item}
          <span className="mx-3" style={{ color: dotColor }}>·</span>
        </span>
      ))}
    </>
  );

  return (
    <div
      className="w-full overflow-hidden whitespace-nowrap"
      style={{ backgroundColor: bgColor, padding: "0.6rem 0" }}
    >
      <div
        className={`inline-flex ${reverse ? "animate-marquee-reverse" : "animate-marquee"}`}
        style={{
          fontSize: "0.7rem",
          fontWeight: 500,
          color: textColor,
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          animationDuration: `${speed}s`,
        }}
      >
        <Content />
        <Content />
      </div>
    </div>
  );
};

export default MarqueeDivider;
