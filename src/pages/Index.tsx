import { Instagram, Search, List, Settings } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TikTokIcon } from "@/components/icons/TikTokIcon";
import { useState } from "react";
import { fetchInstagramPosts } from "@/utils/apifyClient";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!username) {
      toast({
        title: "Error",
        description: "Please enter an Instagram username",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const posts = await fetchInstagramPosts(username);
      toast({
        title: "Success",
        description: `Found ${posts.length} posts for @${username}`,
      });
      console.log('Instagram posts:', posts);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch Instagram posts",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto flex flex-col items-center justify-center min-h-screen p-4 space-y-8">
      {/* Logo and Title Section */}
      <div className="text-center space-y-2">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 bg-clip-text text-transparent">
          VyralSearch
        </h1>
        <div className="inline-block px-4 py-1 rounded-full bg-gradient-to-r from-purple-600 to-orange-400">
          <span className="text-white text-sm">Video Research on Steroids</span>
        </div>
        <div className="flex items-center justify-center space-x-6 mt-4">
          <a
            href="#"
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
          >
            <Instagram className="w-5 h-5" />
            <span>Instagram</span>
          </a>
          <a
            href="#"
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
          >
            <TikTokIcon className="w-5 h-5" />
            <span className="text-gray-400">TikTok Coming Soon</span>
          </a>
        </div>
      </div>

      <p className="text-gray-600 text-lg text-center">
        Save time finding viral content for social media
      </p>

      {/* Search Section */}
      <div className="w-full max-w-2xl space-y-4">
        {/* Instagram Search Input */}
        <div className="relative">
          <Input
            type="text"
            placeholder="Enter Instagram username or profile URL"
            className="pl-10 pr-32"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Button
            variant="ghost"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1 text-gray-600"
          >
            <List className="w-4 h-4" />
            <span>Bulk Search</span>
          </Button>
        </div>

        {/* Search Button */}
        <Button 
          onClick={handleSearch} 
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? "Searching..." : "Search"}
        </Button>

        {/* Settings Button */}
        <Button
          variant="ghost"
          className="flex items-center space-x-2 mx-auto text-gray-600"
        >
          <Settings className="w-4 h-4" />
          <span>Search Settings</span>
        </Button>
      </div>
    </div>
  );
};

export default Index;