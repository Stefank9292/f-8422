import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/layout/PageHeader";

const FAQ = () => {
  return (
    <PageContainer>
      <PageHeader 
        title="Frequently Asked Questions" 
        description="Find answers to common questions about our service."
      />
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">What is this service?</h2>
        <p>This service allows you to find viral content on social media platforms quickly and efficiently.</p>

        <h2 className="text-xl font-semibold">How do I use the search feature?</h2>
        <p>Simply enter the Instagram username in the search bar and click on the search button to find posts.</p>

        <h2 className="text-xl font-semibold">What are the subscription plans?</h2>
        <p>We offer various subscription plans that cater to different needs. You can view them on the subscription page.</p>

        <h2 className="text-xl font-semibold">How can I contact support?</h2>
        <p>You can reach out to our support team through the contact form available on the help center page.</p>
      </div>
    </PageContainer>
  );
};

export default FAQ;
