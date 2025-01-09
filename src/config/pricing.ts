import { Atten, Check, X } from "lucide-react";

export const PRICING_CONFIG = {
  premium: {
    name: "Creator Pro",
    description: "For Professional Creators",
    monthly: {
      priceId: "price_1QfKMGGX13ZRG2XiFyskXyJo",
      price: "49"
    },
    annual: {
      priceId: "price_1QfKMYGX13ZRG2XioPYKCe7h",
      total: "470",
      perMonth: "39.17"
    },
    features: [
      { included: true, text: "25 Searches per Month", icon: Atten },
      { included: true, text: "Maximum 25 Results per Username", icon: Atten },
      { included: true, text: "Bulk Search", icon: Check },
      { included: true, text: "Contact Support", icon: Check },
      { included: false, text: "Search History", icon: X },
      { included: false, text: "Recent Searches", icon: X },
      { included: false, text: "Early Access to new Features", icon: X }
    ]
  },
  ultra: {
    name: "Creator on Steroids",
    description: "For Viral Marketing Gods",
    monthly: {
      priceId: "price_1Qdt4NGX13ZRG2XiMWXryAm9",
      price: "69"
    },
    annual: {
      priceId: "price_1Qdt5HGX13ZRG2XiUW80k3Fk",
      total: "663",
      perMonth: "55.25"
    },
    features: [
      { included: true, text: "Unlimited Searches", icon: Check },
      { included: true, text: "Maximum 50 Results per Username", icon: Check },
      { included: true, text: "Bulk Search", icon: Check },
      { included: true, text: "Contact Support", icon: Check },
      { included: true, text: "Search History", icon: Check },
      { included: true, text: "Recent Searches", icon: Check },
      { included: true, text: "Early Access to new Features", icon: Check }
    ]
  }
};