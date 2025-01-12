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
    <Card className="p-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Original Transcription</h3>
          <div className="flex items-center gap-2">
            <Button
              onClick={handleCopyToClipboard}
              variant="outline"
              size="sm"
              className="h-8"
            >
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
              <span className="ml-2">{copied ? "Copied!" : "Copy"}</span>
            </Button>
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
        </div>
        <div className="bg-muted/50 p-3 rounded-md">
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{transcription}</p>
        </div>
      </div>
    </Card>
  );
}