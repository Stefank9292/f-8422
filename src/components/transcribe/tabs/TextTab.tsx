import { useState } from "react";
import { TextToScriptForm } from "@/components/transcribe/TextToScriptForm";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useTranscriptionStore } from "@/store/transcriptionStore";
import { useEffect } from "react";

export function TextTab() {
  const { textGeneratedScript, setTextGeneratedScript } = useTranscriptionStore();
  const queryClient = useQueryClient();

  useEffect(() => {
    const handleBeforeUnload = () => {
      setTextGeneratedScript(undefined);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [setTextGeneratedScript]);

  const textToScriptMutation = useMutation({
    mutationFn: async (text: string) => {
      const { data: aiResponse, error: aiError } = await supabase.functions.invoke('generate-script', {
        body: { text }
      });

      if (aiError) throw aiError;

      const { data: scriptData, error: scriptError } = await supabase
        .from('scripts')
        .insert({
          user_id: (await supabase.auth.getUser()).data.user?.id,
          original_text: text,
          variation_text: aiResponse.text,
          script_type: 'transcription' as const
        })
        .select()
        .single();

      if (scriptError) throw scriptError;
      
      setTextGeneratedScript(aiResponse.text);
      return scriptData;
    },
  });

  const handleTextToScript = async (text: string) => {
    await textToScriptMutation.mutateAsync(text);
    queryClient.invalidateQueries({ queryKey: ['scripts'] });
  };

  return (
    <TextToScriptForm 
      onSubmit={handleTextToScript}
      isLoading={textToScriptMutation.isPending}
      generatedScript={textGeneratedScript}
    />
  );
}