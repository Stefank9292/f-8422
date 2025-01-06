import { SearchHeader } from "../SearchHeader";

export const SearchHeaderSection = () => {
  return (
    <div className="space-y-4 sm:space-y-6 w-full max-w-md">
      <SearchHeader />
      <p className="text-[11px] text-muted-foreground text-center max-w-xl mx-auto">
        Save time finding viral content for social media
      </p>
    </div>
  );
};