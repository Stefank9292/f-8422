import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export const TikTokSearchForm = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("TikTok search query:", searchQuery);
    // Future implementation will go here
  };

  return (
    <form onSubmit={handleSearch} className="w-full space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            type="text"
            placeholder="Enter TikTok username"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="material-input"
          />
        </div>
        <Button 
          type="submit"
          className="material-button-primary w-full sm:w-auto"
        >
          <Search className="h-5 w-5" />
          Search
        </Button>
      </div>
    </form>
  );
};