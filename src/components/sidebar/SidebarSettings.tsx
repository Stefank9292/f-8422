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
      title: "Manage Subscription",
      icon: CreditCard,
      url: "/subscribe",
      showWhen: () => true,
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
      onClick: () => {
        document.documentElement.classList.toggle('dark');
      },
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
          
          return (
            <button
              key={item.title}
              onClick={item.onClick || (item.url ? () => navigate(item.url) : undefined)}
              className={`w-full px-3 py-2 rounded-lg flex items-center gap-3 text-[11px] ${
                item.url && currentPath === item.url 
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground' 
                  : 'text-sidebar-foreground hover:bg-sidebar-accent/10'
              } transition-all duration-200`}
            >
              <IconComponent 
                className={`h-4 w-4 transition-transform duration-200 ease-spring
                  ${item.icon === Sun || item.icon === Moon ? 'group-hover:rotate-45' : 'group-hover:scale-110'}`}
              />
              <span className="font-medium">{item.title}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}