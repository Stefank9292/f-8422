import { Card } from "@/components/ui/card";

interface ScriptVariationProps {
  variation: string;
}

export function ScriptVariation({ variation }: ScriptVariationProps) {
  return (
    <Card className="p-4 space-y-3">
      <h3 className="text-lg font-medium">Script Variation</h3>
      <div className="bg-muted/50 p-3 rounded-md">
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{variation}</p>
      </div>
    </Card>
  );
}