import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";

export const useSubscriptionLimits = (session: Session | null) => {
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

  const getMaxRequests = () => {
    if (!subscriptionStatus?.priceId) return 3; // Free tier: 3 searches per month
    
    // Pro tier: 25 searches per month
    if (subscriptionStatus.priceId === "price_1QfKMGGX13ZRG2XiFyskXyJo" || 
        subscriptionStatus.priceId === "price_1QfKMYGX13ZRG2XioPYKCe7h") {
      return 25;
    }
    
    // Creator on Steroids tier: 50 searches per month
    if (subscriptionStatus.priceId === "price_1Qdt4NGX13ZRG2XiMWXryAm9" || 
        subscriptionStatus.priceId === "price_1Qdt5HGX13ZRG2XiUW80k3Fk") {
      return 50;
    }
    
    return 3; // Default to free tier
  };

  const isProUser = subscriptionStatus?.priceId === "price_1QfKMGGX13ZRG2XiFyskXyJo" || 
                   subscriptionStatus?.priceId === "price_1QfKMYGX13ZRG2XioPYKCe7h";

  const isSteroidsUser = subscriptionStatus?.priceId === "price_1Qdt4NGX13ZRG2XiMWXryAm9" || 
                        subscriptionStatus?.priceId === "price_1Qdt5HGX13ZRG2XiUW80k3Fk";

  return {
    subscriptionStatus,
    maxRequests: getMaxRequests(),
    isProUser,
    isSteroidsUser,
  };
};