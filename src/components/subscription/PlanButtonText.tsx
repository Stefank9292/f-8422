import { FC } from 'react';

interface PlanButtonTextProps {
  text: string;
  isUpgrade?: boolean;
}

export const PlanButtonText: FC<PlanButtonTextProps> = ({ text, isUpgrade }) => {
  return <span>{text}</span>;
};