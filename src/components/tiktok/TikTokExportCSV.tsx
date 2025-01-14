import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Post {
  ownerUsername: string;
  title: string;
  uploadedAtFormatted: string;
  views: number;
  shares: number;
  likes: number;
  comments: number;
  engagement: string;
  postPage: string;
}

interface ExportCSVProps {
  currentPosts: Post[];
}

export const TikTokExportCSV = ({ currentPosts }: ExportCSVProps) => {
  const handleExportCSV = () => {
    const headers = [
      'Username',
      'Caption',
      'Date',
      'Views',
      'Shares',
      'Likes',
      'Comments',
      'Engagement',
      'URL'
    ].join(',');

    const rows = currentPosts.map(post => [
      `@${post.ownerUsername}`,
      `"${post.title.replace(/"/g, '""')}"`,
      post.uploadedAtFormatted,
      post.views,
      post.shares,
      post.likes,
      post.comments,
      post.engagement,
      post.postPage
    ].join(','));

    const csvContent = [headers, ...rows].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `vyraltiktok-results-${new Date().toISOString().split('T')[0]}.csv`);
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
      <Download className="w-2.5 h-2.5 mr-1.5" />
      Export CSV
    </Button>
  );
};