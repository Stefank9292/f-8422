import { CreditCard, Moon, HelpCircle, MessageCircle, Star, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SidebarSettingsProps {
  currentPath: string;
  subscriptionStatus: any;
}

export function SidebarSettings({ currentPath, subscriptionStatus }: SidebarSettingsProps) {
  const navigate = useNavigate();

  const isCreatorPro = subscriptionStatus?.priceId === "price_1QdBd2DoPDXfOSZFnG8aWuIq";

  const secondaryMenuItems = [
    {
      title: isCreatorPro ? "Upgrade to Creator on Steroids" : "Manage Subscription",
      icon: isCreatorPro ? Zap : CreditCard,
      url: "/subscribe",
      showWhen: (subscriptionStatus: any) => subscriptionStatus?.subscribed,
      className: isCreatorPro ? 
        "bg-gradient-to-r from-[#FFD700] via-[#FFA500] to-[#FF8C00] text-white hover:from-[#FFE55C] hover:via-[#FFB52E] hover:to-[#FFA033] animate-pulse hover:animate-none transition-all duration-300" 
        : undefined
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
              <item.icon className={`h-3.5 w-3.5 ${isCreatorPro && item.icon === Zap ? 'animate-bounce' : ''}`} />
              <span>{item.title}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}