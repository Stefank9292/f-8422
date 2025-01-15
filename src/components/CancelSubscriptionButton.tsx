import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
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
import { useQuery, useQueryClient } from "@tanstack/react-query";

export const CancelSubscriptionButton = ({ 
  isCanceled = false, 
  children,
  className,
  cancelAt
}: { 
  isCanceled?: boolean;
  children?: React.ReactNode;
  className?: string;
  cancelAt?: number;
}) => {
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

  const handleCancel = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.functions.invoke('cancel-subscription', {
        headers: {
          Authorization: `Bearer ${session?.access_token}`
        }
      });
      
      if (error) throw error;
      
      toast({
        title: "Subscription Cancelled",
        description: "Your subscription will be cancelled at the end of the billing period.",
      });

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

  if (isCanceled && cancelAt) {
    const cancelDate = new Date(cancelAt * 1000);
    return (
      <Button 
        variant="outline" 
        disabled 
        className={`text-[11px] h-8 px-4 ${className}`}
      >
        {`Cancels ${format(cancelDate, 'MMM d')}`}
      </Button>
    );
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button 
          variant="ghost"
          disabled={loading}
          className={`text-[11px] h-8 px-4 ${className}`}
        >
          {children || "Cancel Subscription"}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-base">Are you sure?</AlertDialogTitle>
          <AlertDialogDescription className="text-[11px] text-muted-foreground">
            Your subscription will be cancelled at the end of the current billing period. 
            You will still have access to premium features until then.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="text-[11px] h-8">Keep Subscription</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleCancel} 
            disabled={loading}
            className="text-[11px] h-8 bg-[#1a365d] hover:bg-[#1a365d]/90 text-white"
          >
            {loading ? "Cancelling..." : "Yes, Cancel Subscription"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};