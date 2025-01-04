import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SidebarSection } from "./SidebarSection";

interface SidebarToolsProps {
  currentPath: string;
  subscriptionStatus?: any;
}

export function SidebarTools({ currentPath, subscriptionStatus }: SidebarToolsProps) {
  const navigate = useNavigate();

  const items = [
    {
      title: "Search",
      url: "/",
      icon: Search,
    },
  ];

  return (
    <SidebarSection
      title="Tools"
      items={items}
      subscriptionStatus={subscriptionStatus}
      onNavigate={navigate}
      currentPath={currentPath}
    />
  );
}