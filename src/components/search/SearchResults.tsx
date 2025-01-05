import { useToast } from "@/hooks/use-toast";
import { useState, useEffect, useRef } from "react";
import confetti from 'canvas-confetti';
import { cn } from "@/lib/utils";
import { TablePagination } from "./TablePagination";
import { TableContent } from "./TableContent";

interface SearchResultsProps {
  posts: any[];
  filters: {
    postsNewerThan: string;
    minViews: string;
    minPlays: string;
    minLikes: string;
    minComments: string;
    minDuration: string;
    minEngagement: string;
  };
}

type SortConfig = {
  key: string;
  direction: 'asc' | 'desc' | null;
};

export const SearchResults = ({ posts, filters }: SearchResultsProps) => {
  const { toast } = useToast();
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: '', direction: null });
  const previousPostsRef = useRef<string>('');
  const hasTriggeredConfetti = useRef<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  useEffect(() => {
    // Log detailed metadata when posts change
    if (posts.length > 0) {
      const lastPost = posts[posts.length - 1];
      console.group('Last Post Metadata Details:');
      console.log('Basic Info:', {
        username: lastPost.ownerUsername,
        postUrl: lastPost.url,
        videoUrl: lastPost.videoUrl || 'No video URL'
      });
      
      console.log('Timing:', {
        date: lastPost.date,
        timestamp: lastPost.timestamp
      });
      
      console.log('Engagement Metrics:', {
        views: lastPost.viewsCount?.toLocaleString() || '0',
        plays: lastPost.playsCount?.toLocaleString() || '0',
        likes: lastPost.likesCount?.toLocaleString() || '0',
        comments: lastPost.commentsCount?.toLocaleString() || '0',
        engagementRate: lastPost.engagement || '0%'
      });
      
      console.log('Content:', {
        caption: lastPost.caption,
        duration: lastPost.duration || 'N/A',
        type: lastPost.type || 'N/A',
        hashtags: lastPost.hashtags || [],
        mentions: lastPost.mentions || []
      });
      console.groupEnd();
    }

    const currentPostsString = JSON.stringify(posts);
    if (
      posts.length > 0 && 
      currentPostsString !== previousPostsRef.current &&
      !hasTriggeredConfetti.current
    ) {
      const rect = document.querySelector('main')?.getBoundingClientRect();
      if (rect) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { 
            x: (rect.left + rect.width / 2) / window.innerWidth,
            y: (rect.top + rect.height / 2) / window.innerHeight 
          },
          colors: ['#D946EF', '#E1306C', '#8B5CF6', '#9b87f5'],
          angle: 90,
          startVelocity: 30,
          gravity: 0.5,
          drift: 0,
          ticks: 200,
          decay: 0.9,
          scalar: 0.8,
          zIndex: 100,
        });
      }
      hasTriggeredConfetti.current = true;
      previousPostsRef.current = currentPostsString;
    }
    if (currentPostsString !== previousPostsRef.current) {
      hasTriggeredConfetti.current = false;
    }
  }, [posts]);

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

  const filteredPosts = posts.filter(post => {
    if (filters.postsNewerThan) {
      const filterDate = new Date(filters.postsNewerThan.split('.').reverse().join('-'));
      const postDate = new Date(post.timestamp);
      if (postDate < filterDate) return false;
    }
    if (filters.minViews && post.playsCount < parseInt(filters.minViews)) return false;
    if (filters.minPlays && post.viewsCount < parseInt(filters.minPlays)) return false;
    if (filters.minLikes && post.likesCount < parseInt(filters.minLikes)) return false;
    if (filters.minComments && post.commentsCount < parseInt(filters.minComments)) return false;
    if (filters.minDuration && post.duration < filters.minDuration) return false;
    if (filters.minEngagement && parseFloat(post.engagement) < parseFloat(filters.minEngagement)) return false;

    return true;
  });

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (sortConfig.direction === null) return 0;
    
    let aValue = a[sortConfig.key];
    let bValue = b[sortConfig.key];
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
    }
    
    if (sortConfig.key === 'date') {
      return sortConfig.direction === 'asc' 
        ? new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        : new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    }
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortConfig.direction === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    
    return 0;
  });

  const totalPages = Math.ceil(sortedPosts.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentPosts = sortedPosts.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (value: string) => {
    const newPageSize = parseInt(value);
    setPageSize(newPageSize);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-4">
      <TableContent
        currentPosts={currentPosts}
        handleSort={handleSort}
        handleCopyCaption={handleCopyCaption}
        handleDownload={handleDownload}
        formatNumber={formatNumber}
        truncateCaption={truncateCaption}
      />

      {sortedPosts.length > 25 && (
        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          totalResults={sortedPosts.length}
        />
      )}
    </div>
  );
};