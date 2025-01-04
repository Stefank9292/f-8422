import { CreditCard, Moon, HelpCircle, MessageCircle, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SidebarSettingsProps {
  currentPath: string;
  subscriptionStatus: any;
}

export function SidebarSettings({ currentPath, subscriptionStatus }: SidebarSettingsProps) {
  const navigate = useNavigate();

  const secondaryMenuItems = [
    {
      title: "Manage Subscription",
      icon: CreditCard,
      url: "/subscribe",
      showWhen: (subscriptionStatus: any) => subscriptionStatus?.subscribed,
    },
    {
      title: "Upgrade to Pro",
      icon: Star,
      url: "/subscribe",
      className: "text-orange-600 dark:text-orange-400",
      showWhen: (subscriptionStatus: any) => !subscriptionStatus?.subscribed,
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
  ];

  return (
    <div className="px-2 py-2">
      <span className="text-[11px] text-sidebar-foreground/70 px-2">Settings</span>
      <div className="mt-2 space-y-1">
        {secondaryMenuItems.map((item) => {
          // Skip rendering if showWhen condition is defined and returns false
          if (item.showWhen && !item.showWhen(subscriptionStatus)) {
            return null;
          }

          return (
            <button
              key={item.title}
              onClick={item.onClick || (item.url ? () => navigate(item.url) : undefined)}
              className={`w-full px-2 py-1.5 rounded-md flex items-center gap-2 text-[11px] ${
                item.className || 
                (item.url && currentPath === item.url 
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground' 
                  : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/20')
              } transition-colors`}
            >
              <item.icon className="h-3.5 w-3.5" />
              <span>{item.title}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}