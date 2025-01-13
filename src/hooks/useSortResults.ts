import { useState } from "react";
import { InstagramPost } from "@/types/instagram";

export type SortDirection = "asc" | "desc";

export function useSortResults(initialResults: InstagramPost[]) {
  const [sortKey, setSortKey] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection(prev => prev === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDirection("desc");
    }
  };

  const sortedResults = [...initialResults].sort((a, b) => {
    if (!sortKey) return 0;

    let valueA = a[sortKey as keyof typeof a];
    let valueB = b[sortKey as keyof typeof b];

    if (sortKey === 'date' || sortKey === 'timestamp') {
      valueA = new Date(valueA as string).getTime();
      valueB = new Date(valueB as string).getTime();
    } else if (sortKey === 'engagement') {
      valueA = parseFloat((valueA as string).replace('%', ''));
      valueB = parseFloat((valueB as string).replace('%', ''));
    }

    if (sortDirection === 'asc') {
      return valueA > valueB ? 1 : -1;
    }
    return valueA < valueB ? 1 : -1;
  });

  return {
    sortKey,
    sortDirection,
    handleSort,
    sortedResults
  };
}