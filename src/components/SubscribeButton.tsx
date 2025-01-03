import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const SubscribeButton = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubscribe = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('create-checkout-session');
      
      if (error) throw error;
      
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to start checkout process. Please try again.",
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
      className="w-full sm:w-auto"
    >
      {loading ? "Loading..." : "Subscribe Now"}
    </Button>
  );
};