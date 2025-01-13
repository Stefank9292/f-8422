import { Instagram, History, FileText } from "lucide-react";
import { NavItem } from "@/types/navigation";

export const NAV_ITEMS: NavItem[] = [
  {
    title: "Instagram Video Search",
    url: "/",
    icon: Instagram,
    badge: "LIVE"
  },
  {
    title: "Search History",
    url: "/history",
    icon: History
  },
  {
    title: "Script Generator",
    url: "/transcribe",
    icon: FileText,
    badge: "NEW"
  }
];