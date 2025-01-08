import { Progress } from "@/components/ui/progress";

interface PasswordStrength {
  score: number;
  message: string;
  color: string;
}

interface PasswordStrengthIndicatorProps {
  passwordStrength: PasswordStrength;
}

export const PasswordStrengthIndicator = ({ passwordStrength }: PasswordStrengthIndicatorProps) => {
  return (
    <div className="space-y-2 animate-in fade-in duration-300">
      <Progress 
        value={passwordStrength.score} 
        className={`h-2 rounded-full ${passwordStrength.color} shadow-sm`}
        aria-label="Password strength indicator"
      />
      <p className="text-sm text-muted-foreground font-medium">
        {passwordStrength.message}
      </p>
    </div>
  );
};