import { Info } from "lucide-react";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";

interface ReadabilityScoreProps {
  score: number;
}

export function ReadabilityScore({ score }: ReadabilityScoreProps) {
  const getScoreColor = (score: number): string => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-green-400";
    if (score >= 40) return "text-yellow-500";
    if (score >= 20) return "text-orange-500";
    return "text-red-500";
  };

  return (
    <div className="flex items-center gap-2">
      <span className={`text-sm font-medium ${getScoreColor(score)}`}>
        {score}/100
      </span>
      <HoverCard>
        <HoverCardTrigger asChild>
          <Info className="h-4 w-4 text-muted-foreground cursor-help" />
        </HoverCardTrigger>
        <HoverCardContent className="w-64 text-[11px] space-y-1.5">
          <p>Score based on sentence length and word complexity - higher scores indicate better readability.</p>
          <div className="space-y-0.5">
            <p className="text-green-500">80-100: Very readable</p>
            <p className="text-green-400">60-79: Good readability</p>
            <p className="text-yellow-500">40-59: Moderate readability</p>
            <p className="text-orange-500">20-39: Poor readability</p>
            <p className="text-red-500">0-19: Very poor readability</p>
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  );
}