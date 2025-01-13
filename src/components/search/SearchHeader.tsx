import { SearchBar } from "./SearchBar";
import { SearchSettings } from "./SearchSettings";
import { BulkSearchButton } from "./BulkSearchButton";

export function SearchHeader() {
  return (
    <div className="space-y-4">
      <SearchBar />
      <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 mt-6">
        <SearchSettings />
        <BulkSearchButton />
      </div>
    </div>
  );
}