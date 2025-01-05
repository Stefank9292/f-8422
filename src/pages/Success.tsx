import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Success = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    toast({
      title: "Payment Successful",
      description: "Thank you for your subscription!",
    });
  }, [toast]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 text-center animate-in fade-in duration-500">
        <div className="space-y-4">
          <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
          <h1 className="text-2xl font-semibold tracking-tight">
            Payment Successful!
          </h1>
          <p className="text-muted-foreground text-sm">
            Thank you for subscribing. You now have access to all premium features.
          </p>
        </div>
        
        <Button
          onClick={() => navigate("/")}
          className="w-full max-w-xs mx-auto instagram-gradient"
        >
          <Search className="mr-2 h-4 w-4" />
          Start Searching Videos
        </Button>
      </div>
    </div>
  );
};

export default Success;