import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { InstagramPost } from "@/types/instagram";
import { searchInstagram } from "@/utils/searchInstagram";
import { saveSearchHistory } from "@/utils/searchHistory";
import { extractUsernameFromUrl } from "@/utils/extractUsername";
import { SearchInput } from "./SearchInput";
import { SearchResults } from "./SearchResults";
import { BulkSearch } from "./BulkSearch";

interface SearchStateProps {
  onSearchComplete?: (results: InstagramPost[]) => void;
}

export function SearchState({ onSearchComplete }: SearchStateProps) {
  const [searchResults, setSearchResults] = useState<InstagramPost[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [isBulkSearchOpen, setIsBulkSearchOpen] = useState(false);
  const { toast } = useToast();

  const handleSearch = async (username: string, numberOfVideos: number, selectedDate: Date | undefined) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await searchInstagram(username, numberOfVideos, selectedDate);
      
      if (response?.results) {
        await saveSearchHistory(username, response.results);
        setSearchResults(response.results);
        setHasSearched(true);
        onSearchComplete?.(response.results);
      }
    } catch (error) {
      console.error('Search error:', error);
      setError('Failed to perform search');
      toast({
        title: "Error",
        description: "Failed to perform search",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBulkSearch = async (urls: string[], numberOfVideos: number, selectedDate: Date | undefined) => {
    try {
      setIsLoading(true);
      setError(null);

      const allResults: InstagramPost[] = [];
      const processedUsernames = new Set<string>();
      let mainUsername = '';

      for (const url of urls) {
        const username = extractUsernameFromUrl(url);
        if (!username) continue;

        if (!mainUsername) mainUsername = username;

        if (!processedUsernames.has(username)) {
          const response = await searchInstagram(username, numberOfVideos, selectedDate);
          if (response?.results) {
            allResults.push(...response.results);
          }
          processedUsernames.add(username);
        }
      }

      if (allResults.length > 0) {
        // Save all results under one history entry with the first username
        await saveSearchHistory(mainUsername, allResults, urls);
        
        setSearchResults(allResults);
        setHasSearched(true);
        onSearchComplete?.(allResults);
      }
    } catch (error) {
      console.error('Bulk search error:', error);
      setError('Failed to perform bulk search');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      <SearchInput
        onSearch={handleSearch}
        onBulkSearch={() => setIsBulkSearchOpen(true)}
        isLoading={isLoading}
      />
      
      <BulkSearch
        isOpen={isBulkSearchOpen}
        onClose={() => setIsBulkSearchOpen(false)}
        onSearch={handleBulkSearch}
        isLoading={isLoading}
      />

      {error && (
        <div className="text-sm text-red-500 text-center">
          {error}
        </div>
      )}

      {hasSearched && !isLoading && searchResults.length === 0 && (
        <div className="text-center text-muted-foreground">
          No results found
        </div>
      )}

      {searchResults.length > 0 && (
        <SearchResults results={searchResults} />
      )}
    </div>
  );
}