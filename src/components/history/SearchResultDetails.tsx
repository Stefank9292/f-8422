import { useState } from "react";
import { Instagram, ExternalLink, Download, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InstagramPost } from "@/types/instagram";
import { useToast } from "@/components/ui/use-toast";

interface SearchResultDetailsProps {
  result: InstagramPost;
}

export function SearchResultDetails({ result }: SearchResultDetailsProps) {
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();

  const handleCopyCaption = async () => {
    try {
      await navigator.clipboard.writeText(result.caption || "");
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      toast({
        title: "Caption copied to clipboard",
        duration: 2000,
      });
    } catch (err) {
      toast({
        title: "Failed to copy caption",
        variant: "destructive",
        duration: 2000,
      });
    }
  };

  const handleDownload = async (url: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `instagram-video-${Date.now()}.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
      toast({
        title: "Download started",
        duration: 2000,
      });
    } catch (err) {
      toast({
        title: "Failed to download video",
        variant: "destructive",
        duration: 2000,
      });
    }
  };

  return (
    <div className="p-4 rounded-lg border bg-card text-card-foreground shadow-sm hover:bg-accent/50 transition-all duration-200">
      <div className="flex flex-col space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Instagram className="w-4 h-4 flex-shrink-0" />
            <a
              href={result.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium hover:underline truncate"
            >
              @{result.ownerUsername}
            </a>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0"
              onClick={() => window.open(result.url, "_blank")}
            >
              <ExternalLink className="h-3.5 w-3.5 text-rose-400" />
            </Button>
          </div>
          {result.videoUrl && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0"
              onClick={() => handleDownload(result.videoUrl!)}
            >
              <Download className="h-3.5 w-3.5 text-blue-400" />
            </Button>
          )}
        </div>
        
        <div className="flex items-start gap-2">
          <div className="aspect-square w-24 h-24 rounded-md overflow-hidden bg-muted flex-shrink-0">
            <img
              src={result.displayUrl}
              alt="Post thumbnail"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="min-w-0 flex-1 space-y-2">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
              <div>
                <div className="text-muted-foreground">Likes</div>
                <div className="font-medium">{result.likesCount}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Comments</div>
                <div className="font-medium">{result.commentsCount}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Plays</div>
                <div className="font-medium">{result.playsCount || "N/A"}</div>
              </div>
            </div>
            {result.caption && (
              <div className="flex items-start gap-2">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {result.caption}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 flex-shrink-0"
                  onClick={handleCopyCaption}
                >
                  {isCopied ? (
                    <Check className="h-3.5 w-3.5 text-green-500" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}