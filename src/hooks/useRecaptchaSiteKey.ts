import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useRecaptchaSiteKey = () => {
  return useQuery({
    queryKey: ["recaptcha-site-key"],
    queryFn: async () => {
      const response = await supabase.functions.invoke('get-recaptcha-key');
      
      if (response.error) {
        console.error('Error fetching reCAPTCHA site key:', response.error);
        throw new Error(response.error.message);
      }
      
      const { data } = response;
      if (!data?.siteKey) {
        throw new Error("Failed to fetch reCAPTCHA site key");
      }

      return data.siteKey;
    },
    retry: 1,
  });
};