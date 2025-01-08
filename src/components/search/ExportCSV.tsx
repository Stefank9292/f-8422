import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Post {
  ownerUsername: string;
  caption: string;
  date: string;
  playsCount: number;
  viewsCount: number;
  likesCount: number;
  commentsCount: number;
  duration: string;
  engagement: string;
  url: string;
}

interface ExportCSVProps {
  currentPosts: Post[];
}

export const ExportCSV = ({ currentPosts }: ExportCSVProps) => {
  const handleExportCSV = () => {
    const headers = [
      'Username',
      'Caption',
      'Date',
      'Plays',
      'Views',
      'Likes',
      'Comments',
      'Duration',
      'Engagement',
      'URL'
    ].join(',');

    const rows = currentPosts.map(post => [
      `@${post.ownerUsername}`,
      `"${post.caption.replace(/"/g, '""')}"`,
      post.date,
      post.playsCount,
      post.viewsCount,
      post.likesCount,
      post.commentsCount,
      post.duration || '0:00',
      post.engagement,
      post.url
    ].join(','));

    const csvContent = [headers, ...rows].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `vyralsearch-results-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Button 
      variant="ghost" 
      size="sm" 
      onClick={handleExportCSV}
      className="h-6 px-2 text-[10px] font-medium hover:bg-secondary/50 border border-border/50"
    >
      <Download className="w-3.5 h-3.5 mr-1.5" />
      Export CSV
    </Button>
  );
};