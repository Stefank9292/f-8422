import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Check, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";

interface ScriptVariationProps {
  variation: string;
}

export function ScriptVariation({ variation }: ScriptVariationProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const calculateReadabilityScore = (text: string): number => {
    // Simple readability score based on:
    // - Average words per sentence (ideal: 15-20)
    // - Average characters per word (ideal: 4-5)
    // - Presence of common transition words
    
    const sentences = text.split(/[.!?]+/).filter(Boolean);
    const words = text.split(/\s+/).filter(Boolean);
    
    const avgWordsPerSentence = words.length / sentences.length;
    const avgCharsPerWord = text.length / words.length;
    
    // Normalize scores
    const sentenceScore = Math.min(100, (avgWordsPerSentence / 20) * 100);
    const wordScore = Math.min(100, (5 / avgCharsPerWord) * 100);
    
    // Calculate final score (0-100)
    const finalScore = Math.round((sentenceScore + wordScore) / 2);
    return Math.min(100, Math.max(0, finalScore));
  };

  const getScoreColor = (score: number): string => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-green-400";
    if (score >= 40) return "text-yellow-500";
    if (score >= 20) return "text-orange-500";
    return "text-red-500";
  };

  const readabilityScore = calculateReadabilityScore(variation);

  const formatContent = (text: string) => {
    const cleanText = text
      .replace(/\*\*/g, '')
      .replace(/###/g, '')
      .trim();

    const sections = {
      hooks: [] as string[],
      videoScript: '',
      caption: '',
      cta: '',
      explanation: ''
    };

    // Split the text into lines
    const lines = cleanText.split('\n');
    let currentSection = '';

    lines.forEach((line) => {
      const trimmedLine = line.trim();
      
      // Identify sections
      if (trimmedLine === 'Hooks') {
        currentSection = 'hooks';
      } else if (trimmedLine === 'Video Script:') {
        currentSection = 'videoScript';
      } else if (trimmedLine === 'Caption') {
        currentSection = 'caption';
      } else if (trimmedLine === 'CTA') {
        currentSection = 'cta';
      } else if (trimmedLine === 'Explanation of Script') {
        currentSection = 'explanation';
      } else if (trimmedLine) {
        // Process content based on current section
        if (currentSection === 'hooks' && /^\d\./.test(trimmedLine)) {
          sections.hooks.push(trimmedLine.replace(/^\d\.\s*/, '').trim());
        } else if (currentSection === 'videoScript') {
          sections.videoScript += (sections.videoScript ? '\n' : '') + trimmedLine;
        } else if (currentSection === 'caption') {
          sections.caption += (sections.caption ? '\n' : '') + trimmedLine;
        } else if (currentSection === 'cta') {
          sections.cta += (sections.cta ? '\n' : '') + trimmedLine;
        } else if (currentSection === 'explanation') {
          sections.explanation += (sections.explanation ? '\n' : '') + trimmedLine;
        }
      }
    });

    return (
      <div className="space-y-6">
        <div>
          <h4 className="text-base md:text-lg font-semibold text-foreground/80 mb-3">Hooks</h4>
          <div className="space-y-2">
            {sections.hooks.map((hook, index) => (
              <div key={index} className="bg-muted p-3 rounded-md">
                <p className="text-sm md:text-base leading-relaxed">
                  <span className="font-medium text-foreground/70">Hook {index + 1}:</span> {hook}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-base md:text-lg font-semibold text-foreground/80 mb-3">Video Script</h4>
          <div className="bg-muted p-3 rounded-md">
            <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">{sections.videoScript}</p>
          </div>
        </div>

        <div>
          <h4 className="text-base md:text-lg font-semibold text-foreground/80 mb-3">Caption</h4>
          <div className="bg-muted p-3 rounded-md">
            <p className="text-sm md:text-base leading-relaxed">{sections.caption}</p>
          </div>
        </div>

        <div>
          <h4 className="text-base md:text-lg font-semibold text-foreground/80 mb-3">Call to Action</h4>
          <div className="bg-muted p-3 rounded-md">
            <p className="text-sm md:text-base leading-relaxed">{sections.cta}</p>
          </div>
        </div>

        <div>
          <h4 className="text-base md:text-lg font-semibold text-foreground/80 mb-3">Explanation</h4>
          <div className="bg-muted p-3 rounded-md">
            <p className="text-sm md:text-base leading-relaxed">{sections.explanation}</p>
          </div>
        </div>
      </div>
    );
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

  return (
    <Card className="p-3 md:p-4 space-y-3 md:space-y-4">
      <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div className="flex items-center gap-3">
          <h3 className="text-base md:text-lg font-medium">Generated Script</h3>
          <div className="flex items-center gap-2">
            <span className={`text-sm font-medium ${getScoreColor(readabilityScore)}`}>
              {readabilityScore}/100
            </span>
            <HoverCard>
              <HoverCardTrigger asChild>
                <Info className="h-4 w-4 text-muted-foreground cursor-help" />
              </HoverCardTrigger>
              <HoverCardContent className="text-sm space-y-2">
                <p>Score based on sentence length and word complexity - higher scores indicate better readability.</p>
                <div className="space-y-1">
                  <p className="text-green-500">80-100: Very readable</p>
                  <p className="text-green-400">60-79: Good readability</p>
                  <p className="text-yellow-500">40-59: Moderate readability</p>
                  <p className="text-orange-500">20-39: Poor readability</p>
                  <p className="text-red-500">0-19: Very poor readability</p>
                </div>
              </HoverCardContent>
            </HoverCard>
          </div>
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
      <div className="bg-background rounded-md">
        {formatContent(variation)}
      </div>
    </Card>
  );
}