import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SidebarSection } from "./SidebarSection";

const toolsMenuItems = [
  {
    title: "Video Search",
    url: "/",
    icon: Search,
  },
];

export function SidebarTools({ currentPath }: { currentPath: string }) {
  const navigate = useNavigate();
  
  return (
    <SidebarSection
      title="TOOLS"
      items={toolsMenuItems}
      onNavigate={navigate}
      currentPath={currentPath}
    />
  );
}