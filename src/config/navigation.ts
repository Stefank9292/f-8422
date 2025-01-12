import { Search, History, FileText } from "lucide-react";
import { NavItem } from "@/types/navigation";

export const NAV_ITEMS: NavItem[] = [
  {
    title: "Viral Video Search",
    url: "/",
    icon: Search,
    badge: "BETA"
  },
  {
    title: "Search History",
    url: "/history",
    icon: History
  },
  {
    title: "Video Transcriber",
    url: "/transcribe",
    icon: FileText,
    badge: "NEW"
  }
];