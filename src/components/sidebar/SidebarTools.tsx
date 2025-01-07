import { useNavigate } from "react-router-dom";
import { SidebarSection } from "./SidebarSection";
import { NAV_ITEMS } from "@/config/navigation";

interface SidebarToolsProps {
  currentPath: string;
  subscriptionStatus?: any;
}

export function SidebarTools({ currentPath, subscriptionStatus }: SidebarToolsProps) {
  const navigate = useNavigate();

  return (
    <SidebarSection
      title="Tools"
      items={NAV_ITEMS}
      subscriptionStatus={subscriptionStatus}
      onNavigate={(url) => navigate(url)}
      currentPath={currentPath}
    />
  );
}