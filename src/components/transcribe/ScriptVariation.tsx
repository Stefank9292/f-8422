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

  // Split the content into sections based on numbered lists and headers
  const formatContent = (text: string) => {
    // Clean up the text by removing markdown characters and extra spaces
    const cleanText = text
      .replace(/\*\*/g, '')  // Remove ** characters
      .replace(/###/g, '')   // Remove ### characters
      .replace(/\n{3,}/g, '\n\n')  // Replace 3+ newlines with 2
      .replace(/^\s+|\s+$/gm, '')  // Remove leading/trailing spaces from each line
      .trim();

    const sections = cleanText.split(/(?=\d\. |\n\n)/g).filter(Boolean);
    
    return sections.map((section, index) => {
      // Clean up the section text
      const cleanedSection = section.trim();
      
      // Check if the section is a numbered item
      const isNumbered = /^\d\. /.test(cleanedSection);
      
      if (isNumbered) {
        return (
          <div key={index} className="mb-2">
            <p className="text-sm leading-relaxed">{cleanedSection}</p>
          </div>
        );
      }
      
      // Check if it might be a header (all caps or followed by colon)
      const isHeader = /^[A-Z\s]{4,}:|^[A-Z\s]{4,}$/.test(cleanedSection);
      
      if (isHeader) {
        return (
          <div key={index} className="mt-4 mb-2">
            <h4 className="text-md font-semibold text-foreground/80">{cleanedSection}</h4>
          </div>
        );
      }
      
      return (
        <div key={index} className="mb-2">
          <p className="text-sm leading-relaxed">{cleanedSection}</p>
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
    <Card className="p-6 space-y-2">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-medium">Generated Script</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopyToClipboard}
          className="h-8"
        >
          {copied ? (
            <Check className="h-4 w-4" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
          <span className="ml-2">{copied ? "Copied!" : "Copy"}</span>
        </Button>
      </div>
      <div>
        <div className="bg-muted/50 p-4 rounded-md">
          {formatContent(variation)}
        </div>
      </div>
    </Card>
  );
}