import { useNavigate } from "react-router-dom";
import { Settings, CreditCard } from "lucide-react";
import { SidebarSection } from "./SidebarSection";

interface SidebarSettingsProps {
  currentPath: string;
  subscriptionStatus?: any;
}

export function SidebarSettings({ currentPath, subscriptionStatus }: SidebarSettingsProps) {
  const navigate = useNavigate();

  const settingsItems = [
    {
      title: "Settings",
      url: "/settings",
      icon: Settings,
    },
    {
      title: "Manage Subscription",
      url: "/subscribe",
      icon: CreditCard,
    },
  ];

  return (
    <SidebarSection
      title="Settings"
      items={settingsItems}
      subscriptionStatus={subscriptionStatus}
      onNavigate={navigate}
      currentPath={currentPath}
    />
  );
}