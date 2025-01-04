import { InstagramPost } from "@/types/instagram";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Instagram, Play, Eye, Heart, MessageCircle, Clock } from "lucide-react";

interface SearchResultDetailsProps {
  result: InstagramPost;
}

export function SearchResultDetails({ result }: SearchResultDetailsProps) {
  return (
    <div className="flex flex-col gap-4 p-4 rounded-lg border bg-card text-card-foreground shadow-sm">
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
      <p className="text-sm text-muted-foreground line-clamp-2">{result.caption}</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="flex items-center gap-2">
          <Play className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm">{result.playsCount.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm">{result.viewsCount.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-2">
          <Heart className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm">{result.likesCount.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-2">
          <MessageCircle className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm">{result.commentsCount.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm">{result.duration}</span>
        </div>
      </div>
      <div className="flex justify-between items-center text-sm text-muted-foreground">
        <span>{format(new Date(result.date), 'MMM d, yyyy')}</span>
        <span>{result.engagement}% engagement</span>
      </div>
    </div>
  );
}