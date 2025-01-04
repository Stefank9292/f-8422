import { useNavigate } from "react-router-dom";
import { Home, History, Search } from "lucide-react";
import { SidebarSection } from "./SidebarSection";

export function SidebarNavigation() {
  const navigate = useNavigate();

  const navigationItems = [
    {
      title: "Home",
      url: "/",
      icon: Home,
    },
    {
      title: "Search",
      url: "/search",
      icon: Search,
    },
    {
      title: "History",
      url: "/history",
      icon: History,
    },
  ];

  return (
    <SidebarSection
      title="Navigation"
      items={navigationItems}
      onNavigate={navigate}
      currentPath={location.pathname}
    />
  );
}