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
    <Card className="p-6 md:p-8 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h3 className="text-2xl font-semibold tracking-tight">Original Transcription</h3>
        <Button
          onClick={onGenerateVariation}
          disabled={isGenerating}
          variant="outline"
          size="lg"
          className="material-button-secondary"
        >
          {isGenerating ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Wand2 className="mr-2 h-4 w-4" />
          )}
          Generate Variation
        </Button>
      </div>
      <div className="bg-muted/50 p-6 md:p-8 rounded-lg">
        <p className="whitespace-pre-wrap text-base md:text-lg leading-relaxed">{transcription}</p>
      </div>
    </Card>
  );
}