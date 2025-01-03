import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, ExternalLink, Copy, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface SearchResultsProps {
  posts: any[];
}

type SortConfig = {
  key: string;
  direction: 'asc' | 'desc' | null;
};

export const SearchResults = ({ posts }: SearchResultsProps) => {
  const { toast } = useToast();
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: '', direction: null });

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

  const formatNumber = (num: number) => {
    return num?.toLocaleString() || '0';
  };

  const truncateCaption = (caption: string) => {
    return caption.length > 15 ? `${caption.slice(0, 15)}...` : caption;
  };

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' | null = 'asc';
    
    if (sortConfig.key === key) {
      if (sortConfig.direction === 'asc') {
        direction = 'desc';
      } else if (sortConfig.direction === 'desc') {
        direction = null;
      }
    }
    
    setSortConfig({ key, direction });
  };

  const sortedPosts = [...posts].sort((a, b) => {
    if (sortConfig.direction === null) return 0;
    
    let aValue = a[sortConfig.key];
    let bValue = b[sortConfig.key];
    
    // Handle numeric values
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
    }
    
    // Handle date strings
    if (sortConfig.key === 'date') {
      return sortConfig.direction === 'asc' 
        ? new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        : new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    }
    
    // Handle other string values
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortConfig.direction === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    
    return 0;
  });

  const getSortIcon = (key: string) => {
    if (sortConfig.key === key && sortConfig.direction !== null) {
      return <ArrowUpDown className="h-4 w-4 text-primary" />;
    }
    return null;
  };

  return (
    <TooltipProvider>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Username</TableHead>
            <TableHead>Caption</TableHead>
            <TableHead onClick={() => handleSort('date')} className="cursor-pointer hover:bg-muted/50">
              Date {getSortIcon('date')}
            </TableHead>
            <TableHead onClick={() => handleSort('playsCount')} className="cursor-pointer hover:bg-muted/50">
              Views {getSortIcon('playsCount')}
            </TableHead>
            <TableHead onClick={() => handleSort('viewsCount')} className="cursor-pointer hover:bg-muted/50">
              Plays {getSortIcon('viewsCount')}
            </TableHead>
            <TableHead onClick={() => handleSort('likesCount')} className="cursor-pointer hover:bg-muted/50">
              Likes {getSortIcon('likesCount')}
            </TableHead>
            <TableHead onClick={() => handleSort('commentsCount')} className="cursor-pointer hover:bg-muted/50">
              Comments {getSortIcon('commentsCount')}
            </TableHead>
            <TableHead onClick={() => handleSort('duration')} className="cursor-pointer hover:bg-muted/50">
              Duration {getSortIcon('duration')}
            </TableHead>
            <TableHead onClick={() => handleSort('engagement')} className="cursor-pointer hover:bg-muted/50">
              Engagement {getSortIcon('engagement')}
            </TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedPosts.map((post, index) => (
            <TableRow key={index}>
              <TableCell>@{post.ownerUsername}</TableCell>
              <TableCell className="max-w-xs">
                <div className="flex items-center gap-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="truncate cursor-help">{truncateCaption(post.caption)}</span>
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
              <TableCell>{formatNumber(post.playsCount)}</TableCell>
              <TableCell>{formatNumber(post.viewsCount)}</TableCell>
              <TableCell>{formatNumber(post.likesCount)}</TableCell>
              <TableCell>{formatNumber(post.commentsCount)}</TableCell>
              <TableCell>{post.duration || '0:00'}</TableCell>
              <TableCell>{post.engagement}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="icon" onClick={() => window.open(post.url, '_blank')}>
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDownload(post.videoUrl)}>
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