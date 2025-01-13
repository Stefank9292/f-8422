import { Card } from "@/components/ui/card";
import { useState } from "react";
import { SearchBar } from "@/components/search/SearchBar";

export default function TikTokSearch() {
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = () => {
    // This will be implemented later when the TikTok search functionality is ready
    console.log("TikTok search for:", username);
  };

  const handleUsernameChange = (value: string) => {
    setUsername(value);
  };

  return (
    <div className="container max-w-screen-xl mx-auto p-4 pt-20 md:pt-6 space-y-4">
      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-4">TikTok Search</h1>
        <div className="max-w-xl mx-auto">
          <SearchBar
            username={username}
            onUsernameChange={handleUsernameChange}
            onSearch={handleSearch}
            isLoading={isLoading}
          />
        </div>
        <p className="text-muted-foreground mt-4 text-center">
          Coming soon! This feature is currently under development.
        </p>
      </Card>
    </div>
  );
}