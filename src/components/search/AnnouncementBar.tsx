import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const AnnouncementBar = () => {
  return (
    <Alert variant="default" className="bg-primary/10 border-primary/20 mb-6">
      <AlertCircle className="h-4 w-4 text-primary" />
      <AlertDescription className="text-sm text-primary font-medium ml-2">
        Video Search is currently in Beta – Thank You for Your patience as we continue to improve and perfect it!
      </AlertDescription>
    </Alert>
  );
};