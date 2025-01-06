import { AlertCircle, X } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useState } from "react";

export const AnnouncementBar = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="flex justify-center w-full bg-primary/5">
      <Alert 
        variant="default" 
        className="border-none shadow-none max-w-3xl w-full py-3 px-4 flex items-center gap-3"
      >
        <AlertCircle className="h-4 w-4 text-primary shrink-0" />
        <AlertDescription className="text-sm text-primary font-medium flex-1">
          Video Search is currently in Beta – Thank You for Your patience as we continue to improve and perfect it!
        </AlertDescription>
        <button 
          onClick={() => setIsVisible(false)}
          className="text-primary/60 hover:text-primary transition-colors p-1 -mr-1"
          aria-label="Close announcement"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
      </Alert>
    </div>
  );
};