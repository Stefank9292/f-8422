import { CreditCard, LogOut, Moon, HelpCircle, MessageCircle, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { SidebarSection } from "./SidebarSection";

interface SidebarSettingsProps {
  currentPath: string;
  subscriptionStatus: any;
}

export function SidebarSettings({ currentPath, subscriptionStatus }: SidebarSettingsProps) {
  const navigate = useNavigate();
  const { toast } = useToast();

  const getUpgradeText = () => {
    if (!subscriptionStatus?.subscribed) {
      return "Upgrade to Pro";
    }
    if (subscriptionStatus?.priceId === "price_1QdBd2DoPDXfOSZFnG8aWuIq") {
      return "Upgrade to Ultra";
    }
    return "Manage Subscription";
  };

  const getUpgradeUrl = () => {
    if (!subscriptionStatus?.subscribed || 
        subscriptionStatus?.priceId === "price_1QdBd2DoPDXfOSZFnG8aWuIq") {
      return "/pricing";
    }
    return "/subscribe";
  };

  const secondaryMenuItems = [
    {
      title: getUpgradeText(),
      icon: subscriptionStatus?.subscribed ? CreditCard : Star,
      url: getUpgradeUrl(),
      className: !subscriptionStatus?.subscribed ? 
        "bg-orange-50 dark:bg-orange-950 text-orange-600 dark:text-orange-400" : undefined,
    },
    {
      title: "Help Center",
      icon: HelpCircle,
      url: "/help",
    },
    {
      title: "FAQs",
      icon: MessageCircle,
      url: "/faq",
    },
    {
      title: "Dark Mode",
      icon: Moon,
      onClick: () => {
        document.documentElement.classList.toggle('dark');
      },
    },
    {
      title: "Sign Out",
      icon: LogOut,
      onClick: async () => {
        await supabase.auth.signOut();
        toast({
          title: "Logged out",
          description: "You have been successfully logged out.",
        });
        navigate("/auth");
      },
    },
  ];

  return (
    <SidebarSection
      title="SETTINGS"
      items={secondaryMenuItems}
      subscriptionStatus={subscriptionStatus}
      onNavigate={navigate}
      currentPath={currentPath}
    />
  );
}