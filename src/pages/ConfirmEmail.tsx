import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Mail, ArrowLeft, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const ConfirmEmail = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isResending, setIsResending] = useState(false);

  const handleResendEmail = async () => {
    setIsResending(true);
    const { error } = await supabase.auth.resend({
      type: 'signup'
    });

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Email Sent",
        description: "A new confirmation email has been sent to your inbox.",
      });
    }
    setIsResending(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="max-w-md w-full space-y-8 animate-in fade-in duration-500">
        <Button
          variant="ghost"
          className="mb-8"
          onClick={() => navigate("/auth")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Sign In
        </Button>

        <div className="space-y-6 text-center">
          <Mail className="mx-auto h-12 w-12 text-primary" />
          <h1 className="text-2xl font-semibold tracking-tight">
            Check your inbox
          </h1>
          
          <div className="space-y-4 text-muted-foreground">
            <p>
              We've sent you a confirmation email. Click the link in the email to verify your account.
            </p>
            
            <div className="bg-secondary/50 rounded-lg p-4 text-left space-y-2">
              <p className="font-medium text-foreground">Next steps:</p>
              <ol className="list-decimal list-inside space-y-2">
                <li>Open your email inbox</li>
                <li>Look for an email from VyralSearch</li>
                <li>Click the "Confirm Email" button in the email</li>
                <li>If you can't find the email, check your spam folder</li>
              </ol>
            </div>
          </div>

          <div className="pt-4 space-y-4">
            <Button
              onClick={handleResendEmail}
              disabled={isResending}
              className="w-full"
            >
              {isResending ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                "Resend Confirmation Email"
              )}
            </Button>

            <p className="text-sm text-muted-foreground">
              Need help? Contact us at{" "}
              <a
                href="mailto:support@vyralsearch.com"
                className="text-primary hover:underline"
              >
                support@vyralsearch.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmEmail;