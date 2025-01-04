import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/layout/PageHeader";

const Subscribe = () => {
  return (
    <PageContainer>
      <PageHeader 
        title="Subscription Plans" 
        description="Choose a plan that works for you."
      />
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Our Plans</h2>
        <p className="text-muted-foreground">
          We offer a variety of subscription plans to suit your needs. Choose the one that works best for you.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="border rounded-lg p-4 shadow-md">
            <h3 className="text-xl font-bold">Basic Plan</h3>
            <p className="text-lg">$9.99/month</p>
            <p>Access to basic features.</p>
            <button className="mt-4 w-full bg-primary text-white py-2 rounded">Subscribe</button>
          </div>
          <div className="border rounded-lg p-4 shadow-md">
            <h3 className="text-xl font-bold">Standard Plan</h3>
            <p className="text-lg">$19.99/month</p>
            <p>Access to all features.</p>
            <button className="mt-4 w-full bg-primary text-white py-2 rounded">Subscribe</button>
          </div>
          <div className="border rounded-lg p-4 shadow-md">
            <h3 className="text-xl font-bold">Premium Plan</h3>
            <p className="text-lg">$29.99/month</p>
            <p>Access to premium features and priority support.</p>
            <button className="mt-4 w-full bg-primary text-white py-2 rounded">Subscribe</button>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default Subscribe;
