import { Video } from "lucide-react";

export const TikTokSearchHeader = () => {
  return (
    <div className="space-y-2 text-center">
      <div className="flex items-center justify-center gap-2">
        <Video className="w-5 h-5" />
        <h1 className="text-xl font-semibold">TikTok Search</h1>
      </div>
      <p className="text-sm text-muted-foreground">
        Search and analyze TikTok profiles and their content
      </p>
    </div>
  );
};