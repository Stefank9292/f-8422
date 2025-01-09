import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useSearchHistoryAccess() {
  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data } = await supabase.auth.getSession();
      return data.session;
    },
  });

  const { data: subscriptionStatus } = useQuery({
    queryKey: ['subscription-status', session?.access_token],
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

  const isSteroidsUser = subscriptionStatus?.priceId === "price_1Qdt4NGX13ZRG2XiMWXryAm9" || 
                        subscriptionStatus?.priceId === "price_1Qdt5HGX13ZRG2XiUW80k3Fk";
  
  const isProUser = subscriptionStatus?.priceId === "price_1Qdt2dGX13ZRG2XiaKwG6VPu" || 
                    subscriptionStatus?.priceId === "price_1Qdt3tGX13ZRG2XiesasShEJ";

  return {
    session,
    isSteroidsUser,
    isProUser,
    hasAccess: isSteroidsUser || isProUser
  };
}