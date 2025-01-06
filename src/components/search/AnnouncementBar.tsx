import { AlertCircle, X } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useState } from "react";

export const AnnouncementBar = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="flex justify-center">
      <Alert 
        variant="default" 
        className="bg-primary/5 border-primary/10 mb-4 py-2 max-w-md rounded-lg"
      >
        <AlertCircle className="h-3 w-3 text-primary" />
        <AlertDescription className="text-xs text-primary font-medium ml-2 flex-1">
          Video Search is currently in Beta – Thank You for Your patience as we continue to improve and perfect it!
        </AlertDescription>
        <button 
          onClick={() => setIsVisible(false)}
          className="text-primary/60 hover:text-primary transition-colors"
          aria-label="Close announcement"
        >
          <X className="h-3 w-3" />
          <span className="sr-only">Close</span>
        </button>
      </Alert>
    </div>
  );
};