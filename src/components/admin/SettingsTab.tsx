
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

const SettingsTab = () => {
  const { toast } = useToast();
  const [businessInfo, setBusinessInfo] = useState({
    name: "Marwad Maratha",
    phone: "+91 8830257574",
    email: "durgagurhudyoggondia@gmail.com",
    address: "Gokuldham Colony, Near Gaurav Furniture, Fulture Peth, Gondia (441601)",
    about: "Traditional Indian pickles and papads, handcrafted with love and family recipes since 2017."
  });
  
  const [formState, setFormState] = useState({...businessInfo});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, this would make an API call
    setBusinessInfo({...formState});
    
    toast({
      title: "Settings updated",
      description: "Your business information has been updated successfully.",
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-heritage font-bold mb-4">Business Settings</h3>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-1">Business Name</label>
            <input 
              type="text"
              value={formState.name}
              onChange={(e) => setFormState({...formState, name: e.target.value})}
              className="w-full px-3 py-2 border border-muted rounded-lg"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Phone Number</label>
              <input 
                type="text"
                value={formState.phone}
                onChange={(e) => setFormState({...formState, phone: e.target.value})}
                className="w-full px-3 py-2 border border-muted rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email Address</label>
              <input 
                type="email"
                value={formState.email}
                onChange={(e) => setFormState({...formState, email: e.target.value})}
                className="w-full px-3 py-2 border border-muted rounded-lg"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Business Address</label>
            <textarea 
              value={formState.address}
              onChange={(e) => setFormState({...formState, address: e.target.value})}
              className="w-full px-3 py-2 border border-muted rounded-lg"
              rows={2}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">About Business</label>
            <textarea 
              value={formState.about}
              onChange={(e) => setFormState({...formState, about: e.target.value})}
              className="w-full px-3 py-2 border border-muted rounded-lg"
              rows={3}
            />
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
      
      <div>
        <h3 className="text-xl font-heritage font-bold mb-4">Change Admin Password</h3>
        
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Current Password</label>
            <input 
              type="password"
              className="w-full px-3 py-2 border border-muted rounded-lg"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">New Password</label>
            <input 
              type="password"
              className="w-full px-3 py-2 border border-muted rounded-lg"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Confirm New Password</label>
            <input 
              type="password"
              className="w-full px-3 py-2 border border-muted rounded-lg"
            />
          </div>
          
          <div>
            <button
              type="submit"
              className="px-4 py-2 bg-maroon text-white rounded-lg"
              onClick={(e) => {
                e.preventDefault();
                toast({
                  title: "Password updated",
                  description: "Your admin password has been updated successfully.",
                });
              }}
            >
              Update Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SettingsTab;
