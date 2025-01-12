import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { TranscribeForm } from "@/components/transcribe/TranscribeForm";
import { TranscriptionDisplay } from "@/components/transcribe/TranscriptionDisplay";
import { ScriptVariation } from "@/components/transcribe/ScriptVariation";
import { TranscriptionStage } from "@/components/transcribe/TranscriptionProgress";
import { useSessionValidation } from "@/hooks/useSessionValidation";
import { Tables } from "@/integrations/supabase/types";

type Script = Tables<"scripts">;

const Transcribe = () => {
  const { session } = useSessionValidation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [currentTranscriptionId, setCurrentTranscriptionId] = useState<string | null>(() => {
    // Initialize from localStorage if available
    return localStorage.getItem('currentTranscriptionId') || null;
  });
  const [transcriptionStage, setTranscriptionStage] = useState<TranscriptionStage | undefined>();

  const transcribeMutation = useMutation({
    mutationFn: async (url: string) => {
      setTranscriptionStage('preparing');
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      setTranscriptionStage('downloading');
      
      const { data, error } = await supabase.functions.invoke('transcribe', {
        body: { url }
      });

      if (error) throw error;
      
      setTranscriptionStage('transcribing');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const { data: scriptData, error: scriptError } = await supabase
        .from('scripts')
        .insert({
          user_id: session?.user.id,
          original_text: data.text,
          script_type: 'transcription'
        })
        .select()
        .single();

      if (scriptError) throw scriptError;
      
      setTranscriptionStage('completed');
      const newTranscriptionId = scriptData.id;
      setCurrentTranscriptionId(newTranscriptionId);
      // Store in localStorage
      localStorage.setItem('currentTranscriptionId', newTranscriptionId);
      return scriptData;
    },
    onSuccess: () => {
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

  const generateVariationMutation = useMutation<Script>({
    mutationFn: async () => {
      if (!currentTranscriptionId) throw new Error("No transcription selected");
      
      const { data, error } = await supabase.functions.invoke('generate-variation', {
        body: { transcriptionId: currentTranscriptionId }
      });

      if (error) throw error;
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['variations', currentTranscriptionId] });
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

  const { data: scripts } = useQuery({
    queryKey: ['scripts', currentTranscriptionId],
    queryFn: async () => {
      if (!currentTranscriptionId) return null;
      
      const { data, error } = await supabase
        .from('scripts')
        .select('*')
        .eq('id', currentTranscriptionId)
        .single();
      
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
    enabled: !!currentTranscriptionId,
    staleTime: Infinity, // Keep data fresh indefinitely
    gcTime: 1000 * 60 * 60, // Cache for 1 hour (formerly cacheTime)
  });

  const { data: variations } = useQuery({
    queryKey: ['variations', currentTranscriptionId],
    queryFn: async () => {
      if (!currentTranscriptionId) return [];
      
      const { data, error } = await supabase
        .from('scripts')
        .select('*')
        .eq('parent_script_id', currentTranscriptionId);
      
      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load variations. Please try again.",
        });
        throw error;
      }
      
      return data;
    },
    enabled: !!currentTranscriptionId,
    staleTime: Infinity, // Keep data fresh indefinitely
    gcTime: 1000 * 60 * 60, // Cache for 1 hour (formerly cacheTime)
  });

  return (
    <div className="container max-w-4xl py-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-xl font-semibold tracking-tight">Video Transcriber</h1>
        <p className="text-sm text-muted-foreground">
          Transform your Instagram videos into text with our AI-powered transcription service.
        </p>
      </div>
      
      <TranscribeForm 
        onSubmit={(url) => transcribeMutation.mutateAsync(url)}
        isLoading={transcribeMutation.isPending}
        stage={transcriptionStage}
      />

      {scripts && (
        <div className="space-y-6">
          <TranscriptionDisplay 
            transcription={scripts.original_text}
            onGenerateVariation={() => generateVariationMutation.mutateAsync()}
            isGenerating={generateVariationMutation.isPending}
          />

          {variations && variations.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Generated Variations</h2>
              <div className="grid gap-4">
                {variations.map((variation) => (
                  <ScriptVariation 
                    key={variation.id}
                    variation={variation.variation_text || variation.original_text}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Transcribe;