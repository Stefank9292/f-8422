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

  return {
    session,
    isSteroidsUser: true,
    isProUser: true,
    hasAccess: true // Allow access for all users
  };
}