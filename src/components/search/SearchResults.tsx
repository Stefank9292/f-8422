import { TableContent } from "./TableContent";
import { TablePagination } from "./TablePagination";
import { useState, useEffect } from "react";
import { useSearchStore } from "@/store/searchStore";
import { filterResults } from "@/utils/filterResults";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

interface SearchResultsProps {
  searchResults: any[];
}

export const SearchResults = ({ searchResults }: SearchResultsProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const { filters } = useSearchStore();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Apply filters to search results
  const filteredPosts = filterResults(searchResults, filters);
  const totalPages = Math.ceil(filteredPosts.length / pageSize);
  const indexOfLastPost = currentPage * pageSize;
  const indexOfFirstPost = indexOfLastPost - pageSize;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  // Set up real-time subscription for search results
  useEffect(() => {
    const setupSubscription = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) return;

      console.log('Setting up real-time subscription for search results');

      const channel = supabase
        .channel('search-results-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'search_results',
            filter: `user_id=eq.${session.user.id}`
          },
          (payload) => {
            console.log('Received search results update:', payload);
            // Invalidate the queries to trigger a refresh
            queryClient.invalidateQueries({ queryKey: ['search-results'] });
            
            toast({
              title: "Results Updated",
              description: "New search results are available.",
              duration: 3000,
            });
          }
        )
        .subscribe((status) => {
          console.log('Search results subscription status:', status);
          
          if (status === 'SUBSCRIBED') {
            console.log('Successfully subscribed to search results updates');
          } else if (status === 'CHANNEL_ERROR') {
            console.error('Failed to subscribe to search results updates');
            toast({
              title: "Connection Error",
              description: "Failed to connect to real-time updates. Retrying...",
              variant: "destructive",
            });
          }
        });

      return () => {
        console.log('Cleaning up search results subscription');
        supabase.removeChannel(channel);
      };
    };

    setupSubscription();
  }, [queryClient, toast]);

  const handlePageSizeChange = (value: string) => {
    setPageSize(Number(value));
    setCurrentPage(1);
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
    <div className="w-full">
      <TableContent 
        currentPosts={currentPosts}
        handleCopyCaption={handleCopyCaption}
        handleDownload={handleDownload}
        formatNumber={(num) => num.toLocaleString('de-DE').replace(/,/g, '.')}
        truncateCaption={(caption) => caption}
      />
      <TablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        pageSize={pageSize}
        onPageSizeChange={handlePageSizeChange}
        totalResults={filteredPosts.length}
      />
    </div>
  );
};