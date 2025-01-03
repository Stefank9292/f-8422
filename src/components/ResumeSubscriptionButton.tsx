import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

export const ResumeSubscriptionButton = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleResume = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.functions.invoke('resume-subscription');
      
      if (error) throw error;
      
      toast({
        title: "Subscription Resumed",
        description: "Your subscription has been reactivated successfully.",
      });

      // Invalidate the subscription status query to refresh the UI
      queryClient.invalidateQueries({ queryKey: ['subscription-status'] });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to resume subscription. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleResume} 
      disabled={loading}
      variant="default"
      className="w-full sm:w-auto"
    >
      {loading ? "Resuming..." : "Resume Subscription"}
    </Button>
  );
};