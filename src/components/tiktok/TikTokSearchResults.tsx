import { TikTokPost } from "@/types/tiktok";
import { Eye, Play, Heart, MessageCircle, Share2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";

interface TikTokSearchResultsProps {
  searchResults: TikTokPost[];
}

export function TikTokSearchResults({ searchResults }: TikTokSearchResultsProps) {
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US', { notation: 'compact' }).format(num);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4 animate-in fade-in duration-300">
      {searchResults.map((post, index) => (
        <div
          key={index}
          className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden
                   hover:shadow-lg transition-all duration-200 group"
        >
          <div className="p-4 space-y-4">
            <div className="space-y-2">
              <p className="text-sm line-clamp-2 group-hover:text-[#FF0050] transition-colors">{post.caption}</p>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(post.date), { addSuffix: true })}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Eye className="h-3 w-3" />
                <span>{formatNumber(post.viewsCount)}</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Play className="h-3 w-3" />
                <span>{formatNumber(post.viewsCount)}</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Heart className="h-3 w-3" />
                <span>{formatNumber(post.likesCount)}</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <MessageCircle className="h-3 w-3" />
                <span>{formatNumber(post.commentsCount)}</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Share2 className="h-3 w-3" />
                <span>{formatNumber(post.sharesCount)}</span>
              </div>
              <div className="flex items-center gap-1 font-medium text-[#FF0050]">
                <span>{post.engagement}%</span>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs hover:bg-[#FF0050] hover:text-white transition-colors"
              onClick={() => window.open(post.url, '_blank')}
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              Open in TikTok
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}