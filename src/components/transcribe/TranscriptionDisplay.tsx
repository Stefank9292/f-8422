import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Wand2, Loader2 } from "lucide-react";

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
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <h3 className="text-xl font-semibold tracking-tight">Original Transcription</h3>
          <Button
            onClick={onGenerateVariation}
            disabled={isGenerating}
            variant="outline"
            className="h-9"
          >
            {isGenerating ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Wand2 className="mr-2 h-4 w-4" />
            )}
            Generate Variation
          </Button>
        </div>
        <div className="bg-muted/50 p-4 rounded-lg">
          <p className="text-sm leading-relaxed">{transcription}</p>
        </div>
      </div>
    </Card>
  );
}