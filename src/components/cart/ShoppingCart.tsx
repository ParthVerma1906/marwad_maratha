
import { motion } from "framer-motion";
import { Trash2, ShoppingBag, Plus, Minus } from "lucide-react";
import { useCart } from "@/hooks/useCart";

interface ShoppingCartProps {
  onClose: () => void;
}

const ShoppingCart = ({ onClose }: ShoppingCartProps) => {
  const { cartItems, removeFromCart, updateQuantity, clearCart, cartTotal, cartItemsCount } = useCart();

  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
    onClose();
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
        <div className="bg-maroon text-white p-4 flex items-center justify-between">
          <h2 className="text-xl font-heritage font-bold flex items-center gap-2">
            <ShoppingBag size={20} />
            Your Cart
          </h2>
          <button 
            onClick={onClose}
            className="rounded-full hover:bg-white/20 p-1"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20" 
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag size={48} className="text-gray-300 mb-3" />
              <p className="text-gray-600">Your cart is empty</p>
              <p className="text-sm text-gray-400 mt-1">Browse our products and add items to your cart</p>
              <button 
                onClick={onClose}
                className="mt-4 bg-maroon text-white px-4 py-2 rounded-full text-sm"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map(item => (
                <div key={item.id} className="flex items-center border-b border-gray-100 pb-3">
                  <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover"
                      onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                        const target = e.currentTarget;
                        target.onerror = null;
                        target.src = '/placeholder.svg';
                      }} 
                    />
                  </div>
                  <div className="ml-3 flex-1">
                    <div className="flex justify-between">
                      <h3 className="font-medium text-gray-800">{item.name}</h3>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <p className="text-sm text-gray-500 capitalize">{item.category}</p>
                    <div className="flex justify-between items-center mt-1">
                      <div className="flex items-center border rounded-full overflow-hidden">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-2 py-1 hover:bg-gray-100"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="px-2 min-w-8 text-center">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-1 hover:bg-gray-100"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <p className="font-medium">₹{item.price * item.quantity}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {cartItems.length > 0 && (
          <div className="border-t border-gray-100 p-4 bg-gray-50">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Subtotal ({cartItemsCount} items)</span>
              <span className="font-medium">₹{cartTotal}</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={clearCart}
                className="px-4 py-2 border border-gray-300 rounded-full text-gray-600 hover:bg-gray-100 flex items-center justify-center gap-1"
              >
                <Trash2 size={16} />
                Clear Cart
              </button>
              <button 
                onClick={scrollToContact}
                className="px-4 py-2 bg-maroon text-white rounded-full hover:bg-maroon/90 flex items-center justify-center gap-1"
              >
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
