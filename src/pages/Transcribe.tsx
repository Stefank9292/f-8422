import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { TranscribeForm } from "@/components/transcribe/TranscribeForm";
import { TranscriptionDisplay } from "@/components/transcribe/TranscriptionDisplay";
import { ScriptVariation } from "@/components/transcribe/ScriptVariation";
import { TranscriptionStage } from "@/components/transcribe/TranscriptionProgress";

const Transcribe = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [currentTranscriptionId, setCurrentTranscriptionId] = useState<string | null>(null);
  const [transcriptionStage, setTranscriptionStage] = useState<TranscriptionStage | undefined>();

  const transcribeMutation = useMutation({
    mutationFn: async (url: string) => {
      setTranscriptionStage('preparing');
      
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate preparation time
      setTranscriptionStage('downloading');
      
      const { data, error } = await supabase.functions.invoke('transcribe', {
        body: { url }
      });

      if (error) throw error;
      
      setTranscriptionStage('transcribing');
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate transcription time
      
      setTranscriptionStage('completed');
      return data;
    },
    onSuccess: (data) => {
      setCurrentTranscriptionId(data.id);
      queryClient.invalidateQueries({ queryKey: ['scripts'] });
      toast({
        title: "Success",
        description: "Video transcribed successfully!",
      });
    },
    onError: (error) => {
      setTranscriptionStage(undefined);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to transcribe video",
      });
    },
  });

  const generateVariationMutation = useMutation({
    mutationFn: async () => {
      if (!currentTranscriptionId) throw new Error("No transcription selected");
      
      const { data, error } = await supabase.functions.invoke('generate-variation', {
        body: { transcriptionId: currentTranscriptionId }
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scripts'] });
      toast({
        title: "Success",
        description: "Script variation generated successfully!",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate variation",
      });
    },
  });

  const { data: scripts, isLoading: isLoadingScripts } = useQuery({
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

  const currentTranscription = scripts?.find(s => s.id === currentTranscriptionId);
  const variations = scripts?.filter(s => s.parent_script_id === currentTranscriptionId);

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">Instagram Video Transcriber</h1>
      
      <TranscribeForm 
        onSubmit={(url) => transcribeMutation.mutateAsync(url)}
        isLoading={transcribeMutation.isPending}
        stage={transcriptionStage}
      />

      {currentTranscription && (
        <div className="space-y-6">
          <TranscriptionDisplay 
            transcription={currentTranscription.original_text}
            onGenerateVariation={() => generateVariationMutation.mutateAsync()}
            isGenerating={generateVariationMutation.isPending}
          />

          {variations && variations.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Generated Variations</h2>
              {variations.map((variation) => (
                <ScriptVariation 
                  key={variation.id}
                  variation={variation.original_text}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Transcribe;