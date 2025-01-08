import ReCAPTCHA from "react-google-recaptcha";

interface RecaptchaVerificationProps {
  onVerify: (token: string | null) => void;
}

export const RecaptchaVerification = ({ onVerify }: RecaptchaVerificationProps) => {
  const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

  if (!siteKey) {
    console.error('ReCAPTCHA site key is missing');
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