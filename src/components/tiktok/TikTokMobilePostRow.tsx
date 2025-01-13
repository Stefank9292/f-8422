import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Heart, MessageCircle, Share2, ExternalLink } from "lucide-react";

interface TikTokMobilePostRowProps {
  post: any;
  formatNumber: (num: number) => string;
}

export const TikTokMobilePostRow = ({ post, formatNumber }: TikTokMobilePostRowProps) => {
  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1 flex-1 min-w-0">
          <p className="text-sm font-medium">@{post.username}</p>
          <p className="text-xs text-muted-foreground truncate">{post.caption}</p>
          <p className="text-xs text-muted-foreground">{post.date}</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => window.open(post.url, '_blank')}
        >
          <ExternalLink className="h-4 w-4 text-rose-400" />
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-2 text-center">
        <div className="space-y-1">
          <Eye className="h-4 w-4 text-green-500 mx-auto" />
          <p className="text-xs font-medium text-green-500">
            {formatNumber(post.viewCount)}
          </p>
        </div>
        <div className="space-y-1">
          <Heart className="h-4 w-4 text-rose-500 mx-auto" />
          <p className="text-xs font-medium text-rose-500">
            {formatNumber(post.likeCount)}
          </p>
        </div>
        <div className="space-y-1">
          <MessageCircle className="h-4 w-4 text-blue-400 mx-auto" />
          <p className="text-xs font-medium text-blue-400">
            {formatNumber(post.commentCount)}
          </p>
        </div>
        <div className="space-y-1">
          <Share2 className="h-4 w-4 text-violet-400 mx-auto" />
          <p className="text-xs font-medium text-violet-400">
            {formatNumber(post.shareCount)}
          </p>
        </div>
      </div>
    </Card>
  );
};