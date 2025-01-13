import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { SearchHistoryList } from "@/components/SearchHistoryList";

const SearchHistory = () => {
  const [searchHistory, setSearchHistory] = useState([]);

  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data } = await supabase.auth.getSession();
      return data.session;
    },
  });

  useEffect(() => {
    const fetchSearchHistory = async () => {
      if (session) {
        const { data, error } = await supabase
          .from('search_history')
          .select('*')
          .eq('user_id', session.user.id);

        if (error) {
          console.error("Error fetching search history:", error);
        } else {
          setSearchHistory(data);
        }
      }
    };

    fetchSearchHistory();
  }, [session]);

  return (
    <div className="min-h-screen bg-background pt-20 md:pt-6 pb-6 md:pb-8">
      <div className="container max-w-7xl mx-auto px-4">
        <h1 className="text-2xl font-semibold">Search History</h1>
        <SearchHistoryList history={searchHistory} />
      </div>
    </div>
  );
};

export default SearchHistory;
