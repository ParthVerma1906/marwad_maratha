import { useState } from "react";
import { motion } from "framer-motion";
import { LogOut, X, Package, Settings, Menu } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import ProductsTab from "./ProductsTab";
import SettingsTab from "./SettingsTab";

interface AdminPanelProps {
  onClose: () => void;
}

const AdminPanel = ({ onClose }: AdminPanelProps) => {
  const [activeTab, setActiveTab] = useState("products");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { toast } = useToast();

  const handleLogout = () => {
    toast({ title: "Logged out", description: "You have been logged out successfully." });
    onClose();
  };

  const tabs = [
    { id: "products", label: "Products", icon: Package },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-2 sm:p-4">
      <motion.div 
        className="bg-white rounded-xl overflow-hidden w-full max-w-6xl h-[95vh] sm:h-[85vh] shadow-2xl flex flex-col"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <div className="bg-maroon text-white p-3 sm:p-4 flex justify-between items-center flex-shrink-0">
          <div className="flex items-center gap-2">
            {/* Mobile sidebar toggle */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-1.5 rounded hover:bg-white/20 min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              <Menu size={20} />
            </button>
            <h2 className="text-base sm:text-xl font-heritage font-bold">Admin Dashboard</h2>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <button 
              onClick={handleLogout}
              className="px-2 sm:px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-md text-xs sm:text-sm flex items-center gap-1 min-h-[40px]"
            >
              <LogOut size={14} />
              <span className="hidden sm:inline">Logout</span>
            </button>
            <button 
              onClick={onClose}
              className="w-9 h-9 sm:w-8 sm:h-8 flex items-center justify-center rounded-full hover:bg-white/20 min-h-[44px] min-w-[44px]"
            >
              <X size={18} />
            </button>
          </div>
        </div>
        
        <div className="flex h-full overflow-hidden relative">
          {/* Sidebar - collapsible on mobile */}
          {/* Overlay for mobile */}
          {sidebarOpen && (
            <div 
              className="md:hidden fixed inset-0 bg-black/40 z-40"
              onClick={() => setSidebarOpen(false)}
            />
          )}
          
          <div className={`
            bg-muted w-56 p-3 flex flex-col flex-shrink-0 z-50
            fixed md:relative inset-y-0 left-0 
            transform transition-transform duration-200 ease-in-out
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            md:w-48
          `}>
            <div className="flex justify-between items-center mb-3 md:hidden">
              <span className="font-bold text-sm">Navigation</span>
              <button onClick={() => setSidebarOpen(false)} className="p-1 min-h-[44px] min-w-[44px] flex items-center justify-center">
                <X size={18} />
              </button>
            </div>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setSidebarOpen(false);
                }}
                className={`p-3 rounded-lg mb-2 flex items-center gap-2 min-h-[48px] text-sm ${
                  activeTab === tab.id 
                    ? "bg-maroon/10 text-maroon font-medium" 
                    : "hover:bg-gray-100"
                }`}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </div>
          
          {/* Main content */}
          <div className="flex-1 p-3 sm:p-4 md:p-6 overflow-auto">
            {activeTab === "products" && <ProductsTab />}
            {activeTab === "settings" && <SettingsTab />}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminPanel;
