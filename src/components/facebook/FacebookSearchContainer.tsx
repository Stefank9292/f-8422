import { FacebookSearchHeader } from "./FacebookSearchHeader";
import { FacebookSearchBar } from "./FacebookSearchBar";
import { FacebookSearchSettings } from "./FacebookSearchSettings";
import { FacebookSearchResults } from "./FacebookSearchResults";
import { FacebookRecentSearches } from "./FacebookRecentSearches";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

export const FacebookSearchContainer = () => {
  const [username, setUsername] = useState("");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [numberOfPosts, setNumberOfPosts] = useState(5);
  const [shouldSearch, setShouldSearch] = useState(false);
  const { toast } = useToast();

  // Get current user session
  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data } = await supabase.auth.getSession();
      return data.session;
    },
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
  });

  // Facebook search query with persistence
  const { 
    data: searchResults = [], 
    isLoading,
    error: searchError
  } = useQuery({
    queryKey: ['facebook-search', username, numberOfPosts, shouldSearch],
    queryFn: async () => {
      if (!username.trim()) return [];
      
      console.log('Searching Facebook with params:', { username, numberOfPosts });
      // TODO: Implement Facebook API integration
      const results = [];

      // Save search to history if user is logged in
      if (session?.user?.id) {
        const { error } = await supabase
          .from('facebook_search_history')
          .insert({
            user_id: session.user.id,
            search_query: username.replace('@', ''),
            search_type: 'user_search'
          });

        if (error) {
          console.error('Error saving search history:', error);
        }
      }

      return results;
    },
    enabled: shouldSearch && Boolean(username.trim()),
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    gcTime: 1000 * 60 * 30, // Keep in cache for 30 minutes
    retry: 2
  });

  const handleSearch = async () => {
    if (!username.trim()) {
      toast({
        title: "Error",
        description: "Please enter a Facebook username or URL",
        variant: "destructive",
      });
      return;
    }

    setShouldSearch(true);
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-[calc(100vh-theme(spacing.20))] md:min-h-[calc(100vh-theme(spacing.32))] 
                    px-4 sm:px-6 py-8 sm:py-12 space-y-8 sm:space-y-10 animate-in fade-in duration-500 w-full">
      <div className="space-y-6 sm:space-y-8 w-full max-w-lg">
        <FacebookSearchHeader />
      </div>

      <div className="w-full max-w-lg space-y-6 animate-in fade-in duration-500 delay-150">
        <FacebookSearchBar
          username={username}
          onUsernameChange={setUsername}
          isLoading={isLoading}
          onSearch={handleSearch}
        />
        
        <FacebookSearchSettings 
          isSettingsOpen={isSettingsOpen}
          setIsSettingsOpen={setIsSettingsOpen}
          numberOfPosts={numberOfPosts}
          setNumberOfPosts={setNumberOfPosts}
          disabled={isLoading}
        />

        <FacebookRecentSearches onSelect={setUsername} />
      </div>

      <div className="w-full animate-in fade-in duration-500 delay-300">
        <FacebookSearchResults searchResults={searchResults} />
      </div>
    </div>
  );
};