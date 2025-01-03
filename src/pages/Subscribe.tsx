import { SubscribeButton } from "@/components/SubscribeButton";

const SubscribePage = () => {
  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto space-y-8 pt-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Upgrade to Premium</h1>
          <p className="text-xl text-muted-foreground">
            Get access to all premium features and content
          </p>
        </div>

        <div className="bg-card border rounded-lg p-8 space-y-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Premium Plan Features</h2>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <CheckIcon className="h-5 w-5 text-green-500" />
                <span>Feature 1</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckIcon className="h-5 w-5 text-green-500" />
                <span>Feature 2</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckIcon className="h-5 w-5 text-green-500" />
                <span>Feature 3</span>
              </li>
            </ul>
          </div>
          
          <div className="pt-4">
            <SubscribeButton />
          </div>
        </div>
      </div>
    </div>
  );
};

const CheckIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export default SubscribePage;