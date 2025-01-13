import { Instagram, History, FileText, Facebook, Twitter, Youtube } from "lucide-react";
import { TikTokIcon } from "@/components/icons/TikTokIcon";
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
  },
  {
    title: "TikTok Search",
    url: "#",
    icon: TikTokIcon,
    badge: "COMING SOON",
    className: "opacity-60 cursor-not-allowed"
  },
  {
    title: "Facebook Search",
    url: "#",
    icon: Facebook,
    badge: "COMING SOON",
    className: "opacity-60 cursor-not-allowed"
  },
  {
    title: "Twitter Search",
    url: "#",
    icon: Twitter,
    badge: "COMING SOON",
    className: "opacity-60 cursor-not-allowed"
  },
  {
    title: "YouTube Search",
    url: "#",
    icon: Youtube,
    badge: "COMING SOON",
    className: "opacity-60 cursor-not-allowed"
  }
];