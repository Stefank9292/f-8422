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
      { included: true, text: "25 Searches per Month" },
      { included: true, text: "Maximum 25 Results per Username" },
      { included: true, text: "Bulk Search" },
      { included: true, text: "Contact Support" },
      { included: false, text: "Search History" },
      { included: false, text: "Recent Searches" },
      { included: false, text: "Early Access to new Features" }
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
      { included: true, text: "Unlimited Searches" },
      { included: true, text: "Maximum 50 Results per Username" },
      { included: true, text: "Bulk Search" },
      { included: true, text: "Contact Support" },
      { included: true, text: "Search History" },
      { included: true, text: "Recent Searches" },
      { included: true, text: "Early Access to new Features" }
    ]
  }
};