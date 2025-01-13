import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useSearchHistoryActions = (userId: string | undefined) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeletingAll, setIsDeletingAll] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleDelete = async (id: string) => {
    if (!userId) return;

    try {
      setIsDeleting(true);
      const { error } = await supabase
        .from('search_history')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['search-history'] });
      
      toast({
        title: "Success",
        description: "Search history item deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting search history:', error);
      toast({
        title: "Error",
        description: "Failed to delete search history item",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteAll = async () => {
    if (!userId) return;

    try {
      setIsDeletingAll(true);
      const { error } = await supabase
        .from('search_history')
        .delete()
        .eq('user_id', userId);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['search-history'] });
      
      toast({
        title: "Success",
        description: "All search history deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting all search history:', error);
      toast({
        title: "Error",
        description: "Failed to delete all search history",
        variant: "destructive",
      });
    } finally {
      setIsDeletingAll(false);
    }
  };

  return {
    isDeleting,
    isDeletingAll,
    handleDelete,
    handleDeleteAll,
  };
};