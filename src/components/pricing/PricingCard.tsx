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
        { included: false, text: "Early Access to new Features" }
      ];
    } else if (priceId === "price_1QdBd2DoPDXfOSZFnG8aWuIq") {
      return [
        { included: true, text: "25 Total Searches" },
        { included: true, text: "Maximum 20 Results per Search" },
        { included: true, text: "Bulk Search" },
        { included: true, text: "Contact Support" },
        { included: false, text: "Early Access to new Features" }
      ];
    } else {
      return [
        { included: true, text: "Unlimited Searches" },
        { included: true, text: "Maximum 50 Results per Search" },
        { included: true, text: "Bulk Search" },
        { included: true, text: "Contact Support" },
        { included: true, text: "Early Access to new Features" }
      ];
    }
  };

  return (
    <Card 
      className={`p-6 space-y-6 relative max-w-sm mx-auto w-full transition-all duration-300 
        ${isPopular ? 'border-2 border-primary ring-4 ring-primary/20 shadow-xl scale-105 bg-card/50 backdrop-blur-sm' : ''}`}
    >
      {isPopular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <Badge 
            variant="default" 
            className="bg-primary text-primary-foreground px-4 py-1 text-[11px] font-medium shadow-lg animate-pulse"
          >
            Most Popular
          </Badge>
        </div>
      )}
      <div className="space-y-3">
        <h2 className={`text-lg font-semibold ${isPopular ? 'text-primary' : ''}`}>{name}</h2>
        <p className="text-[11px] text-muted-foreground leading-relaxed">{description}</p>
        <div className={`text-xl font-bold ${isPopular ? 'text-primary' : ''}`}>
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
        <SubscribeButton planId={priceId} planName={name} />
      </div>
    </Card>
  );
};