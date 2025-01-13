import { PricingCard } from "@/components/pricing/PricingCard";

const Subscribe = () => {
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
            title="Free"
            description="Basic features for personal use"
            price="$0"
            features={[
              "Limited searches per day",
              "Basic analytics",
              "Standard support"
            ]}
            buttonText="Get Started"
            priceId=""
          />
          <PricingCard
            title="Premium"
            description="Advanced features for creators"
            price="$9.99"
            features={[
              "Unlimited searches",
              "Advanced analytics",
              "Priority support",
              "Export data"
            ]}
            buttonText="Subscribe Now"
            priceId="price_1QdBd2DoPDXfOSZFnG8aWuIq"
            popular
          />
          <PricingCard
            title="Ultra"
            description="Ultimate features for power users"
            price="$19.99"
            features={[
              "Everything in Premium",
              "API access",
              "Custom analytics",
              "24/7 support"
            ]}
            buttonText="Subscribe Now"
            priceId="price_1QdC54DoPDXfOSZFXHBO4yB3"
          />
        </div>
      </div>
    </div>
  );
};

export default Subscribe;