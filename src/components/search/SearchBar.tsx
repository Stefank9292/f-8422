import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { BulkSearch } from "./BulkSearch";
import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { usePlaceholderAnimation } from "./PlaceholderAnimation";
import { BulkSearchButton } from "./BulkSearchButton";
import { useToast } from "@/hooks/use-toast";

interface SearchBarProps {
  username: string;
  onUsernameChange: (value: string) => void;
  onSearch: () => void;
  onBulkSearch?: (urls: string[], numberOfVideos: number, selectedDate: Date | undefined) => Promise<any>;
  isLoading?: boolean;
  hasReachedLimit?: boolean;
}

export const SearchBar = ({ 
  username, 
  onUsernameChange, 
  onSearch,
  onBulkSearch,
  isLoading,
  hasReachedLimit = false
}: SearchBarProps) => {
  const [isBulkSearchOpen, setIsBulkSearchOpen] = useState(false);
  const placeholder = usePlaceholderAnimation();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data } = await supabase.auth.getSession();
      return data.session;
    },
  });

  const { data: subscriptionStatus } = useQuery({
    queryKey: ['subscription-status'],
    queryFn: async () => {
      if (!session?.access_token) return null;
      const { data, error } = await supabase.functions.invoke('check-subscription', {
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });
      if (error) throw error;
      return data;
    },
    enabled: !!session?.access_token,
  });

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isLoading && username.trim() && !hasReachedLimit) {
      e.preventDefault();
      onSearch();
    }
  };

  const validateInstagramUsername = (input: string) => {
    // Remove @ symbol if present
    const cleanInput = input.replace('@', '');
    
    // Check if it's a URL
    if (input.includes('http') || input.includes('www.')) {
      // Check if it's an Instagram URL
      if (!input.includes('instagram.com')) {
        toast({
          title: "Invalid URL",
          description: "Please enter an Instagram URL (e.g., https://instagram.com/username) or just the username",
          variant: "destructive",
        });
        return false;
      }

      const urlPattern = /^(?:https?:\/\/)?(?:www\.)?instagram\.com\/([a-zA-Z0-9._]+)\/?$/;
      const match = input.match(urlPattern);
      if (!match) {
        toast({
          title: "Invalid Instagram URL",
          description: "Please enter a valid Instagram profile URL",
          variant: "destructive",
        });
        return false;
      }
      onUsernameChange(match[1]); // Extract username from URL
      return true;
    }
    
    // If it's just a username
    const usernamePattern = /^[a-zA-Z0-9._]+$/;
    if (!usernamePattern.test(cleanInput)) {
      toast({
        title: "Invalid Username",
        description: "Username can only contain letters, numbers, dots, and underscores",
        variant: "destructive",
      });
      return false;
    }
    onUsernameChange(cleanInput);
    return true;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    validateInstagramUsername(value);
  };

  const isBulkSearchEnabled = subscriptionStatus?.priceId && (
    subscriptionStatus.priceId === "price_1Qdt4NGX13ZRG2XiMWXryAm9" || // Creator on Steroids Monthly
    subscriptionStatus.priceId === "price_1Qdt5HGX13ZRG2XiUW80k3Fk" || // Creator on Steroids Annual
    subscriptionStatus.priceId === "price_1QfKMGGX13ZRG2XiFyskXyJo" || // Creator Pro Monthly
    subscriptionStatus.priceId === "price_1QfKMYGX13ZRG2XioPYKCe7h"    // Creator Pro Annual
  );

  return (
    <>
      <div className="relative w-full">
        <Input
          type="text"
          placeholder={placeholder}
          className="pl-12 pr-32 h-10 text-[13px] rounded-xl border border-gray-200/80 dark:border-gray-800/80 
                   focus:border-[#D946EF] shadow-sm
                   placeholder:text-gray-400 dark:placeholder:text-gray-600"
          value={username}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          disabled={isLoading || hasReachedLimit}
        />
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
        <BulkSearchButton 
          isEnabled={isBulkSearchEnabled}
          isLoading={isLoading}
          hasReachedLimit={hasReachedLimit}
          onClick={() => setIsBulkSearchOpen(true)}
        />
      </div>

      {isBulkSearchEnabled && (
        <BulkSearch
          isOpen={isBulkSearchOpen}
          onClose={() => setIsBulkSearchOpen(false)}
          onSearch={onBulkSearch || (() => Promise.resolve())}
          isLoading={isLoading}
          hasReachedLimit={hasReachedLimit}
        />
      )}
    </>
  );
};