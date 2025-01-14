import { Table, TableBody } from "@/components/ui/table";
import { TooltipProvider } from "@/components/ui/tooltip";

interface TableContainerProps {
  children: React.ReactNode;
}

export const TableContainer = ({ children }: TableContainerProps) => {
  return (
    <TooltipProvider>
      <div className="rounded-xl overflow-hidden border border-border/50 bg-white/90 dark:bg-gray-800/90 
                    backdrop-blur-sm shadow-lg transition-all duration-300">
        <Table>
          {children}
        </Table>
      </div>
    </TooltipProvider>
  );
};