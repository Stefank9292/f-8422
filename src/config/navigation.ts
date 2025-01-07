import { Search, History } from "lucide-react";
import { NavItem } from "@/types/navigation";

export const NAV_ITEMS: NavItem[] = [
  {
    title: "Viral Video Search",
    path: "/",
    icon: Search,
    badge: "BETA"
  },
  {
    title: "Search History",
    path: "/history",
    icon: History
  }
];