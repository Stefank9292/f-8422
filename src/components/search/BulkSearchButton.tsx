import { List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface BulkSearchButtonProps {
  isEnabled: boolean;
  isLoading: boolean;
  onClick: () => void;
}

export const BulkSearchButton = ({ isEnabled, isLoading, onClick }: BulkSearchButtonProps) => {
  const { data: subscriptionStatus } = useQuery({
    queryKey: ['subscription-status'],
    queryFn: async () => {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.access_token) return null;

      const { data, error } = await supabase.functions.invoke('check-subscription', {
        headers: {
          Authorization: `Bearer ${session.session.access_token}`
        }
      });
      if (error) throw error;
      return data;
    },
  });

  const isSteroidsUser = subscriptionStatus?.priceId === "price_1Qdt4NGX13ZRG2XiMWXryAm9" || 
                        subscriptionStatus?.priceId === "price_1Qdt5HGX13ZRG2XiUW80k3Fk";
  
  const isProUser = subscriptionStatus?.priceId === "price_1QfKMGGX13ZRG2XiFyskXyJo" || 
                    subscriptionStatus?.priceId === "price_1QfKMYGX13ZRG2XioPYKCe7h";

  if (!isSteroidsUser && !isProUser) return null;

  return (
    <Button
      variant="ghost"
      className="absolute right-2 top-1/2 transform -translate-y-1/2 
                flex items-center gap-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100/80
                dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800/80
                h-7 px-3 rounded-lg"
      onClick={onClick}
      disabled={isLoading}
    >
      <List className="w-3.5 h-3.5" />
      <span className="hidden md:inline text-[11px] font-medium">Bulk Search</span>
    </Button>
  );
};