import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function SearchHistoryLocked() {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center space-y-4">
      <Lock className="w-12 h-12 text-muted-foreground" />
      <h3 className="text-lg font-semibold">Search History Locked</h3>
      <p className="text-sm text-muted-foreground max-w-md">
        Upgrade to Creator Pro or Creator on Steroids to access your search history and more features.
      </p>
      <Button 
        onClick={() => navigate('/subscribe')}
        className="bg-[#1a365d] hover:bg-[#1a365d]/90 text-white"
      >
        Upgrade Now
      </Button>
    </div>
  );
}