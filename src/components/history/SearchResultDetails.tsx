import { InstagramPost } from "@/types/instagram";
import { cn } from "@/lib/utils";
import { format, isValid, parseISO } from "date-fns";
import { Instagram, Play, Eye, Heart, MessageCircle, Clock, Zap, Download, ExternalLink, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface SearchResultDetailsProps {
  result: InstagramPost;
}

export function SearchResultDetails({ result }: SearchResultDetailsProps) {
  const { toast } = useToast();

  const formatDate = (dateString: string) => {
    if (!dateString) return 'No date available';
    
    try {
      const date = parseISO(dateString);
      if (!isValid(date)) {
        console.error('Invalid date after parsing:', dateString);
        return 'Invalid date';
      }
      return format(date, 'MMMM d, yyyy');
    } catch (error) {
      console.error('Error formatting date:', error, 'Date string:', dateString);
      return 'Invalid date';
    }
  };

  const handleCopyCaption = (caption: string) => {
    navigator.clipboard.writeText(caption);
    toast({
      description: "Caption copied to clipboard",
    });
  };

  const handleDownload = async (videoUrl: string) => {
    try {
      const response = await fetch(videoUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `video-${Date.now()}.mp4`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast({
        description: "Download started",
      });
    } catch (error) {
      console.error('Download error:', error);
      toast({
        variant: "destructive",
        description: "Failed to download video",
      });
    }
  };

  return (
    <div className="p-3 rounded-lg border bg-card text-card-foreground shadow-sm hover:bg-accent/50 transition-colors">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <Instagram className="w-4 h-4 flex-shrink-0" />
            <a
              href={result.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium hover:underline truncate"
            >
              @{result.ownerUsername}
            </a>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0"
              onClick={() => handleCopyCaption(result.caption)}
            >
              <Copy className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0"
              onClick={() => window.open(result.url, '_blank')}
            >
              <ExternalLink className="h-3.5 w-3.5 text-rose-400" />
            </Button>
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
        </div>
        
        <p className="text-xs text-muted-foreground line-clamp-2">{result.caption}</p>
        
        <div className="grid grid-cols-3 gap-2 text-xs">
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-1.5">
                <Play className="w-3.5 h-3.5 text-primary" />
                <span>{result.playsCount.toLocaleString()}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>Plays</TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-green-500" />
                <span>{result.viewsCount.toLocaleString()}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>Views</TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-rose-500" />
                <span>{result.likesCount.toLocaleString()}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>Likes</TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-1.5">
                <MessageCircle className="w-3.5 h-3.5 text-blue-500" />
                <span>{result.commentsCount.toLocaleString()}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>Comments</TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-orange-500" />
                <span>{result.duration}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>Duration</TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-yellow-500" />
                <span>{result.engagement}%</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>Engagement Rate</TooltipContent>
          </Tooltip>
        </div>
        
        <div className="text-[10px] text-muted-foreground">
          {formatDate(result.date)}
        </div>
      </div>
    </div>
  );
}