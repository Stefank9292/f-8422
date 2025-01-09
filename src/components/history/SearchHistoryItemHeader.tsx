import { useState } from "react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";
import { List, Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SearchHistoryItemHeaderProps {
  searchQuery: string;
  searchType: string;
  bulkSearchUrls?: string[];
}

export function SearchHistoryItemHeader({ searchQuery, searchType, bulkSearchUrls }: SearchHistoryItemHeaderProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const isBulkSearch = searchType === 'bulk_instagram_search';
  
  // Clean and format URLs properly
  const urls = bulkSearchUrls?.map(url => {
    // Remove any trailing colons
    const cleanUrl = url.replace(/:+$/, '');
    
    // If it's just a username, convert it to a proper Instagram URL
    if (!cleanUrl.startsWith('http')) {
      return `https://www.instagram.com/${cleanUrl.replace('@', '')}`;
    }
    
    return cleanUrl;
  });

  const handleCopyUrls = () => {
    if (urls && urls.length > 0) {
      navigator.clipboard.writeText(urls.join('\n'))
        .then(() => {
          setCopied(true);
          toast({
            title: "URLs Copied",
            description: "The URLs have been copied to your clipboard",
          });
          setTimeout(() => setCopied(false), 2000);
        })
        .catch(() => {
          toast({
            title: "Copy Failed",
            description: "Failed to copy URLs to clipboard",
            variant: "destructive",
          });
        });
    }
  };

  return (
    <div className="p-4 rounded-lg border bg-card text-card-foreground hover:bg-accent/50 transition-colors">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {isBulkSearch && urls && urls.length > 0 && (
            <HoverCard>
              <HoverCardTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <List className="h-4 w-4" />
                </Button>
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold">Bulk Search URLs</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={handleCopyUrls}
                    >
                      {copied ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {urls.map((url, index) => (
                      <div key={index} className="truncate">
                        {url}
                      </div>
                    ))}
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
          )}
          <span className="font-medium truncate">
            {searchQuery}
          </span>
        </div>
      </div>
    </div>
  );
}