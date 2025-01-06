import { AlertCircle, X } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useEffect, useState } from "react";

export const AnnouncementBar = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const announcementHidden = localStorage.getItem('hideAnnouncement');
    if (announcementHidden) {
      setIsVisible(false);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem('hideAnnouncement', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="flex justify-center w-full">
      <div className="max-w-lg w-full mx-auto px-4 sm:px-6">
        <Alert 
          variant="default" 
          className="bg-background/50 border border-border/40 shadow-sm rounded-lg mb-2"
        >
          <div className="flex items-center gap-2 py-1.5">
            <AlertCircle className="h-3.5 w-3.5 text-primary/70 shrink-0" />
            <AlertDescription className="text-xs sm:text-sm text-muted-foreground font-medium flex-1 leading-relaxed">
              Video Search is currently in Beta – thank You for Your patience as we continue to improve and perfect it!
            </AlertDescription>
            <button 
              onClick={handleClose}
              className="text-muted-foreground/60 hover:text-muted-foreground transition-colors rounded-md p-0.5 -mr-1 ml-2"
              aria-label="Close announcement"
            >
              <X className="h-3.5 w-3.5" />
              <span className="sr-only">Close</span>
            </button>
          </div>
        </Alert>
      </div>
    </div>
  );
};