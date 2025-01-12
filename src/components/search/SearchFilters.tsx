import { Calendar, Eye, Play, Heart, MessageCircle, Zap } from "lucide-react";
import { FilterHeader } from "./FilterHeader";
import { FilterInput } from "./FilterInput";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { useState } from "react";

interface FiltersType {
  minViews: string;
  minPlays: string;
  minLikes: string;
  minComments: string;
  minEngagement: string;
  postsNewerThan: string;
}

interface SearchFiltersProps {
  filters: FiltersType;
  onFilterChange: (key: keyof FiltersType, value: string) => void;
  onReset: () => void;
  totalResults: number;
  filteredResults: number;
  currentPosts: any[];
}

export const SearchFilters = ({ 
  filters, 
  onFilterChange, 
  onReset,
  totalResults,
  filteredResults,
  currentPosts
}: SearchFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const filterInputs = [
    {
      icon: Calendar,
      label: "Posts newer than",
      value: filters.postsNewerThan,
      onChange: (value: string) => onFilterChange('postsNewerThan', value),
      placeholder: "dd.mm.yyyy",
      isDatePicker: true,
      helpText: "Limited to posts from the last 90 days"
    },
    {
      icon: Eye,
      label: "Min. Views",
      value: filters.minViews,
      onChange: (value: string) => onFilterChange('minViews', value),
      placeholder: "e.g. 10000",
      type: "number"
    },
    {
      icon: Play,
      label: "Min. Plays",
      value: filters.minPlays,
      onChange: (value: string) => onFilterChange('minPlays', value),
      placeholder: "e.g. 5000",
      type: "number"
    },
    {
      icon: Heart,
      label: "Min. Likes",
      value: filters.minLikes,
      onChange: (value: string) => onFilterChange('minLikes', value),
      placeholder: "e.g. 1000",
      type: "number"
    },
    {
      icon: MessageCircle,
      label: "Min. Comments",
      value: filters.minComments,
      onChange: (value: string) => onFilterChange('minComments', value),
      placeholder: "e.g. 100",
      type: "number"
    },
    {
      icon: Zap,
      label: "Min. Engagement (%)",
      value: filters.minEngagement,
      onChange: (value: string) => onFilterChange('minEngagement', value),
      placeholder: "e.g. 5",
      type: "number"
    }
  ];

  return (
    <div className="space-y-0 animate-in fade-in">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <FilterHeader
          totalResults={totalResults}
          filteredResults={filteredResults}
          onReset={onReset}
          currentPosts={currentPosts}
          isMobile={true}
        />
        <CollapsibleContent className="mt-4">
          <div className="space-y-6 bg-card/50 rounded-lg p-4 border border-border/50">
            {filterInputs.map((input, index) => (
              <FilterInput
                key={index}
                {...input}
              />
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>

      <div className="hidden md:block">
        <FilterHeader
          totalResults={totalResults}
          filteredResults={filteredResults}
          onReset={onReset}
          currentPosts={currentPosts}
          isMobile={false}
        />
        <div className="bg-card/50 border-x border-b border-border/50">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 p-6">
            {filterInputs.map((input, index) => (
              <div key={index} className="w-full">
                <FilterInput {...input} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};