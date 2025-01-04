import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Search, History, Instagram, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export default function HistoryPage() {
  const [searchFilter, setSearchFilter] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  const { data: recentSearches = [], isLoading } = useQuery({
    queryKey: ['recent-searches'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('search_history')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        toast({
          variant: "destructive",
          title: "Error fetching recent searches",
          description: error.message,
        });
        throw error;
      }

      return data;
    },
  });

  const filteredSearches = recentSearches.filter(search => 
    search.search_query.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const handleSearchSelect = (username: string) => {
    navigate('/', { state: { username } });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4 space-y-8">
      <div className="flex items-center gap-2 text-2xl font-semibold text-foreground">
        <History className="w-6 h-6" />
        <h1>Recent Searches</h1>
      </div>

      <div className="relative">
        <Input
          type="text"
          placeholder="Filter searches..."
          value={searchFilter}
          onChange={(e) => setSearchFilter(e.target.value)}
          className="pl-10"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : filteredSearches.length > 0 ? (
        <div className="grid gap-4">
          {filteredSearches.map((search, index) => (
            <button
              key={index}
              onClick={() => handleSearchSelect(search.search_query)}
              className="flex items-center justify-between p-4 bg-card hover:bg-muted/50 rounded-lg border border-border transition-colors group"
            >
              <div className="flex items-center gap-3">
                <Instagram className="w-5 h-5 text-muted-foreground" />
                <span className="font-medium">@{search.search_query}</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {formatDate(search.created_at)}
              </span>
            </button>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          {searchFilter ? "No matching searches found" : "No recent searches"}
        </div>
      )}
    </div>
  );
}