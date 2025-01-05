import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

interface PricingCardProps {
  title: string;
  price: string;
  description: string;
  features: {
    name: string;
    included: boolean;
  }[];
  buttonText: string;
  onClick: () => void;
  popular?: boolean;
  loading?: boolean;
  isAnnual?: boolean;
  name?: string;
  priceId?: string;
}

export const PricingCard = ({
  title,
  price,
  description,
  features,
  buttonText,
  onClick,
  popular = false,
  loading = false,
}: PricingCardProps) => {
  const getFeatures = () => {
    if (title === "Free") {
      return [
        { name: "5 videos per profile", included: true },
        { name: "Single profile search", included: true },
        { name: "Bulk search (up to 5 profiles)", included: true },
        { name: "Contact support", included: true },
        { name: "Search history, recent searches", included: false },
      ];
    }
    if (title === "Creator Pro") {
      return [
        { name: "20 videos per profile", included: true },
        { name: "Single profile search", included: true },
        { name: "Bulk search (up to 10 profiles)", included: true },
        { name: "Contact support", included: true },
        { name: "Search history, recent searches", included: false },
      ];
    }
    return [
      { name: "50 videos per profile", included: true },
      { name: "Single profile search", included: true },
      { name: "Bulk search (up to 20 profiles)", included: true },
      { name: "Contact support", included: true },
      { name: "Search history, recent searches", included: true },
    ];
  };

  return (
    <Card className={`w-full ${popular ? 'border-primary shadow-lg' : ''}`}>
      <CardHeader className="p-6">
        <div className="space-y-2">
          <h3 className="font-semibold">{title}</h3>
          <div className="space-y-1">
            <p className="text-2xl font-bold">{price}</p>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        <ul className="space-y-3">
          {getFeatures().map((feature, i) => (
            <li key={i} className="flex items-center gap-2">
              {feature.included ? (
                <Check className="w-4 h-4 text-primary" />
              ) : (
                <X className="w-4 h-4 text-destructive" />
              )}
              <span className="text-sm">{feature.name}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <Button
          onClick={onClick}
          className="w-full primary-gradient"
          disabled={loading}
        >
          {buttonText}
        </Button>
      </CardFooter>
    </Card>
  );
};