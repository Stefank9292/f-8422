import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X, AlertTriangle } from "lucide-react";
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

const FeatureItem = ({ included, text, priceId }: { included: boolean; text: string; priceId: string }) => {
  const isProPlan = priceId === "price_1Qdt2dGX13ZRG2XiaKwG6VPu" || priceId === "price_1Qdt3tGX13ZRG2XiesasShEJ";
  const shouldShowWarning = isProPlan && included && (
    text === "25 Total Searches per Month" || 
    text === "Maximum 25 Results per Username"
  );

  return (
    <li className="flex items-center gap-2">
      {!included ? (
        <X className="h-3.5 w-3.5 text-red-500" />
      ) : shouldShowWarning ? (
        <AlertTriangle className="h-3.5 w-3.5 text-yellow-500 dark:text-yellow-400" />
      ) : (
        <Check className="h-3.5 w-3.5 text-green-500 dark:text-green-400" />
      )}
      <span className="text-[11px] dark:text-gray-300">{text}</span>
    </li>
  );
};

export const PricingCard = ({
  name,
  description,
  price,
  isPopular,
  isAnnual,
  priceId,
}: PricingCardProps) => {
  const getFeatures = () => {
    if (priceId === "price_1Qdt2dGX13ZRG2XiaKwG6VPu" || priceId === "price_1Qdt3tGX13ZRG2XiesasShEJ") {
      return [
        { included: true, text: "25 Total Searches per Month" },
        { included: true, text: "Maximum 25 Results per Username" },
        { included: true, text: "Bulk Search" },
        { included: true, text: "Contact Support" },
        { included: false, text: "Search History" },
        { included: false, text: "Recent Searches" },
        { included: false, text: "Early Access to new Features" }
      ];
    } else {
      return [
        { included: true, text: "Unlimited Searches" },
        { included: true, text: "Maximum 50 Results per Username" },
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
        ${isPopular ? 'border-2 border-rose-400 ring-4 ring-rose-400/20 shadow-xl scale-105 bg-card/50 backdrop-blur-sm dark:bg-card/30 dark:shadow-none' : 'dark:bg-card/10 dark:border-border/10'}`}
    >
      <div className="space-y-3">
        <div className="flex items-center gap-1.5">
          <h2 className={`text-lg font-semibold ${isPopular ? 'instagram-gradient bg-clip-text text-transparent animate-synchronized-pulse' : 'dark:text-gray-100'}`}>
            {name}
          </h2>
        </div>
        <p className="text-[11px] text-muted-foreground leading-relaxed dark:text-gray-400">{description}</p>
        <div className={`text-xl font-bold ${isPopular ? 'instagram-gradient bg-clip-text text-transparent animate-synchronized-pulse' : 'dark:text-gray-100'}`}>
          {isAnnual ? (
            <>
              ${price.annual.total}/year
              <span className="text-[11px] text-muted-foreground ml-2 dark:text-gray-400">(${price.annual.perMonth}/mo)</span>
            </>
          ) : (
            `$${price.monthly}/mo`
          )}
        </div>
      </div>
      <ul className="space-y-3 pt-2">
        {getFeatures().map((feature, index) => (
          <FeatureItem key={index} {...feature} priceId={priceId} />
        ))}
      </ul>
      <div className="pt-6">
        <SubscribeButton planId={priceId} planName={name} isPopular={isPopular} isAnnual={isAnnual} />
      </div>
    </Card>
  );
};