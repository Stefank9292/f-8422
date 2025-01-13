import { Search, History, FileText, TikTok } from "lucide-react";
import { NavItem } from "@/types/navigation";

export const NAV_ITEMS: NavItem[] = [
  {
    title: "Viral Video Search",
    url: "/",
    icon: Search,
    badge: "BETA"
  },
  {
    title: "TikTok Search",
    url: "/tiktok",
    icon: TikTok,
    badge: "NEW"
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