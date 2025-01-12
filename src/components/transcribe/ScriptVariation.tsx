import { Card } from "@/components/ui/card";

interface ScriptVariationProps {
  variation: string;
}

export function ScriptVariation({ variation }: ScriptVariationProps) {
  return (
    <Card className="p-6 md:p-8 space-y-6">
      <h3 className="text-xl font-semibold tracking-tight">Script Variation</h3>
      <div className="bg-muted/50 p-6 md:p-8 rounded-lg">
        <p className="whitespace-pre-wrap text-base md:text-lg leading-relaxed">{variation}</p>
      </div>
    </Card>
  );
}