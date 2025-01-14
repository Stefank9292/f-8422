import { TikTokTableContent } from "./TikTokTableContent";
import { TikTokFilterHeader } from "./TikTokFilterHeader";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { FilterInput } from "@/components/search/FilterInput";
import { Calendar, User, Hash } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface TikTokSearchResultsProps {
  searchResults?: any[];
}

export const TikTokSearchResults = ({ searchResults = [] }: TikTokSearchResultsProps) => {
  const { toast } = useToast();
  const [currentPage] = useState(1);
  const [pageSize] = useState(25);
  const isMobile = useIsMobile();
  
  // Filter states
  const [username, setUsername] = useState("");
  const [date, setDate] = useState("");
  const [minLikes, setMinLikes] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleCopyCaption = (caption: string) => {
    navigator.clipboard.writeText(caption);
    toast({
      description: "Caption copied to clipboard",
    });
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString('de-DE').replace(/,/g, '.');
  };

  const truncateCaption = (caption: string) => caption;

  // Filter logic
  const filteredResults = searchResults.filter(post => {
    const usernameMatch = username 
      ? post.channel?.username?.toLowerCase().includes(username.toLowerCase()) ||
        post["channel.username"]?.toLowerCase().includes(username.toLowerCase())
      : true;

    const dateMatch = date
      ? post.uploadedAtFormatted?.includes(date)
      : true;

    const likesMatch = minLikes
      ? (post.likes >= parseInt(minLikes) || post["stats.likes"] >= parseInt(minLikes))
      : true;

    return usernameMatch && dateMatch && likesMatch;
  });

  const handleReset = () => {
    setUsername("");
    setDate("");
    setMinLikes("");
  };

  if (!searchResults.length) {
    return null;
  }

  return (
    <div className="w-full space-y-6">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <TikTokFilterHeader 
          totalResults={searchResults.length}
          filteredResults={filteredResults.length}
          onReset={handleReset}
          currentPosts={filteredResults}
          isMobile={isMobile}
        />
        
        <CollapsibleContent className="space-y-4 px-4 sm:px-6 py-4 bg-card/50 border-x border-b border-border/50">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FilterInput
              icon={User}
              label="Username"
              value={username}
              onChange={setUsername}
              placeholder="Filter by username..."
            />
            <FilterInput
              icon={Calendar}
              label="Upload Date"
              value={date}
              onChange={setDate}
              placeholder="DD.MM.YYYY"
              isDatePicker
            />
            <FilterInput
              icon={Hash}
              label="Min. Likes"
              value={minLikes}
              onChange={setMinLikes}
              type="number"
              placeholder="Minimum likes..."
            />
          </div>
        </CollapsibleContent>
      </Collapsible>

      <TikTokTableContent 
        currentPosts={filteredResults}
        handleCopyCaption={handleCopyCaption}
        formatNumber={formatNumber}
        truncateCaption={truncateCaption}
      />
    </div>
  );
};