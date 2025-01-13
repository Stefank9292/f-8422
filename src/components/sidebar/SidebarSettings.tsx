import { CreditCard, Moon, Sun, HelpCircle, MessageCircle, Star, Zap, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface SidebarSettingsProps {
  currentPath: string;
  subscriptionStatus: any;
}

export function SidebarSettings({ currentPath, subscriptionStatus }: SidebarSettingsProps) {
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(document.documentElement.classList.contains('dark'));

  const isCreatorPro = subscriptionStatus?.priceId === "price_1QdtwnGX13ZRG2XihcM36r3W";
  const isFreeUser = !subscriptionStatus?.subscribed;

  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          setIsDark(document.documentElement.classList.contains('dark'));
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  const secondaryMenuItems = [
    {
      title: isCreatorPro || isFreeUser ? "Upgrade to Creator on Steroids" : "Manage Subscription",
      icon: isCreatorPro || isFreeUser ? Zap : CreditCard,
      url: "/subscribe",
      showWhen: () => true,
      className: (isCreatorPro || isFreeUser) ? 
        "group relative" 
        : undefined
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
      icon: isDark ? Sun : Moon,
      onClick: isFreeUser ? undefined : () => {
        document.documentElement.classList.toggle('dark');
      },
      className: `group ${isFreeUser ? 'opacity-50 cursor-not-allowed' : ''}`,
      lockIcon: isFreeUser,
      tooltipText: isFreeUser ? "Upgrade to customize theme" : undefined
    },
  ];

  return (
    <div className="px-3 py-2">
      <span className="text-[11px] font-medium text-sidebar-foreground/60 px-2">Settings</span>
      <div className="mt-2 space-y-1">
        {secondaryMenuItems.map((item) => {
          if (item.showWhen && !item.showWhen()) {
            return null;
          }

          const IconComponent = item.icon;
          const isUpgradeButton = item.title.includes("Upgrade to Creator on Steroids");
          
          const button = (
            <button
              key={item.title}
              onClick={item.onClick || (item.url ? () => navigate(item.url) : undefined)}
              className={`w-full px-3 py-2 rounded-lg flex items-center gap-3 text-[11px] ${
                item.className || 
                (item.url && currentPath === item.url 
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground' 
                  : 'text-sidebar-foreground hover:bg-sidebar-accent/10')
              } transition-all duration-200`}
            >
              <IconComponent 
                className={`h-4 w-4 transition-transform duration-200 ease-spring
                  ${item.icon === Sun || item.icon === Moon ? 'group-hover:rotate-45' : 'group-hover:scale-110'}`}
              />
              {isUpgradeButton ? (
                <span className="bg-gradient-to-r from-[#D946EF] via-[#FF3D77] to-[#FF8A3D] text-transparent bg-clip-text font-medium">
                  {item.title}
                </span>
              ) : (
                <span className="font-medium">{item.title}</span>
              )}
              {item.lockIcon && <Lock className="h-3.5 w-3.5 ml-auto text-muted-foreground" />}
            </button>
          );

          if (item.tooltipText) {
            return (
              <Tooltip key={item.title}>
                <TooltipTrigger asChild>
                  {button}
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p className="text-[10px]">{item.tooltipText}</p>
                </TooltipContent>
              </Tooltip>
            );
          }

          return button;
        })}
      </div>
    </div>
  );
}