import { FilterInput } from "../FilterInput";
import { Calendar, Heart, Eye, Play, MessageSquare, Zap } from "lucide-react";

interface SearchFiltersProps {
  date: string;
  setDate: (value: string) => void;
  minLikes: string;
  setMinLikes: (value: string) => void;
  minViews: string;
  setMinViews: (value: string) => void;
  minPlays: string;
  setMinPlays: (value: string) => void;
  minComments: string;
  setMinComments: (value: string) => void;
  minEngagement: string;
  setMinEngagement: (value: string) => void;
}

export const SearchFilters = ({
  date,
  setDate,
  minLikes,
  setMinLikes,
  minViews,
  setMinViews,
  minPlays,
  setMinPlays,
  minComments,
  setMinComments,
  minEngagement,
  setMinEngagement,
}: SearchFiltersProps) => {
  return (
    <>
      <FilterInput
        icon={Calendar}
        label="Posts newer than"
        value={date}
        onChange={setDate}
        placeholder="DD.MM.YYYY"
        isDatePicker
      />
      <FilterInput
        icon={Eye}
        label="Min. Views"
        value={minViews}
        onChange={setMinViews}
        type="number"
        placeholder="e.g., 10000"
      />
      <FilterInput
        icon={Play}
        label="Min. Plays"
        value={minPlays}
        onChange={setMinPlays}
        type="number"
        placeholder="e.g., 5000"
      />
      <FilterInput
        icon={Heart}
        label="Min. Likes"
        value={minLikes}
        onChange={setMinLikes}
        type="number"
        placeholder="e.g., 1000"
      />
      <FilterInput
        icon={MessageSquare}
        label="Min. Comments"
        value={minComments}
        onChange={setMinComments}
        type="number"
        placeholder="e.g., 100"
      />
      <FilterInput
        icon={Zap}
        label="Min. Engagement (%)"
        value={minEngagement}
        onChange={setMinEngagement}
        type="number"
        placeholder="e.g., 5.5"
      />
    </>
  );
};