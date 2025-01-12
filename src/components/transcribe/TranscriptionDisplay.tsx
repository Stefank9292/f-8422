import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Wand2 } from "lucide-react";

interface TranscriptionDisplayProps {
  transcription: string;
  onGenerateVariation: () => Promise<void>;
  isGenerating: boolean;
}

export function TranscriptionDisplay({ 
  transcription, 
  onGenerateVariation,
  isGenerating 
}: TranscriptionDisplayProps) {
  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Original Transcription</h3>
        <Button
          onClick={onGenerateVariation}
          disabled={isGenerating}
          variant="outline"
          size="sm"
        >
          <Wand2 className="mr-2 h-4 w-4" />
          Generate Variation
        </Button>
      </div>
      <div className="bg-muted p-4 rounded-md">
        <p className="whitespace-pre-wrap">{transcription}</p>
      </div>
    </Card>
  );
}