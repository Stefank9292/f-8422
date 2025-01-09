import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

interface PricingToggleProps {
  isAnnual: boolean;
  onToggle: (checked: boolean) => void;
}

export const PricingToggle = ({ isAnnual, onToggle }: PricingToggleProps) => {
  return (
    <div className="flex items-center justify-center gap-4">
      <span className={`text-[11px] ${!isAnnual ? "text-foreground" : "text-muted-foreground"}`}>
        Monthly
      </span>
      <Switch
        checked={isAnnual}
        onCheckedChange={onToggle}
        className="scale-90"
      />
      <div className="flex items-center gap-2">
        <span className={`text-[11px] ${isAnnual ? "text-foreground" : "text-muted-foreground"}`}>
          Annual
        </span>
        <Badge variant="secondary" className="text-[10px] bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
          Save 20%
        </Badge>
      </div>
    </div>
  );
};