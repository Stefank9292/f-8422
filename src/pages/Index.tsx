import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { CancelSubscriptionButton } from "@/components/CancelSubscriptionButton";
import { useState } from "react";

const Index = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [clickCount, setClickCount] = useState(0);

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

  const handleCrownClick = () => {
    if (subscriptionStatus?.subscribed && clickCount < 10) {
      setClickCount(prev => prev + 1);
      toast({
        title: "Crown clicked!",
        description: `You have ${9 - clickCount} clicks remaining.`,
      });
    } else if (subscriptionStatus?.subscribed && clickCount >= 10) {
      toast({
        title: "Click limit reached",
        description: "You have reached the maximum number of clicks (10).",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            {!subscriptionStatus?.subscribed ? (
              <Button variant="default" onClick={() => navigate("/subscribe")}>
                Upgrade to Premium
              </Button>
            ) : (
              <CancelSubscriptionButton isCanceled={subscriptionStatus?.canceled} />
            )}
          </div>
          <Button variant="outline" onClick={handleLogout}>
            Log out
          </Button>
        </div>
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome to Your App</h1>
          {subscriptionStatus?.subscribed ? (
            <div className="space-y-4">
              <p className="text-xl text-gray-600 mb-6">
                Thank you for being a premium member!
              </p>
              <div className="relative inline-block">
                <img 
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxPqum0Pg64e3XHpP323coM5r2JN1ThM06wQ&s" 
                  alt="Premium content"
                  className={`mx-auto rounded-lg shadow-lg cursor-pointer transition-transform hover:scale-105 ${clickCount >= 10 ? 'opacity-50' : ''}`}
                  onClick={handleCrownClick}
                />
                {clickCount > 0 && (
                  <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold">
                    {clickCount}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <p className="text-xl text-gray-600">
              Start building your amazing project here!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;