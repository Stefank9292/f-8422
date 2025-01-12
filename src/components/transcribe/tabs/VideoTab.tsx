import { useState } from "react";
import { TranscribeForm } from "@/components/transcribe/TranscribeForm";
import { TranscriptionDisplay } from "@/components/transcribe/TranscriptionDisplay";
import { ScriptVariation } from "@/components/transcribe/ScriptVariation";
import { TranscriptionStage } from "@/components/transcribe/TranscriptionProgress";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useTranscriptionStore } from "@/store/transcriptionStore";
import { useEffect } from "react";

export function VideoTab() {
  const [transcriptionStage, setTranscriptionStage] = useState<TranscriptionStage | undefined>();
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentTranscriptionId, setCurrentTranscriptionId] = useState<string | null>(() => {
    return localStorage.getItem('currentTranscriptionId') || null;
  });
  
  const {
    videoTranscription,
    videoGeneratedScript,
    setVideoTranscription,
    setVideoGeneratedScript
  } = useTranscriptionStore();

  const queryClient = useQueryClient();
  const { toast } = useToast();

  useEffect(() => {
    const handleBeforeUnload = () => {
      setVideoTranscription(undefined);
      setVideoGeneratedScript(undefined);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [setVideoTranscription, setVideoGeneratedScript]);

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
          user_id: (await supabase.auth.getUser()).data.user?.id,
          original_text: data.text,
          script_type: 'transcription' as const
        })
        .select()
        .single();

      if (scriptError) throw scriptError;
      
      setTranscriptionStage('completed');
      setVideoTranscription(data.text);
      const newTranscriptionId = scriptData.id;
      setCurrentTranscriptionId(newTranscriptionId);
      localStorage.setItem('currentTranscriptionId', newTranscriptionId);
      return scriptData;
    },
  });

  const generateVariation = async () => {
    if (!videoTranscription) {
      toast({
        title: "Error",
        description: "No transcription available. Please transcribe a video first.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsGenerating(true);
      const { data: aiResponse, error: aiError } = await supabase.functions.invoke('generate-script', {
        body: { text: videoTranscription }
      });

      if (aiError) throw aiError;

      const { data: scriptData, error: scriptError } = await supabase
        .from('scripts')
        .insert({
          user_id: (await supabase.auth.getUser()).data.user?.id,
          original_text: videoTranscription,
          variation_text: aiResponse.text,
          script_type: 'variation' as const,
          parent_script_id: currentTranscriptionId
        })
        .select()
        .single();

      if (scriptError) throw scriptError;
      
      setVideoGeneratedScript(aiResponse.text);
    } catch (error) {
      console.error('Error generating variation:', error);
      toast({
        title: "Error",
        description: "Failed to generate script variation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleTranscribe = async (url: string) => {
    await transcribeMutation.mutateAsync(url);
    queryClient.invalidateQueries({ queryKey: ['scripts'] });
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <TranscribeForm 
        onSubmit={handleTranscribe}
        isLoading={transcribeMutation.isPending}
        stage={transcriptionStage}
      />
      {videoTranscription && (
        <TranscriptionDisplay 
          transcription={videoTranscription}
          onGenerateVariation={generateVariation}
          isGenerating={isGenerating}
        />
      )}
      {videoGeneratedScript && (
        <ScriptVariation variation={videoGeneratedScript} />
      )}
    </div>
  );
}