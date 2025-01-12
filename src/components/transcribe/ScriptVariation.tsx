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
      .replace(/\n{3,}/g, '\n\n')
      .replace(/^\s+|\s+$/gm, '')
      .trim();

    const sections = cleanText.split(/(?=\d\. |\n\n)/g).filter(Boolean);
    
    return sections.map((section, index) => {
      const cleanedSection = section.trim();
      const isNumbered = /^\d\. /.test(cleanedSection);
      
      if (isNumbered) {
        return (
          <div key={index} className="mb-2 md:mb-3">
            <p className="text-sm md:text-base leading-relaxed">{cleanedSection}</p>
          </div>
        );
      }
      
      const isHeader = /^[A-Z\s]{4,}:|^[A-Z\s]{4,}$/.test(cleanedSection);
      
      if (isHeader) {
        return (
          <div key={index} className="mt-4 md:mt-5 mb-2 md:mb-3">
            <h4 className="text-base md:text-lg font-semibold text-foreground/80">{cleanedSection}</h4>
          </div>
        );
      }
      
      return (
        <div key={index} className="mb-2 md:mb-3">
          <p className="text-sm md:text-base leading-relaxed">{cleanedSection}</p>
        </div>
      );
    });
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
      <div className="bg-muted/50 p-3 md:p-4 rounded-md">
        {formatContent(variation)}
      </div>
    </Card>
  );
}