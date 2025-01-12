import { useState } from "react";
import { PromptToScriptForm } from "@/components/transcribe/PromptToScriptForm";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useTranscriptionStore } from "@/store/transcriptionStore";
import { useEffect } from "react";

export function PromptTab() {
  const { promptGeneratedScript, setPromptGeneratedScript } = useTranscriptionStore();
  const queryClient = useQueryClient();

  useEffect(() => {
    const handleBeforeUnload = () => {
      setPromptGeneratedScript(undefined);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [setPromptGeneratedScript]);

  const promptToScriptMutation = useMutation({
    mutationFn: async ({ prompt, text }: { prompt: string; text: string }) => {
      const { data: aiResponse, error: aiError } = await supabase.functions.invoke('generate-prompt-script', {
        body: { prompt, text }
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
      
      setPromptGeneratedScript(aiResponse.text);
      return scriptData;
    },
  });

  const handlePromptToScript = async (prompt: string, text: string) => {
    await promptToScriptMutation.mutateAsync({ prompt, text });
    queryClient.invalidateQueries({ queryKey: ['scripts'] });
  };

  return (
    <PromptToScriptForm 
      onSubmit={handlePromptToScript}
      isLoading={promptToScriptMutation.isPending}
      generatedScript={promptGeneratedScript}
    />
  );
}