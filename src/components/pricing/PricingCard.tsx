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
    <Card className={`p-4 space-y-4 relative ${isPopular ? 'border-2 border-primary ring-2 ring-primary/20 shadow-lg' : ''}`}>
      {isPopular && (
        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
          <Badge variant="default" className="bg-primary text-primary-foreground px-3 py-0.5 text-[10px]">
            Most Popular
          </Badge>
        </div>
      )}
      <div className="space-y-2">
        <h2 className="text-base font-semibold">{name}</h2>
        <p className="text-[11px] text-muted-foreground">{description}</p>
        <div className="text-lg font-bold">
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
      <ul className="space-y-2">
        {getFeatures().map((feature, index) => (
          <FeatureItem key={index} {...feature} />
        ))}
      </ul>
      <div className="pt-4">
        <SubscribeButton planId={priceId} planName={name} />
      </div>
    </Card>
  );
};