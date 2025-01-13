import { PricingCard } from "@/components/pricing/PricingCard";
import { useState } from "react";

const Subscribe = () => {
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <div className="min-h-screen bg-background md:pt-12 pt-24 pb-8 md:pb-12">
      <div className="container max-w-6xl mx-auto px-4 md:px-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Choose Your Plan
          </h1>
          <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
            Select the perfect plan for your needs
          </p>
        </div>
        <div className="grid gap-6 mt-8 md:mt-12 lg:grid-cols-3">
          <PricingCard
            name="Free"
            description="Basic features for personal use"
            price={{
              monthly: "0",
              annual: {
                total: "0",
                perMonth: "0"
              }
            }}
            isAnnual={isAnnual}
            priceId=""
          />
          <PricingCard
            name="Premium"
            description="Advanced features for creators"
            price={{
              monthly: "9.99",
              annual: {
                total: "99.99",
                perMonth: "8.33"
              }
            }}
            isAnnual={isAnnual}
            priceId="price_1QfKMGGX13ZRG2XiFyskXyJo"
            isPopular={true}
          />
          <PricingCard
            name="Ultra"
            description="Ultimate features for power users"
            price={{
              monthly: "19.99",
              annual: {
                total: "199.99",
                perMonth: "16.67"
              }
            }}
            isAnnual={isAnnual}
            priceId="price_1QfKMYGX13ZRG2XioPYKCe7h"
          />
        </div>
      </div>
    </div>
  );
};

export default Subscribe;