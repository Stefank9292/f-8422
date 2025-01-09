import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";

interface SubscribeButtonProps {
  planId: string;
  planName: string;
  isPopular?: boolean;
  isAnnual?: boolean;
  className?: string;
}

export const SubscribeButton = ({ 
  planId,
  planName,
  isPopular,
  isAnnual,
  className 
}: SubscribeButtonProps) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data } = await supabase.auth.getSession();
      return data.session;
    },
  });

  const handleSubscribe = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: { priceId: planId },
        headers: {
          Authorization: `Bearer ${session?.access_token}`
        }
      });

      if (error) throw error;

      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (error: any) {
      console.error('Subscription error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to start subscription process. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleSubscribe}
      disabled={loading}
      variant={isPopular ? "default" : "secondary"}
      size="lg"
      className={`w-full ${className}`}
    >
      {loading ? "Processing..." : `Subscribe to ${planName}${isAnnual ? ' (Annual)' : ' (Monthly)'}`}
    </Button>
  );
};