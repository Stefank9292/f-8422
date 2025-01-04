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
  disabled?: boolean;
}

export const SearchBar = ({ 
  username, 
  onUsernameChange, 
  onSearch,
  onBulkSearch,
  isLoading,
  disabled = false
}: SearchBarProps) => {
  const [isBulkSearchOpen, setIsBulkSearchOpen] = useState(false);
  const [placeholder, setPlaceholder] = useState("Enter Instagram username or profile URL");
  const examples = ["garyvee", "innermale", "stefankarolija"];
  const [currentExampleIndex, setCurrentExampleIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const typingSpeed = 100;

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
    if (e.key === 'Enter' && !isLoading && !disabled) {
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
          placeholder={disabled ? "Daily limit reached" : placeholder}
          className="pl-14 pr-36 h-16 text-lg md:text-xl rounded-2xl border-2 
                   border-gray-200/80 dark:border-gray-800/80 
                   focus:border-primary shadow-sm
                   placeholder:text-gray-400 dark:placeholder:text-gray-600
                   disabled:opacity-50 disabled:cursor-not-allowed"
          value={username}
          onChange={(e) => onUsernameChange(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading || disabled}
        />
        <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
        {isBulkSearchEnabled && (
          <Button
            variant="ghost"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 
                     flex items-center gap-2 text-gray-600 hover:text-gray-900 
                     dark:text-gray-400 dark:hover:text-gray-200
                     h-12 px-4 rounded-xl
                     disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => setIsBulkSearchOpen(true)}
            disabled={isLoading || disabled}
          >
            <List className="w-5 h-5" />
            <span className="hidden md:inline font-medium">Bulk Search</span>
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