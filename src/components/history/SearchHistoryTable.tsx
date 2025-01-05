import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import { useState } from "react";
import { SearchResultDetails } from "./SearchResultDetails";
import { FilterHeader } from "./FilterHeader";
import { SearchFilters } from "@/components/search/SearchFilters";

interface SearchHistoryTableProps {
  searchHistory: Array<{
    id: string;
    search_query: string;
    created_at: string;
    search_results?: Array<{ results: any[] }>;
  }>;
  onDelete: (id: string) => void;
  isDeleting: boolean;
  filters: {
    minViews: string;
    minLikes: string;
    minComments: string;
    postsNewerThan: string;
  };
  onFilterChange: (key: string, value: string) => void;
  onReset: () => void;
  totalResults: number;
  filteredResults: number;
  currentPosts: any[];
}

export function SearchHistoryTable({ 
  searchHistory, 
  onDelete, 
  isDeleting,
  filters,
  onFilterChange,
  onReset,
  totalResults,
  filteredResults,
  currentPosts
}: SearchHistoryTableProps) {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const toggleRow = (id: string) => {
    const newExpandedRows = new Set(expandedRows);
    if (expandedRows.has(id)) {
      newExpandedRows.delete(id);
    } else {
      newExpandedRows.add(id);
    }
    setExpandedRows(newExpandedRows);
  };

  return (
    <div className="space-y-4">
      <SearchFilters
        filters={{
          minViews: filters.minViews,
          minPlays: "0",
          minLikes: filters.minLikes,
          minComments: filters.minComments,
          minDuration: "0",
          minEngagement: "0",
          postsNewerThan: filters.postsNewerThan,
        }}
        onFilterChange={onFilterChange}
        onReset={onReset}
        totalResults={totalResults}
        filteredResults={filteredResults}
        currentPosts={currentPosts}
      />
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40px]"></TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Results</TableHead>
              <TableHead className="w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {searchHistory.map((item) => {
              const isExpanded = expandedRows.has(item.id);
              const results = item.search_results?.[0]?.results || [];

              return (
                <>
                  <TableRow key={item.id}>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleRow(item.id)}
                        className="h-8 w-8 p-0"
                      >
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </TableCell>
                    <TableCell className="font-medium">@{item.search_query}</TableCell>
                    <TableCell>{format(new Date(item.created_at), 'MMM d, HH:mm')}</TableCell>
                    <TableCell>{results.length} results</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(item.id)}
                        disabled={isDeleting}
                        className="h-8 w-8 p-0"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                  {isExpanded && results.length > 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="p-0">
                        <div className="pl-2 py-2 space-y-2 bg-muted/30">
                          {results.map((result, index) => (
                            <SearchResultDetails key={index} result={result} />
                          ))}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}