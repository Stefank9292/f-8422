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
      // First, try to parse the ISO date string
      const date = parseISO(dateString);
      
      // Check if the parsed date is valid
      if (!isValid(date)) {
        console.error('Invalid date after parsing:', dateString);
        return 'Invalid date';
      }
      
      // Format the valid date
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
    <div className="flex flex-col gap-4 p-4 rounded-lg border bg-card text-card-foreground shadow-sm hover:bg-accent/50 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Instagram className="w-4 h-4" />
          <a
            href={result.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium hover:underline"
          >
            @{result.ownerUsername}
          </a>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => handleCopyCaption(result.caption)}
          >
            <Copy className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => window.open(result.url, '_blank')}
          >
            <ExternalLink className="h-4 w-4 text-rose-400" />
          </Button>
          {result.videoUrl && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => handleDownload(result.videoUrl!)}
            >
              <Download className="h-4 w-4 text-blue-400" />
            </Button>
          )}
        </div>
      </div>
      
      <div className="relative">
        <p className="text-sm text-muted-foreground line-clamp-2">{result.caption}</p>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <Tooltip>
          <TooltipTrigger>
            <div className="flex items-center gap-2">
              <Play className="w-4 h-4 text-primary" />
              <span className="text-sm">{result.playsCount.toLocaleString()}</span>
            </div>
          </TooltipTrigger>
          <TooltipContent>Plays</TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger>
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-green-500" />
              <span className="text-sm">{result.viewsCount.toLocaleString()}</span>
            </div>
          </TooltipTrigger>
          <TooltipContent>Views</TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger>
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-500" />
              <span className="text-sm">{result.likesCount.toLocaleString()}</span>
            </div>
          </TooltipTrigger>
          <TooltipContent>Likes</TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger>
            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-blue-500" />
              <span className="text-sm">{result.commentsCount.toLocaleString()}</span>
            </div>
          </TooltipTrigger>
          <TooltipContent>Comments</TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-orange-500" />
              <span className="text-sm">{result.duration}</span>
            </div>
          </TooltipTrigger>
          <TooltipContent>Duration</TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-500" />
              <span className="text-sm">{result.engagement}% engagement</span>
            </div>
          </TooltipTrigger>
          <TooltipContent>Engagement Rate</TooltipContent>
        </Tooltip>
      </div>
      
      <div className="text-xs text-muted-foreground">
        Posted on {formatDate(result.date)}
      </div>
    </div>
  );
}