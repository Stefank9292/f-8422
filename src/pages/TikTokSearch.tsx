import { Card } from "@/components/ui/card";
import { TikTokSearchForm } from "@/components/tiktok/TikTokSearchForm";

export default function TikTokSearch() {
  return (
    <div className="container max-w-screen-xl mx-auto p-4 pt-20 md:pt-6 space-y-4">
      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-6">TikTok Search</h1>
        <TikTokSearchForm />
      </Card>
    </div>
  );
}