import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ScriptVariationProps {
  variation: string;
}

export function ScriptVariation({ variation }: ScriptVariationProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

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
        <h3 className="text-base md:text-lg font-medium">Generated Script</h3>
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