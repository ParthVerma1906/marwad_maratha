
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { CalendarCheck, User, Mail, Phone, Video } from "lucide-react";

const SettingsTab = () => {
  const { toast } = useToast();
  const [businessInfo, setBusinessInfo] = useState({
    name: "Marwad Maratha",
    email: "durgagurhudyoggondia@gmail.com",
    phone: "+91-8830257574",
    address: "Gokuldham Colony, Near gaurav Furniture, Fulture Peth, Gondia (441601)",
  });

  const [calendarInfo, setCalendarInfo] = useState({
    date: "",
    time: "",
    description: "",
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

  const handleScheduleCall = (e) => {
    e.preventDefault();
    
    if (!calendarInfo.date || !calendarInfo.time) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please select both date and time for your call.",
      });
      return;
    }
    
    // Save the scheduled call information
    const scheduledCalls = JSON.parse(localStorage.getItem("scheduledCalls") || "[]");
    scheduledCalls.push({
      ...calendarInfo,
      id: Date.now(), // Use timestamp as ID
      status: "pending"
    });
    localStorage.setItem("scheduledCalls", JSON.stringify(scheduledCalls));
    
    toast({
      title: "Video call scheduled",
      description: `Your call has been scheduled for ${calendarInfo.date} at ${calendarInfo.time}.`,
    });
    
    // Clear form
    setCalendarInfo({
      date: "",
      time: "",
      description: "",
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

      <div>
        <h3 className="text-xl font-heritage font-bold mb-4">Schedule Video Call</h3>
        <form onSubmit={handleScheduleCall} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Date</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <CalendarCheck size={18} />
                </span>
                <input
                  type="date"
                  value={calendarInfo.date}
                  onChange={(e) => setCalendarInfo({...calendarInfo, date: e.target.value})}
                  className="w-full pl-10 pr-3 py-2 border border-muted rounded-lg"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Time</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <CalendarCheck size={18} />
                </span>
                <input
                  type="time"
                  value={calendarInfo.time}
                  onChange={(e) => setCalendarInfo({...calendarInfo, time: e.target.value})}
                  className="w-full pl-10 pr-3 py-2 border border-muted rounded-lg"
                />
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                value={calendarInfo.description}
                onChange={(e) => setCalendarInfo({...calendarInfo, description: e.target.value})}
                className="w-full px-3 py-2 border border-muted rounded-lg"
                rows={3}
                placeholder="What would you like to discuss in the call?"
              ></textarea>
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="px-4 py-2 bg-maroon text-white rounded-lg flex items-center gap-2"
            >
              <Video size={16} />
              Schedule Call
            </button>
          </div>
        </form>
      </div>
      
      <div>
        <h3 className="text-xl font-heritage font-bold mb-4">Scheduled Calls</h3>
        <div className="bg-muted/30 p-4 rounded-lg">
          {JSON.parse(localStorage.getItem("scheduledCalls") || "[]").length > 0 ? (
            <ul className="divide-y divide-muted">
              {JSON.parse(localStorage.getItem("scheduledCalls") || "[]").map(call => (
                <li key={call.id} className="py-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{call.date} at {call.time}</p>
                      <p className="text-sm text-muted-foreground">{call.description}</p>
                    </div>
                    <span className="px-3 py-1 text-xs rounded-full bg-amber-100 text-amber-800">
                      {call.status}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground text-center py-4">No calls scheduled yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsTab;
