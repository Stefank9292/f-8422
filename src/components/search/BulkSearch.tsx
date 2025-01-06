import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { BulkSearchSettings } from "./BulkSearchSettings";
import { Search, Loader2, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BulkSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (urls: string[], numberOfVideos: number, selectedDate: Date | undefined) => Promise<void>;
  isLoading?: boolean;
  isDisabled?: boolean;
  requestCount?: number;
  maxRequests?: number;
  subscriptionStatus?: any;
}

const MAX_URLS = 20;

export const BulkSearch = ({ 
  isOpen, 
  onClose, 
  onSearch, 
  isLoading = false,
  isDisabled = false,
  requestCount = 0,
  maxRequests = 0,
  subscriptionStatus
}: BulkSearchProps) => {
  const [urls, setUrls] = useState<string>("");
  const [numberOfVideos, setNumberOfVideos] = useState(3);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { toast } = useToast();

  const isFreeUser = !subscriptionStatus?.subscribed;

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

    if (isDisabled) {
      toast({
        title: "Pro Plan Limit Reached",
        description: "You've used all your Pro plan searches for this month. Consider upgrading to our Creator on Steroids plan for unlimited searches.",
        variant: "destructive",
      });
      return;
    }

    try {
      await onSearch(urlList, numberOfVideos, selectedDate);
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-xl mx-auto p-3 sm:p-6 rounded-2xl sm:rounded-xl">
        <DialogHeader className="space-y-2 mb-4">
          <DialogTitle className="text-base sm:text-xl font-semibold tracking-tight">
            Bulk Search
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm text-muted-foreground">
            {isFreeUser ? (
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                <span>Bulk search is available for Pro and Creator on Steroids plans</span>
              </div>
            ) : (
              "Enter Instagram URLs (one per line) to search multiple profiles at once."
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 sm:space-y-6 flex flex-col items-center">
          <div className="w-full space-y-2">
            <label className="text-xs sm:text-sm font-medium text-foreground flex items-center gap-1">
              Instagram URLs
              <span className="text-[10px] text-muted-foreground">(max {MAX_URLS})</span>
            </label>
            <Textarea
              placeholder={isFreeUser ? "Upgrade to Pro or Creator on Steroids plan to use bulk search" : `Enter Instagram URLs (one per line, maximum ${MAX_URLS} URLs)`}
              className="min-h-[120px] sm:min-h-[200px] font-mono text-xs sm:text-sm resize-none bg-background border-input focus:ring-2 focus:ring-primary/20 rounded-xl w-full"
              value={urls}
              onChange={(e) => setUrls(e.target.value)}
              disabled={isLoading || isDisabled || isFreeUser}
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
            disabled={isLoading || isDisabled || isFreeUser}
          />

          <div className="flex justify-center w-full">
            <Button 
              onClick={handleSearch}
              disabled={isLoading || !urls || isDisabled || isFreeUser}
              className={`w-full h-10 text-[11px] font-medium transition-all duration-300 ${
                urls && !isFreeUser ? "instagram-gradient" : "bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-700 dark:to-gray-800"
              } text-white dark:text-gray-100 shadow-sm hover:shadow-md`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                  Searching...
                </>
              ) : isFreeUser ? (
                <>
                  <Lock className="mr-2 h-3.5 w-3.5" />
                  Upgrade to Use Bulk Search
                </>
              ) : isDisabled ? (
                <>
                  <Search className="mr-2 h-3.5 w-3.5" />
                  Pro Plan Limit Reached ({requestCount}/{maxRequests})
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