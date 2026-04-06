const VexNavbar = () => {
  const links = ["Story", "Investing", "Building", "Advisory"];

  return (
    <div className="w-full px-3 sm:px-5 pt-3 sm:pt-5">
      <nav className="liquid-glass rounded-xl px-4 sm:px-6 py-3 flex items-center justify-between border border-white/20">
        {/* Logo */}
        <a
          href="#"
          className="text-white text-2xl font-semibold tracking-tight"
        >
          VEX
        </a>

        {/* Center links - hidden on mobile */}
        <div className="hidden md:flex items-center gap-6">
          {links.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              className="text-white/80 hover:text-white text-sm font-medium transition-colors duration-200"
            >
              {link}
            </a>
          ))}
        </div>

        {/* CTA */}
        <button className="bg-white text-black text-sm font-medium px-4 py-2 rounded-lg hover:bg-white/90 transition-colors duration-200">
          Start a Chat
        </button>
      </nav>
    </div>
  );
};

export default VexNavbar;
