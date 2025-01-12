import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Transcribe = () => {
  const { toast } = useToast();

  const { data: scripts, isLoading } = useQuery({
    queryKey: ['scripts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('scripts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load scripts. Please try again.",
        });
        throw error;
      }
      
      return data;
    },
  });

  return (
    <div className="container mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold">Instagram Video Transcriber</h1>
      <div className="grid gap-4">
        {/* Form and content will be added in the next implementation phase */}
        <p className="text-muted-foreground">Coming soon...</p>
      </div>
    </div>
  );
};

export default Transcribe;