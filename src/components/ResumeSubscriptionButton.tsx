import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface ResumeSubscriptionButtonProps {
  children?: React.ReactNode;
  className?: string;
}

export const ResumeSubscriptionButton = ({ children, className }: ResumeSubscriptionButtonProps) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data } = await supabase.auth.getSession();
      return data.session;
    },
  });

  const handleResume = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.functions.invoke('resume-subscription', {
        headers: {
          Authorization: `Bearer ${session?.access_token}`
        }
      });
      
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
      className={`bg-[#D946EF] hover:bg-[#D946EF]/90 text-white ${className}`}
    >
      {loading ? "Resuming..." : children || "Resume Subscription"}
    </Button>
  );
};