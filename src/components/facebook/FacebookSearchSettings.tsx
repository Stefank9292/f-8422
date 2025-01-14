import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Settings2, HelpCircle } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface FacebookSearchSettingsProps {
  isSettingsOpen: boolean;
  setIsSettingsOpen: (open: boolean) => void;
  numberOfPosts: number;
  setNumberOfPosts: (num: number) => void;
  disabled?: boolean;
}

export const FacebookSearchSettings = ({
  isSettingsOpen,
  setIsSettingsOpen,
  numberOfPosts,
  setNumberOfPosts,
  disabled = false,
}: FacebookSearchSettingsProps) => {
  const [localNumberOfPosts, setLocalNumberOfPosts] = useState(numberOfPosts);

  const { data: subscriptionStatus } = useQuery({
    queryKey: ['subscription-status'],
    queryFn: async () => {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.access_token) return null;

      const { data, error } = await supabase.functions.invoke('check-subscription', {
        headers: {
          Authorization: `Bearer ${session.session.access_token}`
        }
      });
      if (error) throw error;
      return data;
    },
  });

  const getMaxPosts = () => {
    if (!subscriptionStatus?.priceId) return 5;
    if (subscriptionStatus.priceId === "price_1Qdt4NGX13ZRG2XiMWXryAm9" || 
        subscriptionStatus.priceId === "price_1Qdt5HGX13ZRG2XiUW80k3Fk") return 50;
    if (subscriptionStatus.priceId === "price_1QfKMGGX13ZRG2XiFyskXyJo" || 
        subscriptionStatus.priceId === "price_1QfKMYGX13ZRG2XioPYKCe7h") return 25;
    return 5;
  };

  const maxPosts = getMaxPosts();

  useEffect(() => {
    if (localNumberOfPosts > maxPosts) {
      setLocalNumberOfPosts(maxPosts);
      setNumberOfPosts(maxPosts);
    }
  }, [subscriptionStatus?.priceId]);

  const handleSliderChange = (value: number[]) => {
    setLocalNumberOfPosts(value[0]);
  };

  const handleSliderPointerUp = () => {
    setNumberOfPosts(localNumberOfPosts);
  };

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <button
        onClick={() => setIsSettingsOpen(!isSettingsOpen)}
        className="inline-flex items-center justify-center gap-2 py-2.5 px-5 text-xs text-gray-700 dark:text-gray-200 
                 bg-gray-50/80 dark:bg-gray-800/80 hover:bg-gray-100/80 dark:hover:bg-gray-700/80 
                 transition-colors rounded-lg backdrop-blur-sm border border-gray-200/80 dark:border-gray-700/80"
        disabled={disabled}
      >
        <Settings2 className="w-4 h-4" />
        <span className="font-medium">Search Settings</span>
      </button>

      {isSettingsOpen && (
        <div className="mt-3 p-4 space-y-5 bg-white/90 dark:bg-gray-800/90 rounded-xl 
                      border border-gray-200/80 dark:border-gray-700/80 animate-in fade-in duration-200
                      w-full max-w-md mx-auto backdrop-blur-sm">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-medium">Number of Posts</span>
                <HelpCircle className="w-3.5 h-3.5 text-gray-400" />
              </div>
              <span className="text-[11px] font-medium bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">
                {localNumberOfPosts}
              </span>
            </div>
            <Slider
              value={[localNumberOfPosts]}
              onValueChange={handleSliderChange}
              onPointerUp={handleSliderPointerUp}
              min={1}
              max={maxPosts}
              step={1}
              disabled={disabled}
              className="w-full"
            />
          </div>
        </div>
      )}
    </div>
  );
};