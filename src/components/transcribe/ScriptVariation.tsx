import { Card } from "@/components/ui/card";

interface ScriptVariationProps {
  variation: string;
}

export function ScriptVariation({ variation }: ScriptVariationProps) {
  // Split the content into sections based on numbered lists and headers
  const formatContent = (text: string) => {
    const sections = text.split(/(?=\d\. |\n\n)/g).filter(Boolean);
    
    return sections.map((section, index) => {
      // Check if the section is a numbered item
      const isNumbered = /^\d\. /.test(section);
      
      // Add appropriate styling based on content type
      if (isNumbered) {
        return (
          <div key={index} className="mb-4">
            <p className="text-sm leading-relaxed">{section}</p>
          </div>
        );
      }
      
      // Check if it might be a header (all caps or followed by colon)
      const isHeader = /^[A-Z\s]{4,}:|^[A-Z\s]{4,}$/.test(section.trim());
      
      if (isHeader) {
        return (
          <div key={index} className="mt-6 mb-3">
            <h4 className="text-md font-semibold text-foreground/80">{section.trim()}</h4>
          </div>
        );
      }
      
      return (
        <div key={index} className="mb-4">
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{section}</p>
        </div>
      );
    });
  };

  return (
    <Card className="p-6 space-y-3">
      <h3 className="text-lg font-medium mb-4">Generated Script</h3>
      <div className="space-y-2">
        <div className="bg-muted/50 p-4 rounded-md">
          {formatContent(variation)}
        </div>
      </div>
    </Card>
  );
}