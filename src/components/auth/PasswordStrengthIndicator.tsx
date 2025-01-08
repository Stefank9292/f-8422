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
        className={`h-2 ${passwordStrength.color}`}
        aria-label="Password strength indicator"
      />
      <p className="text-sm text-muted-foreground">
        {passwordStrength.message}
      </p>
    </div>
  );
};