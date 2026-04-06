import VexNavbar from "@/components/vex/VexNavbar";
import VexHeroContent from "@/components/vex/VexHeroContent";

const VexHero = () => {
  return (
    <div
      className="relative min-h-screen w-full overflow-hidden bg-black text-white"
      style={{
        fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
        WebkitFontSmoothing: "antialiased",
        MozOsxFontSmoothing: "grayscale",
      }}
    >
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        style={{ zIndex: 0 }}
      >
        <source
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260403_050628_c4e32401-fab4-4a27-b7a8-6e9291cd5959.mp4"
          type="video/mp4"
        />
      </video>

      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/40" style={{ zIndex: 1 }} />

      {/* Content */}
      <div className="relative" style={{ zIndex: 2 }}>
        <VexNavbar />
        <VexHeroContent />
      </div>
    </div>
  );
};

export default VexHero;
