import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { BulkSearchSettings } from "./BulkSearchSettings";
import { Search, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { saveSearchHistory } from "@/utils/searchHistory";
import { InstagramPost } from "@/types/instagram";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface BulkSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (urls: string[], numberOfVideos: number, selectedDate: Date | undefined) => Promise<InstagramPost[]>;
  isLoading?: boolean;
}

const MAX_URLS = 20;

export const BulkSearch = ({ isOpen, onClose, onSearch, isLoading = false }: BulkSearchProps) => {
  const [urls, setUrls] = useState<string>("");
  const [numberOfVideos, setNumberOfVideos] = useState(3);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { toast } = useToast();

  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data } = await supabase.auth.getSession();
      return data.session;
    },
  });

  const { data: subscriptionStatus } = useQuery({
    queryKey: ['subscription-status', session?.access_token],
    queryFn: async () => {
      if (!session?.access_token) return null;
      const { data, error } = await supabase.functions.invoke('check-subscription', {
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });
      if (error) throw error;
      return data;
    },
    enabled: !!session?.access_token,
  });

  const handleSearch = async () => {
    const urlList = urls
      .split('\n')
      .map(url => url.trim())
      .filter(url => url !== "");

    if (urlList.length === 0) {
      toast({
        title: "Error",
        description: "Please enter at least one Instagram URL",
        variant: "destructive",
      });
      return;
    }

    if (urlList.length > MAX_URLS) {
      toast({
        title: "Error",
        description: `Maximum ${MAX_URLS} URLs allowed. You entered ${urlList.length} URLs.`,
        variant: "destructive",
      });
      return;
    }

    try {
      const results = await onSearch(urlList, numberOfVideos, selectedDate);
      // Save bulk search results to history
      await saveSearchHistory(urlList[0], results, urlList);
      onClose();
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: "Error",
        description: "Failed to perform search",
        variant: "destructive",
      });
    }
  };

  const isBulkSearchEnabled = subscriptionStatus?.priceId && (
    subscriptionStatus.priceId === "price_1Qdt4NGX13ZRG2XiMWXryAm9" || // Creator on Steroids Monthly
    subscriptionStatus.priceId === "price_1Qdt5HGX13ZRG2XiUW80k3Fk"    // Creator on Steroids Annual
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-xl mx-auto p-3 sm:p-6 rounded-2xl sm:rounded-xl">
        <DialogHeader className="space-y-2 mb-4">
          <DialogTitle className="text-base sm:text-xl font-semibold tracking-tight">
            Bulk Search
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm text-muted-foreground">
            Enter Instagram URLs (one per line) to search multiple profiles at once.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 sm:space-y-6 flex flex-col items-center">
          <div className="w-full space-y-2">
            <label className="text-xs sm:text-sm font-medium text-foreground flex items-center gap-1">
              Instagram URLs
              <span className="text-[10px] text-muted-foreground">(max {MAX_URLS})</span>
            </label>
            <Textarea
              placeholder={`Enter Instagram URLs (one per line, maximum ${MAX_URLS} URLs)`}
              className="min-h-[120px] sm:min-h-[200px] font-mono text-xs sm:text-sm resize-none bg-background border-input focus:ring-2 focus:ring-primary/20 rounded-xl w-full"
              value={urls}
              onChange={(e) => setUrls(e.target.value)}
              disabled={isLoading}
            />
            <p className={`text-[10px] sm:text-xs ${urls.split('\n').filter(url => url.trim() !== "").length > MAX_URLS ? 'text-destructive' : 'text-muted-foreground'} text-right`}>
              {urls.split('\n').filter(url => url.trim() !== "").length} / {MAX_URLS} URLs
            </p>
          </div>

          <BulkSearchSettings
            isSettingsOpen={isSettingsOpen}
            setIsSettingsOpen={setIsSettingsOpen}
            numberOfVideos={numberOfVideos}
            setNumberOfVideos={setNumberOfVideos}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            disabled={isLoading}
          />

          <div className="flex justify-center w-full">
            <Button 
              onClick={handleSearch}
              disabled={isLoading || !urls}
              className={`w-full h-10 text-[11px] font-medium transition-all duration-300 ${
                urls ? "instagram-gradient" : "bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-700 dark:to-gray-800"
              } text-white dark:text-gray-100 shadow-sm hover:shadow-md`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-3.5 w-3.5" />
                  Search
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
