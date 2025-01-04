import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/layout/PageHeader";

const HelpCenter = () => {
  return (
    <PageContainer>
      <PageHeader 
        title="Help Center" 
        description="Get help with using our service."
      />
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">How can we assist you?</h2>
        <p>If you have any questions or need assistance, please check the following resources:</p>
        <ul className="list-disc list-inside space-y-2">
          <li><strong>Documentation:</strong> Visit our <a href="/docs" className="text-blue-500">documentation</a> for detailed guides.</li>
          <li><strong>Support:</strong> Contact our support team via the <a href="/support" className="text-blue-500">support page</a>.</li>
          <li><strong>Community:</strong> Join our community forum to connect with other users.</li>
        </ul>
        <p>We are here to help you!</p>
      </div>
    </PageContainer>
  );
};

export default HelpCenter;
