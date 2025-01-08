import { Progress } from "@/components/ui/progress";
import { Shield, ShieldAlert, ShieldCheck } from "lucide-react";

interface PasswordStrength {
  score: number;
  message: string;
  color: string;
}

interface PasswordStrengthIndicatorProps {
  passwordStrength: PasswordStrength;
}

export const PasswordStrengthIndicator = ({ passwordStrength }: PasswordStrengthIndicatorProps) => {
  const getIcon = () => {
    if (passwordStrength.score >= 100) {
      return <ShieldCheck className="h-4 w-4 text-green-500" />;
    } else if (passwordStrength.score >= 50) {
      return <Shield className="h-4 w-4 text-yellow-500" />;
    }
    return <ShieldAlert className="h-4 w-4 text-red-500" />;
  };

  return (
    <div 
      className="space-y-2 animate-in fade-in duration-300 mt-2"
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center space-x-2">
        {getIcon()}
        <Progress 
          value={passwordStrength.score} 
          className={`h-2 flex-1 ${passwordStrength.color} shadow-sm transition-all duration-300`}
          aria-label="Password strength indicator"
        />
      </div>
      <p className="text-sm text-muted-foreground font-medium flex items-center gap-1">
        {passwordStrength.message}
      </p>
    </div>
  );
};