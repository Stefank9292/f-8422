import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";
import { SubscribeButton } from "@/components/SubscribeButton";

interface PricingCardProps {
  name: string;
  description: string;
  price: {
    monthly: string;
    annual: {
      total: string;
      perMonth: string;
    };
  };
  features: Array<{
    included: boolean;
    text: string;
  }>;
  isPopular?: boolean;
  isAnnual: boolean;
  priceId: string;
}

const FeatureItem = ({ included, text }: { included: boolean; text: string }) => (
  <li className="flex items-center gap-2">
    {included ? (
      <Check className="h-3.5 w-3.5 text-green-500" />
    ) : (
      <X className="h-3.5 w-3.5 text-red-500" />
    )}
    <span className={`text-[11px] ${!included ? "text-muted-foreground" : ""}`}>{text}</span>
  </li>
);

export const PricingCard = ({
  name,
  description,
  price,
  isPopular,
  isAnnual,
  priceId,
}: PricingCardProps) => {
  const getFeatures = () => {
    if (priceId === 'free') {
      return [
        { included: true, text: "3 Total Searches" },
        { included: true, text: "Maximum 5 Results per Search" },
        { included: false, text: "Bulk Search" },
        { included: false, text: "Contact Support" },
        { included: false, text: "Search History" },
        { included: false, text: "Recent Searches" },
        { included: false, text: "Early Access to new Features" }
      ];
    } else if (priceId === "price_1QdtwnGX13ZRG2XihcM36r3W" || priceId === "price_1Qdtx2GX13ZRG2XieXrqPxAV") {
      return [
        { included: true, text: "25 Total Searches" },
        { included: true, text: "Maximum 25 Results per Search" },
        { included: true, text: "Bulk Search" },
        { included: true, text: "Contact Support" },
        { included: false, text: "Search History" },
        { included: false, text: "Recent Searches" },
        { included: false, text: "Early Access to new Features" }
      ];
    } else {
      return [
        { included: true, text: "Unlimited Searches" },
        { included: true, text: "Maximum 50 Results per Search" },
        { included: true, text: "Bulk Search" },
        { included: true, text: "Contact Support" },
        { included: true, text: "Search History" },
        { included: true, text: "Recent Searches" },
        { included: true, text: "Early Access to new Features" }
      ];
    }
  };

  return (
    <Card 
      className={`p-6 space-y-6 relative w-[280px] transition-all duration-300 
        ${isPopular ? 'border-2 border-rose-400 ring-4 ring-rose-400/20 shadow-xl scale-105 bg-card/50 backdrop-blur-sm' : ''}`}
    >
      <div className="space-y-3">
        <div className="flex items-center gap-1.5">
          <h2 className={`text-lg font-semibold ${isPopular ? 'instagram-gradient bg-clip-text text-transparent animate-synchronized-pulse' : ''}`}>
            {name}
          </h2>
        </div>
        <p className="text-[11px] text-muted-foreground leading-relaxed">{description}</p>
        <div className={`text-xl font-bold ${isPopular ? 'instagram-gradient bg-clip-text text-transparent animate-synchronized-pulse' : ''}`}>
          {isAnnual ? (
            <>
              ${price.annual.total}/year
              <span className="text-[11px] text-muted-foreground ml-2">(${price.annual.perMonth}/mo)</span>
            </>
          ) : (
            `$${price.monthly}/mo`
          )}
        </div>
      </div>
      <ul className="space-y-3 pt-2">
        {getFeatures().map((feature, index) => (
          <FeatureItem key={index} {...feature} />
        ))}
      </ul>
      <div className="pt-6">
        <SubscribeButton planId={priceId} planName={name} isPopular={isPopular} isAnnual={isAnnual} />
      </div>
    </Card>
  );
};