import { TikTokPost } from "@/types/tiktok";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, Play, Heart, MessageCircle, Share2, Zap } from "lucide-react";

interface TikTokSearchFiltersProps {
  filters: any;
  onFilterChange: (key: string, value: string) => void;
  onReset: () => void;
  totalResults: number;
  filteredResults: number;
  currentPosts: TikTokPost[];
}

export function TikTokSearchFilters({
  filters,
  onFilterChange,
  onReset,
  totalResults,
  filteredResults,
}: TikTokSearchFiltersProps) {
  const filterInputs = [
    {
      icon: Eye,
      label: "Min. Views",
      value: filters.minViews || "",
      onChange: (value: string) => onFilterChange('minViews', value),
      placeholder: "e.g. 10000"
    },
    {
      icon: Play,
      label: "Min. Plays",
      value: filters.minPlays || "",
      onChange: (value: string) => onFilterChange('minPlays', value),
      placeholder: "e.g. 5000"
    },
    {
      icon: Heart,
      label: "Min. Likes",
      value: filters.minLikes || "",
      onChange: (value: string) => onFilterChange('minLikes', value),
      placeholder: "e.g. 1000"
    },
    {
      icon: MessageCircle,
      label: "Min. Comments",
      value: filters.minComments || "",
      onChange: (value: string) => onFilterChange('minComments', value),
      placeholder: "e.g. 100"
    },
    {
      icon: Share2,
      label: "Min. Shares",
      value: filters.minShares || "",
      onChange: (value: string) => onFilterChange('minShares', value),
      placeholder: "e.g. 50"
    },
    {
      icon: Zap,
      label: "Min. Engagement",
      value: filters.minEngagement || "",
      onChange: (value: string) => onFilterChange('minEngagement', value),
      placeholder: "e.g. 5"
    }
  ];

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          Showing {filteredResults} of {totalResults} results
        </span>
        <button
          onClick={onReset}
          className="text-xs text-primary hover:underline"
        >
          Reset Filters
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {filterInputs.map((filter, index) => {
          const Icon = filter.icon;
          return (
            <div key={index} className="space-y-1.5">
              <Label className="text-xs font-medium flex items-center gap-1.5">
                <Icon className="h-3.5 w-3.5" />
                {filter.label}
              </Label>
              <Input
                type="number"
                value={filter.value}
                onChange={(e) => filter.onChange(e.target.value)}
                placeholder={filter.placeholder}
                className="h-8 text-xs"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}