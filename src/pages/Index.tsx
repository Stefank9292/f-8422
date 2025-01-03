import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

const Index = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const { data: subscriptionStatus } = useQuery({
    queryKey: ['subscription-status'],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('check-subscription');
      if (error) throw error;
      return data;
    },
  });

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate("/auth");
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            {!subscriptionStatus?.subscribed && (
              <Button variant="default" onClick={() => navigate("/subscribe")}>
                Upgrade to Premium
              </Button>
            )}
          </div>
          <Button variant="outline" onClick={handleLogout}>
            Log out
          </Button>
        </div>
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome to Your App</h1>
          <p className="text-xl text-gray-600">
            {subscriptionStatus?.subscribed 
              ? "Thank you for being a premium member!"
              : "Start building your amazing project here!"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;