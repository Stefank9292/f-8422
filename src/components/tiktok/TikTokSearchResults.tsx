import { ResultsContainer } from "./search-results/ResultsContainer";

interface TikTokSearchResultsProps {
  searchResults?: any[];
}

export const TikTokSearchResults = ({ searchResults = [] }: TikTokSearchResultsProps) => {
  return <ResultsContainer searchResults={searchResults} />;
};