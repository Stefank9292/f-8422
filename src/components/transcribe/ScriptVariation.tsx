import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ReadabilityScore } from "./components/ReadabilityScore";

interface ScriptVariationProps {
  variation: string;
}

export function ScriptVariation({ variation }: ScriptVariationProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const calculateReadabilityScore = (text: string): number => {
    const sentences = text.split(/[.!?]+/).filter(Boolean);
    const words = text.split(/\s+/).filter(Boolean);
    
    const avgWordsPerSentence = words.length / sentences.length;
    const avgCharsPerWord = text.length / words.length;
    
    const sentenceScore = Math.min(100, (avgWordsPerSentence / 20) * 100);
    const wordScore = Math.min(100, (5 / avgCharsPerWord) * 100);
    
    const finalScore = Math.round((sentenceScore + wordScore) / 2);
    return Math.min(100, Math.max(0, finalScore));
  };

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(variation);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Script copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to copy script to clipboard",
      });
    }
  };

  const readabilityScore = calculateReadabilityScore(variation);

  return (
    <Card className="p-3 md:p-4 space-y-3 md:space-y-4">
      <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div className="flex items-center gap-3">
          <h3 className="text-base md:text-lg font-medium">Generated Script</h3>
          <ReadabilityScore score={readabilityScore} />
        </div>
        <Button
          onClick={handleCopyToClipboard}
          variant="outline"
          size="sm"
          className="h-8 md:h-9 text-xs md:text-sm flex-1 sm:flex-none"
        >
          {copied ? (
            <Check className="h-3.5 w-3.5 md:h-4 md:w-4" />
          ) : (
            <Copy className="h-3.5 w-3.5 md:h-4 md:w-4" />
          )}
          <span className="ml-1.5 md:ml-2">{copied ? "Copied!" : "Copy"}</span>
        </Button>
      </div>
      <div className="bg-muted rounded-lg p-4">
        <div className="text-sm md:text-base leading-relaxed">
          {variation}
        </div>
      </div>
    </Card>
  );
}