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
      <DialogContent className="w-[95vw] max-w-xl mx-auto p-4 sm:p-6">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-lg sm:text-xl font-semibold tracking-tight">
            Bulk Search
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Enter Instagram URLs (one per line) to search multiple profiles at once.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 sm:space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Instagram URLs (max {MAX_URLS})
            </label>
            <Textarea
              placeholder={`Enter Instagram URLs (one per line, maximum ${MAX_URLS} URLs)`}
              className="min-h-[150px] sm:min-h-[200px] font-mono text-sm resize-none bg-background border-input focus:ring-2 focus:ring-primary/20"
              value={urls}
              onChange={(e) => setUrls(e.target.value)}
              disabled={isLoading}
            />
            <p className={`text-xs ${urls.split('\n').filter(url => url.trim() !== "").length > MAX_URLS ? 'text-destructive' : 'text-muted-foreground'} text-right`}>
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

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-6">
            <Button
              variant="outline"
              onClick={onClose}
              className="h-12 sm:h-10 px-6 text-sm font-medium bg-[#8E9196]/10 hover:bg-[#8E9196]/20 text-[#8E9196] border-[#8E9196]/20 w-full sm:w-auto"
              disabled={isLoading}
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>

            <Button
              onClick={handleSearch}
              className="h-12 sm:h-10 px-6 text-sm font-medium primary-gradient text-white w-full sm:w-auto mb-2 sm:mb-0"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
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