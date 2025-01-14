import { Button } from "@/components/ui/button";
import { Settings2 } from "lucide-react";

export const TikTokSearchSettings = () => {
  return (
    <Button
      variant="outline"
      size="sm"
      className="w-full h-9 text-xs font-medium"
    >
      <Settings2 className="mr-2 h-3.5 w-3.5" />
      Search Settings
    </Button>
  );
};