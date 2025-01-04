import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { PricingCard } from "@/components/pricing/PricingCard";

const PricingPage = () => {
  const [isAnnual, setIsAnnual] = useState(false);

  const pricingPlans = [
    {
      name: "Free Plan",
      description: "Get started for free",
      price: {
        monthly: "0",
        annual: { total: "0", perMonth: "0" }
      },
      features: [
        { included: true, text: "3 Total Searches" },
        { included: true, text: "Maximum 5 Results per Search" },
        { included: false, text: "Bulk Search" },
        { included: false, text: "Contact Support" },
        { included: false, text: "Early Access to new Features" }
      ],
      priceId: "free"
    },
    {
      name: "Creator Pro",
      description: "For Professional Creators",
      price: {
        monthly: "29.97",
        annual: { total: "287.64", perMonth: "23.97" }
      },
      features: [
        { included: true, text: "25 Total Searches" },
        { included: true, text: "Maximum 20 Results per Search" },
        { included: true, text: "Bulk Search" },
        { included: true, text: "Contact Support" },
        { included: false, text: "Early Access to new Features" }
      ],
      priceId: isAnnual ? "price_1QdHTrDoPDXfOSZFhVlGuUAd" : "price_1QdBd2DoPDXfOSZFnG8aWuIq"
    },
    {
      name: "Creator on Steroids",
      description: "For Viral Marketing Gods",
      price: {
        monthly: "34.97",
        annual: { total: "335.64", perMonth: "27.97" }
      },
      features: [
        { included: true, text: "Unlimited Searches" },
        { included: true, text: "Maximum 50 Results per Search" },
        { included: true, text: "Bulk Search" },
        { included: true, text: "Contact Support" },
        { included: true, text: "Early Access to new Features" }
      ],
      isPopular: true,
      priceId: isAnnual ? "price_1QdHUGDoPDXfOSZFGaGscfw5" : "price_1QdC54DoPDXfOSZFXHBO4yB3"
    }
  ];

  return (
    <div className="min-h-screen p-4 bg-background">
      <div className="max-w-7xl mx-auto space-y-12 pt-8">
        <div className="text-center space-y-6">
          <h1 className="text-4xl font-bold tracking-tight">Choose Your Plan</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Select the plan that best fits your needs
          </p>
        </div>

        <div className="space-y-8">
          <div className="flex items-center justify-center gap-4">
            <span className={!isAnnual ? "font-semibold" : "text-muted-foreground"}>
              Monthly
            </span>
            <Switch
              checked={isAnnual}
              onCheckedChange={setIsAnnual}
            />
            <div className="flex items-center gap-2">
              <span className={isAnnual ? "font-semibold" : "text-muted-foreground"}>
                Annual
              </span>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Save 20%
              </Badge>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {pricingPlans.map((plan, index) => (
              <PricingCard
                key={index}
                {...plan}
                isAnnual={isAnnual}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;