import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useUsageStats } from "@/hooks/useUsageStats";

export const useSearchSession = () => {
  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data } = await supabase.auth.getSession();
      return data.session;
    },
  });

  const {
    maxRequests,
    usedRequests: requestCount,
    hasReachedLimit,
    isProUser,
    isSteroidsUser,
    subscriptionStatus
  } = useUsageStats(session);

  return {
    session,
    maxRequests,
    requestCount,
    hasReachedLimit,
    isProUser,
    isSteroidsUser,
    subscriptionStatus
  };
};