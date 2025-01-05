import { useState, useEffect } from "react";
import { Search, List } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BulkSearch } from "./BulkSearch";
import { useQuery, useQueryClient } from "@tanstack/react-query";
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
  const queryClient = useQueryClient();

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

  const { data: requestStats } = useQuery({
    queryKey: ['request-stats'],
    queryFn: async () => {
      if (!session?.user.id) return null;
      
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

      const { count } = await supabase
        .from('user_requests')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', session.user.id)
        .eq('request_type', 'instagram_search')
        .gte('created_at', startOfMonth.toISOString())
        .lt('created_at', endOfMonth.toISOString())
        .or(`last_reset_at.is.null,last_reset_at.lt.${startOfMonth.toISOString()}`);

      return count || 0;
    },
    enabled: !!session?.user.id,
  });

  // Listen for real-time updates on user_requests
  useEffect(() => {
    if (!session?.user.id) return;

    const channel = supabase
      .channel('user-requests-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_requests',
          filter: `user_id=eq.${session.user.id}`
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['request-stats'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session?.user.id, queryClient]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isLoading) {
      e.preventDefault();
      onSearch();
    }
  };

  const getMaxRequests = () => {
    if (!subscriptionStatus?.priceId) return 3;
    if (subscriptionStatus.priceId === "price_1QdtwnGX13ZRG2XihcM36r3W" || 
        subscriptionStatus.priceId === "price_1Qdtx2GX13ZRG2XieXrqPxAV") return 25;
    if (subscriptionStatus.priceId === "price_1Qdty5GX13ZRG2XiFxadAKJW" || 
        subscriptionStatus.priceId === "price_1QdtyHGX13ZRG2Xib8px0lu0") return Infinity;
    return 3;
  };

  const isBulkSearchEnabled = subscriptionStatus?.priceId && (
    subscriptionStatus.priceId === "price_1QdtwnGX13ZRG2XihcM36r3W" || // Pro Monthly
    subscriptionStatus.priceId === "price_1Qdtx2GX13ZRG2XieXrqPxAV" || // Pro Annual
    subscriptionStatus.priceId === "price_1Qdty5GX13ZRG2XiFxadAKJW" || // Ultra Monthly
    subscriptionStatus.priceId === "price_1QdtyHGX13ZRG2Xib8px0lu0"    // Ultra Annual
  );

  const maxRequests = getMaxRequests();
  const usedRequests = requestStats || 0;
  const remainingRequests = maxRequests === Infinity ? 'Unlimited' : Math.max(0, maxRequests - usedRequests);

  return (
    <>
      <div className="relative w-full">
        <Input
          type="text"
          placeholder={`${placeholder} (${usedRequests}/${maxRequests === Infinity ? '∞' : maxRequests} searches used)`}
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