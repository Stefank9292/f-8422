import { X, Instagram, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { useToast } from "@/hooks/use-toast";

interface RecentSearchItemProps {
  id: string;
  searchQuery: string;
  bulkSearchUrls?: string[];
  onSelect: (username: string) => void;
  onRemove: (id: string) => void;
}

export const RecentSearchItem = ({ 
  id, 
  searchQuery, 
  bulkSearchUrls, 
  onSelect, 
  onRemove 
}: RecentSearchItemProps) => {
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();

  const handleCopyUrls = async (urls: string[]) => {
    try {
      const urlsText = urls.join('\n');
      await navigator.clipboard.writeText(urlsText);
      setIsCopied(true);
      
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);

      toast({
        title: "URLs Copied",
        description: "The Instagram URLs have been copied to your clipboard",
      });
    } catch (error) {
      console.error('Failed to copy URLs:', error);
      toast({
        title: "Copy Failed",
        description: "Failed to copy URLs to clipboard",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white dark:bg-gray-800 shadow-sm">
      <Instagram className="w-3.5 h-3.5 text-[#E1306C]" />
      <button
        onClick={() => onSelect(searchQuery)}
        className="text-[11px] font-medium text-gray-800 dark:text-gray-200"
      >
        {searchQuery}
      </button>
      {bulkSearchUrls && bulkSearchUrls.length > 1 && (
        <HoverCard>
          <HoverCardTrigger asChild>
            <button className="text-[11px] text-muted-foreground hover:text-foreground transition-colors">
              +{bulkSearchUrls.length - 1}
            </button>
          </HoverCardTrigger>
          <HoverCardContent className="w-80 p-2">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Bulk Search URLs</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2"
                  onClick={() => handleCopyUrls(bulkSearchUrls)}
                >
                  {isCopied ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <div className="space-y-1">
                {bulkSearchUrls.map((url, index) => (
                  <div key={index} className="text-xs text-muted-foreground">
                    {url}
                  </div>
                ))}
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
      )}
      <Button
        variant="ghost"
        size="icon"
        className="h-4 w-4 p-0 hover:bg-transparent"
        onClick={() => onRemove(id)}
      >
        <X className="h-3 w-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
        <span className="sr-only">Remove search</span>
      </Button>
    </div>
  );
};