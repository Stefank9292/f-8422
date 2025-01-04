import { History } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SidebarSection } from "./SidebarSection";

const historyMenuItems = [
  {
    title: "Recent Searches",
    url: "/history",
    icon: History,
  },
];

export function SidebarHistory({ currentPath }: { currentPath: string }) {
  const navigate = useNavigate();
  
  return (
    <SidebarSection
      title="HISTORY"
      items={historyMenuItems}
      onNavigate={navigate}
      currentPath={currentPath}
    />
  );
}