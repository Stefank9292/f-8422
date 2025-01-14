import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { FilterHeader } from "./FilterHeader";
import { FilterGrid } from "./FilterGrid";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface FilterContainerProps {
  totalResults: number;
  filteredResults: number;
  onReset: () => void;
  currentPosts: any[];
  children: React.ReactNode;
  exportComponent?: React.ReactNode;
}

export const FilterContainer = ({
  totalResults,
  filteredResults,
  onReset,
  currentPosts,
  children,
  exportComponent
}: FilterContainerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="animate-fade-in">
      <FilterHeader 
        totalResults={totalResults}
        filteredResults={filteredResults}
        onReset={onReset}
        currentPosts={currentPosts}
        isMobile={isMobile}
        exportComponent={exportComponent}
      />
      
      <CollapsibleContent className="space-y-6 px-4 sm:px-6 py-6 bg-card/50 border-x border-b border-border/50 rounded-b-xl">
        <FilterGrid>
          {children}
        </FilterGrid>
      </CollapsibleContent>
    </Collapsible>
  );
};