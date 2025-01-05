import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface SearchHistoryHeaderProps {
  onDeleteAll: () => void;
  isDeletingAll: boolean;
  hasHistory: boolean;
}

export function SearchHistoryHeader({ onDeleteAll, isDeletingAll, hasHistory }: SearchHistoryHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6 p-1">
      <div className="space-y-1.5">
        <h1 className="text-2xl font-bold tracking-tight">Search History</h1>
        <p className="text-sm text-muted-foreground">
          Your last 10 searches are shown here
        </p>
      </div>
      {hasHistory && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button 
              variant="destructive" 
              disabled={isDeletingAll}
              className="w-full sm:w-auto"
            >
              {isDeletingAll ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Delete All
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete All Search History</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete all your search history.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={onDeleteAll}>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}