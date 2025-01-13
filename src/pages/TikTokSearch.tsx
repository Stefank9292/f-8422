import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/search/SearchBar";
import { Search } from "lucide-react";

export default function TikTokSearch() {
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = () => {
    // Search functionality will be implemented later
    console.log("TikTok search for:", username);
  };

  return (
    <div className="container max-w-screen-xl mx-auto p-4 pt-20 md:pt-6 space-y-4">
      <Card className="p-6">
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <SearchBar
                username={username}
                onUsernameChange={setUsername}
                onSearch={handleSearch}
                isLoading={isLoading}
              />
            </div>
            <Button
              onClick={handleSearch}
              disabled={!username.trim() || isLoading}
              className="w-full md:w-auto"
            >
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}