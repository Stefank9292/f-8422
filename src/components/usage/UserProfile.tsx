import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, Crown, Rocket } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export const UserProfile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data } = await supabase.auth.getSession();
      return data.session;
    },
  });

  const { data: subscriptionStatus } = useQuery({
    queryKey: ['subscription-status'],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('check-subscription', {
        headers: {
          Authorization: `Bearer ${session?.access_token}`
        }
      });
      if (error) throw error;
      return data;
    },
    enabled: !!session?.access_token,
  });

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate("/auth");
  };

  const isSteroidsUser = subscriptionStatus?.priceId === "price_1Qdty5GX13ZRG2XiFxadAKJW" || 
                         subscriptionStatus?.priceId === "price_1QdtyHGX13ZRG2Xib8px0lu0";
  const isProUser = subscriptionStatus?.priceId === "price_1QdtwnGX13ZRG2XihcM36r3W" || 
                    subscriptionStatus?.priceId === "price_1Qdtx2GX13ZRG2XieXrqPxAV";

  const getPlanName = () => {
    if (!subscriptionStatus?.subscribed) return 'Free';
    if (isProUser) return 'Creator Pro';
    if (isSteroidsUser) return 'Creator on Steroids';
    return 'Free';
  };

  const getPlanIcon = () => {
    if (isSteroidsUser) return <Rocket className="h-4 w-4" />;
    if (isProUser) return <Crown className="h-4 w-4" />;
    return <User className="h-4 w-4" />;
  };

  return (
    <div className="p-3 bg-card/50 rounded-xl border border-border/50">
      <div className="flex items-center gap-3">
        <Avatar className="h-8 w-8">
          <AvatarFallback>
            {getPlanIcon()}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex flex-col">
          <span className="text-[11px] text-sidebar-foreground/70 truncate max-w-[150px]">
            {session?.user?.email}
          </span>
          <div className="flex items-center gap-1">
            <span className={`text-[10px] ${
              isSteroidsUser 
                ? 'bg-gradient-to-r from-[#D946EF] via-[#E1306C] to-[#F97316] text-transparent bg-clip-text animate-pulse font-medium'
                : 'text-sidebar-foreground/50'
            }`}>
              {getPlanName()}
            </span>
            <span className="text-[10px] text-sidebar-foreground/50">Plan</span>
          </div>
        </div>
      </div>

      <div className="mt-3 flex justify-center">
        <button
          onClick={handleSignOut}
          className="px-2 py-1 rounded-full flex items-center gap-1.5 text-[10px] text-sidebar-foreground/70 hover:bg-sidebar-accent/20 transition-colors"
        >
          <LogOut className="h-3 w-3" />
          <span>Sign out</span>
        </button>
      </div>
    </div>
  );
};