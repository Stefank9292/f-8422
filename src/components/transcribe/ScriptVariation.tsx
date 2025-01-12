import { Card } from "@/components/ui/card";

interface ScriptVariationProps {
  variation: string;
}

export function ScriptVariation({ variation }: ScriptVariationProps) {
  return (
    <Card className="p-6 space-y-4">
      <h3 className="text-lg font-semibold">Script Variation</h3>
      <div className="bg-muted p-4 rounded-md">
        <p className="whitespace-pre-wrap">{variation}</p>
      </div>
    </Card>
  );
}