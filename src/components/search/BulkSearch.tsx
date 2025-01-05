import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { BulkSearchSettings } from "./BulkSearchSettings";
import { Search, X, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BulkSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (urls: string[], numberOfVideos: number, selectedDate: Date | undefined) => Promise<void>;
  isLoading?: boolean;
}

const MAX_URLS = 20;

export const BulkSearch = ({ isOpen, onClose, onSearch, isLoading = false }: BulkSearchProps) => {
  const [urls, setUrls] = useState<string>("");
  const [numberOfVideos, setNumberOfVideos] = useState(3);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { toast } = useToast();

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
            Enter Instagram URLs (one per line) to search multiple profiles at once.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 sm:space-y-6 flex flex-col items-center">
          <div className="space-y-2 w-full max-w-md mx-auto">
            <label className="text-xs sm:text-sm font-medium text-foreground flex items-center gap-1">
              Instagram URLs
              <span className="text-[10px] text-muted-foreground">(max {MAX_URLS})</span>
            </label>
            <Textarea
              placeholder={`Enter Instagram URLs (one per line, maximum ${MAX_URLS} URLs)`}
              className="min-h-[120px] sm:min-h-[200px] font-mono text-xs sm:text-sm resize-none bg-background border-input focus:ring-2 focus:ring-primary/20 rounded-xl"
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

          <div className="flex flex-col-reverse sm:flex-row justify-center gap-2 sm:gap-3 mt-4 sm:mt-6 w-full max-w-md">
            <Button
              variant="outline"
              onClick={onClose}
              className="h-10 sm:h-9 px-4 sm:px-6 text-xs sm:text-sm font-medium bg-[#8E9196]/10 hover:bg-[#8E9196]/20 text-[#8E9196] border-[#8E9196]/20 rounded-xl"
              disabled={isLoading}
            >
              <X className="w-3.5 h-3.5 mr-2" />
              Cancel
            </Button>

            <Button
              onClick={handleSearch}
              className="h-10 sm:h-9 px-4 sm:px-6 text-xs sm:text-sm font-medium primary-gradient text-white mb-2 sm:mb-0 rounded-xl"
              disabled={isLoading}
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