import { useQuery } from "@tanstack/react-query";

export const useRecaptchaSiteKey = () => {
  return useQuery({
    queryKey: ["recaptcha-site-key"],
    queryFn: async () => {
      const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
      
      if (!siteKey) {
        throw new Error("Failed to fetch reCAPTCHA site key");
      }

      return siteKey;
    },
    retry: 1,
  });
};