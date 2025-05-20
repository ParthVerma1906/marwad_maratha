
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { User, Mail, Phone } from "lucide-react";

const SettingsTab = () => {
  const { toast } = useToast();
  const [businessInfo, setBusinessInfo] = useState({
    name: "Marwad Maratha",
    email: "durgagurhudyoggondia@gmail.com",
    phone: "+91-8830257574",
    address: "Gokuldham Colony, Near gaurav Furniture, Fulture Peth, Gondia (441601)",
  });
  
  // Load saved business info on component mount
  useEffect(() => {
    const savedInfo = localStorage.getItem("businessInfo");
    if (savedInfo) {
      try {
        setBusinessInfo(JSON.parse(savedInfo));
      } catch (error) {
        console.error("Error loading business info", error);
      }
    }
  }, []);

  const handleBusinessUpdate = (e) => {
    e.preventDefault();
    // Save business info to localStorage
    localStorage.setItem("businessInfo", JSON.stringify(businessInfo));
    
    // Dispatch an event to notify other components
    const event = new Event("businessInfoUpdated");
    window.dispatchEvent(event);
    
    toast({
      title: "Settings updated",
      description: "Your business information has been updated successfully.",
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-heritage font-bold mb-4">Business Information</h3>
        <form onSubmit={handleBusinessUpdate} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Business Name</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <User size={18} />
                </span>
                <input
                  type="text"
                  value={businessInfo.name}
                  onChange={(e) => setBusinessInfo({...businessInfo, name: e.target.value})}
                  className="w-full pl-10 pr-3 py-2 border border-muted rounded-lg"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email Address</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <Mail size={18} />
                </span>
                <input
                  type="email"
                  value={businessInfo.email}
                  onChange={(e) => setBusinessInfo({...businessInfo, email: e.target.value})}
                  className="w-full pl-10 pr-3 py-2 border border-muted rounded-lg"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Phone Number</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <Phone size={18} />
                </span>
                <input
                  type="text"
                  value={businessInfo.phone}
                  onChange={(e) => setBusinessInfo({...businessInfo, phone: e.target.value})}
                  className="w-full pl-10 pr-3 py-2 border border-muted rounded-lg"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Business Address</label>
              <textarea
                value={businessInfo.address}
                onChange={(e) => setBusinessInfo({...businessInfo, address: e.target.value})}
                className="w-full px-3 py-2 border border-muted rounded-lg"
                rows={2}
              ></textarea>
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="px-4 py-2 bg-maroon text-white rounded-lg"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SettingsTab;
