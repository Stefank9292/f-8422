import { InstagramPost } from "@/types/instagram";
import { cn } from "@/lib/utils";
import { format, isValid, parseISO } from "date-fns";
import { Instagram, Play, Eye, Heart, MessageCircle, Clock, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SearchResultDetailsProps {
  result: InstagramPost;
}

export function SearchResultDetails({ result }: SearchResultDetailsProps) {
  const formatDate = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      if (!isValid(date)) {
        return 'Invalid date';
      }
      return format(date, 'MMM d, yyyy');
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
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
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-3"
          onClick={() => window.open(result.url, '_blank')}
        >
          View Post
        </Button>
      </div>
      
      <p className="text-sm text-muted-foreground line-clamp-2">{result.caption}</p>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="flex items-center gap-2">
          <Play className="w-4 h-4 text-primary" />
          <span className="text-sm">{result.playsCount.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-green-500" />
          <span className="text-sm">{result.viewsCount.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-2">
          <Heart className="w-4 h-4 text-rose-500" />
          <span className="text-sm">{result.likesCount.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-2">
          <MessageCircle className="w-4 h-4 text-blue-500" />
          <span className="text-sm">{result.commentsCount.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-orange-500" />
          <span className="text-sm">{result.duration}</span>
        </div>
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-yellow-500" />
          <span className="text-sm">{result.engagement}% engagement</span>
        </div>
      </div>
      
      <div className="text-xs text-muted-foreground">
        Posted on {formatDate(result.date)}
      </div>
    </div>
  );
}