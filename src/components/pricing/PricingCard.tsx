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
      <Check className="h-5 w-5 text-green-500" />
    ) : (
      <X className="h-5 w-5 text-red-500" />
    )}
    <span className={!included ? "text-muted-foreground" : ""}>{text}</span>
  </li>
);

export const PricingCard = ({
  name,
  description,
  price,
  features,
  isPopular,
  isAnnual,
  priceId,
}: PricingCardProps) => {
  return (
    <Card className={`p-6 space-y-4 relative ${isPopular ? 'border-2 border-primary ring-2 ring-primary/20 shadow-lg' : ''}`}>
      {isPopular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <Badge variant="default" className="bg-primary text-primary-foreground px-3 py-1">
            Most Popular
          </Badge>
        </div>
      )}
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">{name}</h2>
        <p className="text-muted-foreground">{description}</p>
        <div className="text-2xl font-bold">
          {isAnnual ? (
            <>
              ${price.annual.total}/year
              <span className="text-sm text-muted-foreground ml-2">(${price.annual.perMonth}/mo)</span>
            </>
          ) : (
            `$${price.monthly}/mo`
          )}
        </div>
      </div>
      <ul className="space-y-2">
        {features.map((feature, index) => (
          <FeatureItem key={index} {...feature} />
        ))}
      </ul>
      <div className="pt-4">
        <SubscribeButton planId={priceId} planName={name} />
      </div>
    </Card>
  );
};