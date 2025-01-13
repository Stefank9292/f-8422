import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { usePlaceholderAnimation } from "../PlaceholderAnimation";
import { useToast } from "@/hooks/use-toast";

interface TikTokSearchBarProps {
  username: string;
  onUsernameChange: (value: string) => void;
  onSearch: () => void;
  isLoading?: boolean;
  hasReachedLimit?: boolean;
}

export const TikTokSearchBar = ({ 
  username, 
  onUsernameChange, 
  onSearch,
  isLoading,
  hasReachedLimit = false
}: TikTokSearchBarProps) => {
  const placeholder = usePlaceholderAnimation();
  const { toast } = useToast();

  const validateTikTokUsername = (input: string, shouldToast: boolean = true) => {
    // Skip validation if input is empty
    if (!input.trim()) {
      onUsernameChange('');
      return true;
    }

    // Remove @ symbol if present
    const cleanInput = input.replace('@', '');
    
    // Check if it's a URL
    if (input.includes('http') || input.includes('www.')) {
      // Check if it's a TikTok URL
      if (!input.includes('tiktok.com')) {
        if (shouldToast) {
          toast({
            title: "Invalid URL",
            description: "Please enter a TikTok URL (e.g., https://tiktok.com/@username) or just the username",
            variant: "destructive",
          });
        }
        return false;
      }

      const urlPattern = /^(?:https?:\/\/)?(?:www\.)?tiktok\.com\/@?([a-zA-Z0-9._]+)\/?$/;
      const match = input.match(urlPattern);
      if (!match) {
        if (shouldToast) {
          toast({
            title: "Invalid TikTok URL",
            description: "Please enter a valid TikTok profile URL",
            variant: "destructive",
          });
        }
        return false;
      }
      onUsernameChange(match[1]); // Extract username from URL
      return true;
    }
    
    // If it's just a username
    const usernamePattern = /^[a-zA-Z0-9._]+$/;
    if (!usernamePattern.test(cleanInput)) {
      if (shouldToast) {
        toast({
          title: "Invalid Username",
          description: "Username can only contain letters, numbers, dots, and underscores",
          variant: "destructive",
        });
      }
      return false;
    }
    onUsernameChange(cleanInput);
    return true;
  };

  // Add effect to validate username when it changes from external updates (recent searches)
  useEffect(() => {
    if (username) {
      validateTikTokUsername(username, false);
    }
  }, [username]);

  return (
    <div className="relative w-full">
      <Input
        type="text"
        placeholder={placeholder}
        className="pl-12 h-10 text-[13px] rounded-xl border border-gray-200/80 dark:border-gray-800/80 
                 focus:border-[#D946EF] shadow-sm
                 placeholder:text-gray-400 dark:placeholder:text-gray-600"
        value={username}
        onChange={(e) => validateTikTokUsername(e.target.value)}
        disabled={isLoading || hasReachedLimit}
      />
      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
    </div>
  );
};