import { Search, History, FileText } from "lucide-react";
import { TikTokIcon } from "@/components/icons/TikTokIcon";
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
    icon: TikTokIcon,
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