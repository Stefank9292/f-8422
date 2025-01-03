import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useQueryClient } from "@tanstack/react-query";

export const CancelSubscriptionButton = ({ 
  isCanceled = false, 
  children,
  className 
}: { 
  isCanceled?: boolean;
  children?: React.ReactNode;
  className?: string;
}) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleCancel = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.functions.invoke('cancel-subscription');
      
      if (error) throw error;
      
      toast({
        title: "Subscription Cancelled",
        description: "Your subscription will be cancelled at the end of the billing period.",
      });

      // Invalidate the subscription status query to refresh the UI
      queryClient.invalidateQueries({ queryKey: ['subscription-status'] });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to cancel subscription. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (isCanceled) {
    return (
      <Button 
        variant="outline" 
        disabled 
        className={className}
      >
        {children || "Canceled"}
      </Button>
    );
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button 
          variant="ghost"
          disabled={loading}
          className={className}
        >
          {children || "Cancel Subscription"}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            Your subscription will be cancelled at the end of the current billing period. 
            You will still have access to premium features until then.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Keep Subscription</AlertDialogCancel>
          <AlertDialogAction onClick={handleCancel} disabled={loading}>
            {loading ? "Cancelling..." : "Yes, Cancel Subscription"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};