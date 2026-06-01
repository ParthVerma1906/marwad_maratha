import { useState } from "react";
import { motion } from "framer-motion";
import { LogOut, Package, Settings, Menu, X, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import ProductsTab from "./ProductsTab";
import OrdersTab from "./OrdersTab";
import SettingsTab from "./SettingsTab";

interface AdminPanelProps {
  onSignOut: () => void;
  userEmail?: string;
  initialTab?: string;
}

const AdminPanel = ({ onSignOut, userEmail, initialTab = "products" }: AdminPanelProps) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    toast({ title: "Logging out..." });
    await onSignOut();
  };

  const tabs = [
    { id: "products", label: "Products", icon: Package },
    { id: "orders", label: "Orders", icon: ShoppingCart },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="bg-maroon text-white px-3 sm:px-5 py-3 flex justify-between items-center sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden p-1.5 rounded hover:bg-white/20 min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <Menu size={20} />
          </button>
          <h2 className="text-base sm:text-xl font-heritage font-bold">Admin Dashboard</h2>
        </div>
        <div className="flex items-center gap-2">
          {userEmail && (
            <span className="hidden sm:inline text-xs text-white/70 truncate max-w-[200px]">
              {userEmail}
            </span>
          )}
          <button
            onClick={handleLogout}
            className="px-3 sm:px-4 py-2 bg-white text-maroon hover:bg-white/90 rounded-md text-xs sm:text-sm font-semibold flex items-center gap-1.5 min-h-[40px] shadow-sm"
          >
            <LogOut size={14} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      <div className="flex flex-1 relative">
        {sidebarOpen && (
          <div
            className="md:hidden fixed inset-0 bg-black/40 z-30"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <motion.aside
          className={`bg-muted/40 border-r border-border w-56 p-3 flex flex-col flex-shrink-0 z-40
            fixed md:static inset-y-0 left-0 top-[56px] md:top-0
            transform transition-transform duration-200 ease-in-out
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
        >
          <div className="flex justify-between items-center mb-3 md:hidden">
            <span className="font-bold text-sm">Navigation</span>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1 min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
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
              className={`p-3 rounded-lg mb-1 flex items-center gap-2 min-h-[48px] text-sm text-left ${
                activeTab === tab.id
                  ? "bg-maroon/10 text-maroon font-medium"
                  : "hover:bg-muted text-foreground"
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </motion.aside>

        <main className="flex-1 p-3 sm:p-5 md:p-6 overflow-auto">
          {activeTab === "products" && <ProductsTab />}
          {activeTab === "orders" && <OrdersTab />}
          {activeTab === "settings" && <SettingsTab />}
        </main>
      </div>
    </div>
  );
};

export default AdminPanel;
