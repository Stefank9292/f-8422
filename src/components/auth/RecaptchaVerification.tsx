import ReCAPTCHA from "react-google-recaptcha";
import { useRecaptchaSiteKey } from "@/hooks/useRecaptchaSiteKey";

interface RecaptchaVerificationProps {
  onVerify: (token: string | null) => void;
}

export const RecaptchaVerification = ({ onVerify }: RecaptchaVerificationProps) => {
  const { data: siteKey, isLoading, error } = useRecaptchaSiteKey();

  if (isLoading) {
    return <div>Loading verification...</div>;
  }

  if (error || !siteKey) {
    console.error('ReCAPTCHA site key error:', error);
    return (
      <div className="text-red-500">
        Error: ReCAPTCHA configuration is missing. Please contact support.
      </div>
    );
  }

  return (
    <div className="flex justify-center my-4">
      <ReCAPTCHA
        sitekey={siteKey}
        onChange={onVerify}
        theme="dark"
      />
    </div>
  );
};