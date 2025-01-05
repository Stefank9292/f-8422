import { useState, useEffect } from "react";
import { Search, List } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BulkSearch } from "./BulkSearch";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface SearchBarProps {
  username: string;
  onUsernameChange: (value: string) => void;
  onSearch: () => void;
  onBulkSearch?: (urls: string[], numberOfVideos: number, selectedDate: Date | undefined) => Promise<any>;
  isLoading?: boolean;
}

export const SearchBar = ({ 
  username, 
  onUsernameChange, 
  onSearch,
  onBulkSearch,
  isLoading 
}: SearchBarProps) => {
  const [isBulkSearchOpen, setIsBulkSearchOpen] = useState(false);
  const [placeholder, setPlaceholder] = useState("Enter Instagram username or profile URL");
  const examples = ["garyvee", "innermale", "stefankarolija"];
  const [currentExampleIndex, setCurrentExampleIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const typingSpeed = 100; // milliseconds per character

  const { data: subscriptionStatus } = useQuery({
    queryKey: ['subscription-status'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) return null;

      const { data, error } = await supabase.functions.invoke('check-subscription', {
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });
      if (error) throw error;
      return data;
    },
    enabled: false,
  });

  useEffect(() => {
    let initialTimeout: NodeJS.Timeout;
    let typingTimeout: NodeJS.Timeout;

    const startTypingAnimation = () => {
      setIsTyping(true);
      setCurrentExampleIndex(0);
      setCurrentCharIndex(0);
    };

    if (!username) {
      // Show default placeholder for 3 seconds before starting animation
      initialTimeout = setTimeout(() => {
        startTypingAnimation();
      }, 3000);
    } else {
      setIsTyping(false);
      setPlaceholder("Enter Instagram username or profile URL");
    }

    return () => {
      clearTimeout(initialTimeout);
      clearTimeout(typingTimeout);
    };
  }, [username]);

  useEffect(() => {
    let typingTimeout: NodeJS.Timeout;

    if (isTyping && !username) {
      const currentExample = examples[currentExampleIndex];

      if (currentCharIndex <= currentExample.length) {
        typingTimeout = setTimeout(() => {
          setPlaceholder(currentExample.substring(0, currentCharIndex));
          setCurrentCharIndex(prev => prev + 1);
        }, typingSpeed);
      } else {
        // Move to next example after a pause
        typingTimeout = setTimeout(() => {
          setCurrentCharIndex(0);
          setCurrentExampleIndex((prev) => (prev + 1) % examples.length);
        }, 1000);
      }
    }

    return () => clearTimeout(typingTimeout);
  }, [currentCharIndex, currentExampleIndex, examples, isTyping, username]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isLoading) {
      e.preventDefault();
      onSearch();
    }
  };

  const isBulkSearchEnabled = subscriptionStatus?.priceId && 
    (subscriptionStatus.priceId === "price_1QdBd2DoPDXfOSZFnG8aWuIq" || 
     subscriptionStatus.priceId === "price_1QdC54DoPDXfOSZFXHBO4yB3");

  return (
    <>
      <div className="relative w-full">
        <Input
          type="text"
          placeholder={placeholder}
          className="pl-12 pr-32 h-10 text-[13px] rounded-xl border border-gray-200/80 dark:border-gray-800/80 
                   focus:border-[#0EA5E9] shadow-sm
                   placeholder:text-gray-400 dark:placeholder:text-gray-600"
          value={username}
          onChange={(e) => onUsernameChange(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
        />
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
        {isBulkSearchEnabled && (
          <Button
            variant="ghost"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 
                     flex items-center gap-2 text-gray-600 hover:text-gray-900 
                     dark:text-gray-400 dark:hover:text-gray-200
                     h-7 px-3 rounded-lg"
            onClick={() => setIsBulkSearchOpen(true)}
            disabled={isLoading}
          >
            <List className="w-3.5 h-3.5" />
            <span className="hidden md:inline text-[11px] font-medium">Bulk Search</span>
          </Button>
        )}
      </div>

      {isBulkSearchEnabled && (
        <BulkSearch
          isOpen={isBulkSearchOpen}
          onClose={() => setIsBulkSearchOpen(false)}
          onSearch={onBulkSearch || (() => Promise.resolve())}
          isLoading={isLoading}
        />
      )}
    </>
  );
};
