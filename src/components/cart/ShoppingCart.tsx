
import { motion } from "framer-motion";
import { Trash2, ShoppingBag, Plus, Minus } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useNavigate } from "react-router-dom";

interface ShoppingCartProps {
  onClose: () => void;
}

const ShoppingCart = ({ onClose }: ShoppingCartProps) => {
  const { cartItems, removeFromCart, updateQuantity, clearCart, cartTotal, cartItemsCount } = useCart();
  const navigate = useNavigate();

  const goToCheckout = () => {
    onClose();
    navigate("/checkout");
  };

  return (
    <motion.div 
      className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-end"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div 
        className="bg-white w-full sm:w-96 sm:max-w-md h-[80vh] sm:h-auto sm:max-h-[90vh] rounded-t-xl sm:rounded-xl shadow-xl overflow-hidden flex flex-col"
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        onClick={e => e.stopPropagation()}
      >
        <div className="p-4 flex items-center justify-between" style={{ background: "#850E35" }}>
          <h2 className="text-xl font-heritage font-bold flex items-center gap-2 text-white">
            <ShoppingBag size={20} />
            Your Cart
          </h2>
          <button onClick={onClose} className="rounded-full hover:bg-white/20 p-1 text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag size={48} className="text-muted-foreground/30 mb-3" />
              <p className="text-foreground">Your cart is empty</p>
              <p className="text-sm text-muted-foreground mt-1">Browse our products and add items to your cart</p>
              <button onClick={onClose}
                className="mt-4 text-white px-4 py-2 rounded-full text-sm"
                style={{ background: "#850E35" }}>
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map(item => (
                <div key={item.id} className="flex items-center border-b border-muted/50 pb-3">
                  <div className="w-14 h-14 bg-muted rounded-xl overflow-hidden flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover"
                      onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                        e.currentTarget.onerror = null; e.currentTarget.src = '/placeholder.svg';
                      }} />
                  </div>
                  <div className="ml-3 flex-1">
                    <div className="flex justify-between">
                      <h3 className="font-medium text-sm">{item.name}</h3>
                      <button onClick={() => removeFromCart(item.id)} className="text-muted-foreground hover:text-destructive">
                        <Trash2 size={15} />
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground capitalize">{item.category}</p>
                    <div className="flex justify-between items-center mt-1">
                      <div className="flex items-center border rounded-full overflow-hidden">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-2 py-1 hover:bg-muted"><Minus size={13} /></button>
                        <span className="px-2 min-w-7 text-center text-sm">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-2 py-1 hover:bg-muted"><Plus size={13} /></button>
                      </div>
                      <p className="font-medium text-sm">₹{item.price * item.quantity}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {cartItems.length > 0 && (
          <div className="border-t border-muted/50 p-4" style={{ background: "#FBF6EF" }}>
            <div className="flex justify-between mb-3">
              <span className="text-muted-foreground text-sm">Subtotal ({cartItemsCount} items)</span>
              <span className="font-semibold">₹{cartTotal}</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={clearCart}
                className="px-4 py-2.5 border border-muted rounded-xl text-muted-foreground hover:bg-muted flex items-center justify-center gap-1 text-sm">
                <Trash2 size={15} /> Clear
              </button>
              <button onClick={goToCheckout}
                className="px-4 py-2.5 text-white rounded-xl hover:opacity-90 flex items-center justify-center gap-1 text-sm font-medium"
                style={{ background: "#850E35" }}>
                Checkout
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default ShoppingCart;
