import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const AnnouncementBar = () => {
  return (
    <Alert variant="default" className="bg-primary/5 border-primary/10 py-1.5">
      <AlertCircle className="h-3.5 w-3.5 text-primary/70" />
      <AlertDescription className="text-xs text-primary/70 ml-2">
        Video Search is currently in Beta – Thank You for Your patience as we continue to improve and perfect it!
      </AlertDescription>
    </Alert>
  );
};