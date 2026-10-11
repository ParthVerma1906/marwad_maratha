import { Home, Package, ShoppingCart as CartIcon, MessageCircle } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from "@/hooks/useCart";
import { useState } from "react";
import ShoppingCart from "../cart/ShoppingCart";

const WHATSAPP_URL =
  "https://wa.me/918830257574?text=Namaste!%20Marwad%20Maratha%20se%20order%20karna%20hai.";

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItemsCount } = useCart();
  const [showCart, setShowCart] = useState(false);

  const goToSection = (id: string) => {
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Keep form-heavy and private pages clear of the sticky bar
  const hidden = /^\/(checkout|admin|order-|\.lovable)/.test(location.pathname);

  const items = [
    { label: "Home", icon: Home, onClick: () => goToSection("home") },
    { label: "Products", icon: Package, onClick: () => goToSection("products") },
    {
      label: "Cart",
      icon: CartIcon,
      onClick: () => setShowCart(true),
      badge: cartItemsCount,
    },
    {
      label: "WhatsApp",
      icon: MessageCircle,
      onClick: () => window.open(WHATSAPP_URL, "_blank", "noopener,noreferrer"),
    },
  ];

  if (hidden) return null;

  return (
    <>
      <nav
        aria-label="Quick navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border"
        style={{
          zIndex: 9998,
          paddingBottom: "env(safe-area-inset-bottom)",
          boxShadow: "0 -2px 12px hsl(var(--foreground) / 0.08)",
        }}
      >
        <ul className="flex items-stretch justify-around">
          {items.map(({ label, icon: Icon, onClick, badge }) => (
            <li key={label} className="flex-1">
              <button
                onClick={onClick}
                aria-label={label}
                className="relative w-full flex flex-col items-center justify-center gap-1 py-2 min-h-[56px] text-primary active:bg-secondary transition-colors"
              >
                <Icon size={22} strokeWidth={2} aria-hidden="true" />
                <span className="text-xs font-medium">{label}</span>
                {badge != null && badge > 0 && (
                  <span className="absolute top-1 right-[28%] bg-primary text-primary-foreground text-xs rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center font-bold">
                    {badge}
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      {showCart && <ShoppingCart onClose={() => setShowCart(false)} />}
    </>
  );
};

export default BottomNav;
