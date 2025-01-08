import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useRecaptchaSiteKey = () => {
  return useQuery({
    queryKey: ["recaptcha-site-key"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("No session");

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/get-recaptcha-key`,
        {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch reCAPTCHA site key");
      }

      const { siteKey } = await response.json();
      return siteKey;
    },
    retry: 1,
  });
};