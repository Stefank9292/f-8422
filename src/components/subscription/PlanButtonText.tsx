import { FC } from 'react';

interface PlanButtonTextProps {
  text: string;
  isUpgrade?: boolean;
}

export const PlanButtonText: FC<PlanButtonTextProps> = ({ text, isUpgrade }) => {
  if (!isUpgrade) return <span>{text}</span>;
  
  return (
    <span className="bg-gradient-to-r from-[#D946EF] via-[#E1306C] to-[#F97316] text-transparent bg-clip-text animate-synchronized-pulse">
      {text}
    </span>
  );
};