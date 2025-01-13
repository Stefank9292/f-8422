import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { usePlaceholderAnimation } from "../PlaceholderAnimation";
import { useToast } from "@/hooks/use-toast";

interface InstagramSearchBarProps {
  username: string;
  onUsernameChange: (value: string) => void;
  onSearch: () => void;
  onBulkSearch: (urls: string[], numVideos: number, date: Date | undefined) => Promise<any>;
  isLoading?: boolean;
  hasReachedLimit?: boolean;
}

export const InstagramSearchBar = ({
  username,
  onUsernameChange,
  onSearch,
  onBulkSearch,
  isLoading,
  hasReachedLimit = false
}: InstagramSearchBarProps) => {
  const placeholder = usePlaceholderAnimation();
  const { toast } = useToast();

  const validateInstagramUsername = (input: string, shouldToast: boolean = true) => {
    if (!input.trim()) {
      onUsernameChange('');
      return true;
    }

    const cleanInput = input.replace('@', '');
    
    if (input.includes('http') || input.includes('www.')) {
      if (!input.includes('instagram.com')) {
        if (shouldToast) {
          toast({
            title: "Invalid URL",
            description: "Please enter an Instagram URL (e.g., https://instagram.com/username) or just the username",
            variant: "destructive",
          });
        }
        return false;
      }

      const urlPattern = /^(?:https?:\/\/)?(?:www\.)?instagram\.com\/?([a-zA-Z0-9._]+)\/?$/;
      const match = input.match(urlPattern);
      if (!match) {
        if (shouldToast) {
          toast({
            title: "Invalid Instagram URL",
            description: "Please enter a valid Instagram profile URL",
            variant: "destructive",
          });
        }
        return false;
      }
      onUsernameChange(match[1]);
      return true;
    }
    
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

  useEffect(() => {
    if (username) {
      validateInstagramUsername(username, false);
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
        onChange={(e) => validateInstagramUsername(e.target.value)}
        disabled={isLoading || hasReachedLimit}
      />
      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
    </div>
  );
};