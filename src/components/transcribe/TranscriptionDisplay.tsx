import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Wand2, Loader2, Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(transcription);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Transcription copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to copy transcription to clipboard",
      });
    }
  };

  return (
    <Card className="p-3 md:p-4">
      <div className="space-y-3 md:space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
          <h3 className="text-base md:text-lg font-medium">Original Transcription</h3>
          <div className="flex items-center gap-2">
            <Button
              onClick={handleCopyToClipboard}
              variant="outline"
              size="sm"
              className="h-7 md:h-8 text-xs md:text-sm"
            >
              {copied ? (
                <Check className="h-3 w-3 md:h-4 md:w-4" />
              ) : (
                <Copy className="h-3 w-3 md:h-4 md:w-4" />
              )}
              <span className="ml-1.5 md:ml-2">{copied ? "Copied!" : "Copy"}</span>
            </Button>
            <Button
              onClick={onGenerateVariation}
              disabled={isGenerating}
              variant="secondary"
              size="sm"
              className="h-7 md:h-8 text-xs md:text-sm"
            >
              {isGenerating ? (
                <Loader2 className="mr-1.5 md:mr-2 h-3 w-3 md:h-4 md:w-4 animate-spin" />
              ) : (
                <Wand2 className="mr-1.5 md:mr-2 h-3 w-3 md:h-4 md:w-4" />
              )}
              Create New Script
            </Button>
          </div>
        </div>
        <div className="bg-muted/50 p-2 md:p-3 rounded-md">
          <p className="text-xs md:text-sm leading-relaxed whitespace-pre-wrap">{transcription}</p>
        </div>
      </div>
    </Card>
  );
}