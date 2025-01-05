import { Calendar, Eye, Play, Heart, MessageCircle, Clock, Zap, ChevronDown, Filter, X } from "lucide-react";
import { FilterHeader } from "./FilterHeader";
import { FilterInput } from "./FilterInput";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ExportCSV } from "./ExportCSV";

interface FiltersType {
  minViews: string;
  minPlays: string;
  minLikes: string;
  minComments: string;
  minDuration: string;
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
      label: "Minimum Views",
      value: filters.minViews,
      onChange: (value: string) => onFilterChange('minViews', value),
      placeholder: "e.g. 10000",
      type: "number"
    },
    {
      icon: Play,
      label: "Minimum Plays",
      value: filters.minPlays,
      onChange: (value: string) => onFilterChange('minPlays', value),
      placeholder: "e.g. 5000",
      type: "number"
    },
    {
      icon: Heart,
      label: "Minimum Likes",
      value: filters.minLikes,
      onChange: (value: string) => onFilterChange('minLikes', value),
      placeholder: "e.g. 1000",
      type: "number"
    },
    {
      icon: MessageCircle,
      label: "Minimum Comments",
      value: filters.minComments,
      onChange: (value: string) => onFilterChange('minComments', value),
      placeholder: "e.g. 100",
      type: "number"
    },
    {
      icon: Clock,
      label: "Minimum Duration",
      value: filters.minDuration,
      onChange: (value: string) => onFilterChange('minDuration', value),
      placeholder: "e.g. 30"
    },
    {
      icon: Zap,
      label: "Minimum Engagement",
      value: filters.minEngagement,
      onChange: (value: string) => onFilterChange('minEngagement', value),
      placeholder: "e.g. 5"
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="hidden md:block">
        <FilterHeader
          totalResults={totalResults}
          filteredResults={filteredResults}
          onReset={onReset}
          currentPosts={currentPosts}
        />
      </div>

      <div className="md:hidden">
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>
            <Button 
              variant="outline" 
              className="w-full flex items-center justify-between p-4"
            >
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span className="text-sm font-medium">Filter Results</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  Showing {filteredResults} of {totalResults}
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} />
              </div>
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4">
            <div className="space-y-6 bg-card/50 rounded-lg p-4">
              {filterInputs.map((input, index) => (
                <FilterInput
                  key={index}
                  icon={input.icon}
                  label={input.label}
                  value={input.value}
                  onChange={input.onChange}
                  placeholder={input.placeholder}
                  type={input.type}
                  isDatePicker={input.isDatePicker}
                  helpText={input.helpText}
                />
              ))}
              <div className="flex flex-col gap-3 pt-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={onReset}
                  className="w-full h-10 text-xs font-medium"
                >
                  <X className="w-3.5 h-3.5 mr-2" />
                  Reset Filters
                </Button>
                <ExportCSV currentPosts={currentPosts} />
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>

      <div className="hidden md:block">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 bg-card/50 p-6 rounded-lg">
          {filterInputs.map((input, index) => (
            <FilterInput
              key={index}
              icon={input.icon}
              label={input.label}
              value={input.value}
              onChange={input.onChange}
              placeholder={input.placeholder}
              type={input.type}
              isDatePicker={input.isDatePicker}
              helpText={input.helpText}
            />
          ))}
        </div>
      </div>
    </div>
  );
};