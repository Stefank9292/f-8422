import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export const TikTokSearchForm = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("TikTok search query:", searchQuery);
  };

  return (
    <form onSubmit={handleSearch} className="w-full space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Input
            type="text"
            placeholder="Enter TikTok username"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="material-input-with-icon"
          />
          <Search className="material-input-icon" />
        </div>
        <Button 
          type="submit"
          className="material-button-primary w-full sm:w-auto"
        >
          <Search className="mr-2 h-4 w-4" />
          <span>Search</span>
        </Button>
      </div>
    </form>
  );
};