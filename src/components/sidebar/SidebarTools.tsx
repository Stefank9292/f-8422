import { SidebarSection } from "./SidebarSection";
import { NAV_ITEMS } from "@/config/navigation";

interface SidebarToolsProps {
  currentPath: string;
  subscriptionStatus?: any;
}

export function SidebarTools({ currentPath, subscriptionStatus }: SidebarToolsProps) {
  const handleNavigate = (url: string) => {
    window.location.href = url;
  };

  return (
    <SidebarSection
      title="TOOLS"
      items={NAV_ITEMS}
      subscriptionStatus={subscriptionStatus}
      onNavigate={handleNavigate}
      currentPath={currentPath}
    />
  );
}