import { TikTokTableContent } from "./TikTokTableContent";
import { TikTokFilterHeader } from "./TikTokFilterHeader";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { FilterInput } from "../search/FilterInput";
import { Eye, Heart, MessageCircle, Zap } from "lucide-react";

interface TikTokSearchResultsProps {
  searchResults?: any[];
}

interface FiltersType {
  minViews: string;
  minLikes: string;
  minComments: string;
  minEngagement: string;
}

export const TikTokSearchResults = ({ searchResults = [] }: TikTokSearchResultsProps) => {
  const { toast } = useToast();
  const [currentPage] = useState(1);
  const [pageSize] = useState(25);
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FiltersType>({
    minViews: '',
    minLikes: '',
    minComments: '',
    minEngagement: ''
  });

  const handleCopyCaption = (caption: string) => {
    navigator.clipboard.writeText(caption);
    toast({
      description: "Caption copied to clipboard",
    });
  };

  const formatNumber = (num: number | undefined | null): string => {
    if (num === undefined || num === null) return '0';
    return num.toLocaleString('de-DE').replace(/,/g, '.');
  };

  const truncateCaption = (caption: string) => caption;

  const handleFilterChange = (key: keyof FiltersType, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters({
      minViews: '',
      minLikes: '',
      minComments: '',
      minEngagement: ''
    });
  };

  const filterResults = (results: any[]) => {
    return results.filter(post => {
      const views = post.playCount || post.views || 0;
      const likes = post.likeCount || post.likes || 0;
      const comments = post.commentCount || post.comments || 0;
      const engagement = ((likes + comments) / (views || 1)) * 100 || 0;

      return (
        (!filters.minViews || views >= parseInt(filters.minViews)) &&
        (!filters.minLikes || likes >= parseInt(filters.minLikes)) &&
        (!filters.minComments || comments >= parseInt(filters.minComments)) &&
        (!filters.minEngagement || engagement >= parseInt(filters.minEngagement))
      );
    });
  };

  const filteredResults = filterResults(searchResults);

  if (!searchResults.length) {
    return null;
  }

  const filterInputs = [
    {
      icon: Eye,
      label: "Min. Views",
      value: filters.minViews,
      onChange: (value: string) => handleFilterChange('minViews', value),
      placeholder: "e.g. 10000",
      type: "number"
    },
    {
      icon: Heart,
      label: "Min. Likes",
      value: filters.minLikes,
      onChange: (value: string) => handleFilterChange('minLikes', value),
      placeholder: "e.g. 1000",
      type: "number"
    },
    {
      icon: MessageCircle,
      label: "Min. Comments",
      value: filters.minComments,
      onChange: (value: string) => handleFilterChange('minComments', value),
      placeholder: "e.g. 100",
      type: "number"
    },
    {
      icon: Zap,
      label: "Min. Engagement",
      value: filters.minEngagement,
      onChange: (value: string) => handleFilterChange('minEngagement', value),
      placeholder: "e.g. 5",
      type: "number"
    }
  ];

  return (
    <div className="w-full space-y-6">
      <div className="rounded-xl overflow-hidden border border-border/50">
        <TikTokFilterHeader 
          totalResults={searchResults.length}
          filteredResults={filteredResults.length}
          onReset={handleResetFilters}
          currentPosts={filteredResults}
          isMobile={false}
        />
        <div className="bg-card/50 border-x border-b border-border/50">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
            {filterInputs.map((input, index) => (
              <div key={index} className="w-full">
                <FilterInput {...input} />
              </div>
            ))}
          </div>
        </div>
      </div>
      <TikTokTableContent 
        currentPosts={filteredResults}
        handleCopyCaption={handleCopyCaption}
        formatNumber={formatNumber}
        truncateCaption={truncateCaption}
      />
    </div>
  );
};