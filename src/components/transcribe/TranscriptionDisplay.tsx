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
    <Card className="p-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Original Transcription</h3>
          <Button
            onClick={onGenerateVariation}
            disabled={isGenerating}
            variant="secondary"
            size="sm"
            className="h-8"
          >
            {isGenerating ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Wand2 className="mr-2 h-4 w-4" />
            )}
            Create New Script
          </Button>
        </div>
        <div className="bg-muted/50 p-3 rounded-md">
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{transcription}</p>
        </div>
      </div>
    </Card>
  );
}