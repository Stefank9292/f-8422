import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";

export const useRequestCount = (session: Session | null) => {
  const queryClient = useQueryClient();

  const { data: requestCount = 0 } = useQuery({
    queryKey: ['request-count'],
    queryFn: async () => {
      if (!session?.user.id) return 0;
      
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

      // Get requests for the current billing period
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

  useEffect(() => {
    if (!session?.user?.id) return;

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
          queryClient.invalidateQueries({ queryKey: ['request-count'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session?.user?.id, queryClient]);

  return requestCount;
};