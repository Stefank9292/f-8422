import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, ExternalLink, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";

interface SearchResultsProps {
  posts: any[];
}

export const SearchResults = ({ posts }: SearchResultsProps) => {
  const { toast } = useToast();

  const handleCopyCaption = (caption: string) => {
    navigator.clipboard.writeText(caption);
    toast({
      description: "Caption copied to clipboard",
    });
  };

  return (
    <TooltipProvider>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Username</TableHead>
            <TableHead>Caption</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Views</TableHead>
            <TableHead>Plays</TableHead>
            <TableHead>Likes</TableHead>
            <TableHead>Comments</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Engagement</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.map((post, index) => (
            <TableRow key={index}>
              <TableCell>@{post.ownerUsername}</TableCell>
              <TableCell className="max-w-xs">
                <div className="flex items-center gap-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="truncate cursor-help">{post.caption}</span>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-sm">
                      <p className="break-words">{post.caption}</p>
                    </TooltipContent>
                  </Tooltip>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => handleCopyCaption(post.caption)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
              <TableCell title={post.timestamp}>{post.date}</TableCell>
              <TableCell>{post.viewsCount?.toLocaleString() || '0'}</TableCell>
              <TableCell>{post.videoViewCount?.toLocaleString() || '0'}</TableCell>
              <TableCell>{post.likesCount.toLocaleString()}</TableCell>
              <TableCell>{post.commentsCount.toLocaleString()}</TableCell>
              <TableCell>{post.videoDuration || '0:00'}</TableCell>
              <TableCell>{post.engagement}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="icon" onClick={() => window.open(post.url, '_blank')}>
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TooltipProvider>
  );
};