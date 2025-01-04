import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SearchSettings } from "./SearchSettings";
import { Search, X, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BulkSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (urls: string[], numberOfVideos: number, selectedDate: Date | undefined) => Promise<void>;
  isLoading?: boolean;
}

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

    try {
      await onSearch(urlList, numberOfVideos, selectedDate);
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
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Bulk Search</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-lg font-medium">Instagram URLs</label>
            <Textarea
              placeholder="Enter Instagram URLs (one per line)"
              className="min-h-[200px] font-mono"
              value={urls}
              onChange={(e) => setUrls(e.target.value)}
            />
            <p className="text-sm text-gray-500 text-right">
              {urls.split('\n').filter(url => url.trim() !== "").length} URLs
            </p>
          </div>

          <SearchSettings
            isSettingsOpen={isSettingsOpen}
            setIsSettingsOpen={setIsSettingsOpen}
            numberOfVideos={numberOfVideos}
            setNumberOfVideos={setNumberOfVideos}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
          />

          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="gap-2"
              disabled={isLoading}
            >
              <X className="w-4 h-4" />
              Cancel
            </Button>
            <Button
              onClick={handleSearch}
              className="gap-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  Search Videos
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};