import { useState } from "react";
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isLoading) {
      e.preventDefault();
      onSearch();
    }
  };

  const isBulkSearchEnabled = subscriptionStatus?.priceId && (
    subscriptionStatus.priceId === "price_1QdtwnGX13ZRG2XihcM36r3W" || // Pro Monthly
    subscriptionStatus.priceId === "price_1Qdtx2GX13ZRG2XieXrqPxAV" || // Pro Annual
    subscriptionStatus.priceId === "price_1Qdty5GX13ZRG2XiFxadAKJW" || // Ultra Monthly
    subscriptionStatus.priceId === "price_1QdtyHGX13ZRG2Xib8px0lu0"    // Ultra Annual
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
          onChange={(e) => onUsernameChange(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
        />
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
        {isBulkSearchEnabled && (
          <Button
            variant="ghost"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 
                     flex items-center gap-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100/80
                     dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800/80
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