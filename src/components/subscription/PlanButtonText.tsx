import { FC } from 'react';
import { Zap } from 'lucide-react';

interface PlanButtonTextProps {
  text: string;
  isUpgrade?: boolean;
  showThunderbolt?: boolean;
}

export const PlanButtonText: FC<PlanButtonTextProps> = ({ text, isUpgrade, showThunderbolt }) => {
  return (
    <div className="flex items-center gap-1.5">
      {showThunderbolt && <Zap className="h-3.5 w-3.5" />}
      <span>{text}</span>
    </div>
  );
};