import { FilterContainer } from "@/components/common/filters/FilterContainer";
import { FilterInput } from "@/components/search/FilterInput";
import { useState } from "react";
import { Calendar, Heart, Eye, Share2, MessageSquare, Zap } from "lucide-react";
import { ResultsTable } from "./ResultsTable";
import { TikTokExportCSV } from "../TikTokExportCSV";
import { parse } from "date-fns";

interface ResultsFiltersProps {
  searchResults: any[];
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (value: string) => void;
  onCopyCaption: (caption: string) => void;
}

export const ResultsFilters = ({
  searchResults,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
  onCopyCaption,
}: ResultsFiltersProps) => {
  const [date, setDate] = useState("");
  const [minLikes, setMinLikes] = useState("");
  const [minViews, setMinViews] = useState("");
  const [minShares, setMinShares] = useState("");
  const [minComments, setMinComments] = useState("");
  const [minEngagement, setMinEngagement] = useState("");

  const filteredResults = searchResults.filter(post => {
    const dateMatch = date
      ? (() => {
          try {
            const selectedDate = parse(date, "dd.MM.yyyy", new Date());
            const postDate = new Date(post.uploadedAtFormatted);
            return postDate > selectedDate;
          } catch (error) {
            console.error('Error parsing date:', error);
            return true;
          }
        })()
      : true;

    const likesMatch = minLikes
      ? (post.likes >= parseInt(minLikes) || post["stats.likes"] >= parseInt(minLikes))
      : true;

    const viewsMatch = minViews
      ? (post.views >= parseInt(minViews) || post["stats.views"] >= parseInt(minViews))
      : true;

    const sharesMatch = minShares
      ? (post.shares >= parseInt(minShares) || post["stats.shares"] >= parseInt(minShares))
      : true;

    const commentsMatch = minComments
      ? (post.comments >= parseInt(minComments) || post["stats.comments"] >= parseInt(minComments))
      : true;

    const engagementMatch = minEngagement
      ? (parseFloat(post.engagement) >= parseFloat(minEngagement))
      : true;

    return dateMatch && likesMatch && viewsMatch && 
           sharesMatch && commentsMatch && engagementMatch;
  });

  const handleReset = () => {
    setDate("");
    setMinLikes("");
    setMinViews("");
    setMinShares("");
    setMinComments("");
    setMinEngagement("");
  };

  return (
    <>
      <FilterContainer
        totalResults={searchResults.length}
        filteredResults={filteredResults.length}
        onReset={handleReset}
        currentPosts={filteredResults}
        exportComponent={<TikTokExportCSV currentPosts={filteredResults} />}
      >
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
          icon={Share2}
          label="Min. Shares"
          value={minShares}
          onChange={setMinShares}
          type="number"
          placeholder="e.g., 500"
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
      </FilterContainer>

      <ResultsTable
        filteredResults={filteredResults}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
        onCopyCaption={onCopyCaption}
      />
    </>
  );
};