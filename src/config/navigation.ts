import { Instagram, History, FileText, Twitter, Youtube } from "lucide-react";
import { TikTokIcon } from "@/components/icons/TikTokIcon";
import { NavItem } from "@/types/navigation";

export const NAV_ITEMS: NavItem[] = [
  {
    title: "Instagram Search",
    url: "/",
    icon: Instagram,
    badge: "LIVE"
  },
  {
    title: "TikTok Search",
    url: "/tiktok",
    icon: TikTokIcon,
    badge: "BETA",
    showWhen: (subscriptionStatus) => {
      return subscriptionStatus?.priceId && [
        "price_1QfKMGGX13ZRG2XiFyskXyJo", // Creator Pro Monthly
        "price_1QfKMYGX13ZRG2XioPYKCe7h", // Creator Pro Annual
        "price_1Qdt4NGX13ZRG2XiMWXryAm9", // Creator on Steroids Monthly
        "price_1Qdt5HGX13ZRG2XiUW80k3Fk"  // Creator on Steroids Annual
      ].includes(subscriptionStatus.priceId);
    }
  },
  {
    title: "Search History",
    url: "/history",
    icon: History,
    showWhen: (subscriptionStatus) => {
      return subscriptionStatus?.priceId && [
        "price_1QfKMGGX13ZRG2XiFyskXyJo", // Creator Pro Monthly
        "price_1QfKMYGX13ZRG2XioPYKCe7h", // Creator Pro Annual
        "price_1Qdt4NGX13ZRG2XiMWXryAm9", // Creator on Steroids Monthly
        "price_1Qdt5HGX13ZRG2XiUW80k3Fk"  // Creator on Steroids Annual
      ].includes(subscriptionStatus.priceId);
    }
  },
  {
    title: "Script Generator",
    url: "/transcribe",
    icon: FileText,
    badge: "NEW",
    showWhen: (subscriptionStatus) => {
      return subscriptionStatus?.priceId && [
        "price_1QfKMGGX13ZRG2XiFyskXyJo", // Creator Pro Monthly
        "price_1QfKMYGX13ZRG2XioPYKCe7h", // Creator Pro Annual
        "price_1Qdt4NGX13ZRG2XiMWXryAm9", // Creator on Steroids Monthly
        "price_1Qdt5HGX13ZRG2XiUW80k3Fk"  // Creator on Steroids Annual
      ].includes(subscriptionStatus.priceId);
    }
  },
  {
    title: "Twitter Search",
    url: "#",
    icon: Twitter,
    className: "opacity-60 cursor-not-allowed"
  },
  {
    title: "YouTube Search",
    url: "#",
    icon: Youtube,
    className: "opacity-60 cursor-not-allowed"
  }
];