import { useState } from "react";
import { FileToScriptForm } from "@/components/transcribe/FileToScriptForm";
import { TranscriptionDisplay } from "@/components/transcribe/TranscriptionDisplay";
import { ScriptVariation } from "@/components/transcribe/ScriptVariation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useTranscriptionStore } from "@/store/transcriptionStore";
import { useEffect } from "react";

export function FileTab() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentTranscriptionId, setCurrentTranscriptionId] = useState<string | null>(() => {
    return localStorage.getItem('currentTranscriptionId') || null;
  });

  const {
    fileTranscription,
    fileGeneratedScript,
    setFileTranscription,
    setFileGeneratedScript
  } = useTranscriptionStore();

  const queryClient = useQueryClient();
  const { toast } = useToast();

  useEffect(() => {
    const handleBeforeUnload = () => {
      setFileTranscription(undefined);
      setFileGeneratedScript(undefined);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [setFileTranscription, setFileGeneratedScript]);

  const fileToScriptMutation = useMutation({
    mutationFn: async (filePath: string) => {
      const { data, error } = await supabase.functions.invoke('transcribe-file', {
        body: { filePath }
      });

      if (error) throw error;

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
      
      setFileTranscription(data.text);
      const newTranscriptionId = scriptData.id;
      setCurrentTranscriptionId(newTranscriptionId);
      localStorage.setItem('currentTranscriptionId', newTranscriptionId);
      return scriptData;
    },
  });

  const generateVariation = async () => {
    if (!fileTranscription) {
      toast({
        title: "Error",
        description: "No transcription available. Please transcribe a file first.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsGenerating(true);
      const { data: aiResponse, error: aiError } = await supabase.functions.invoke('generate-script', {
        body: { text: fileTranscription }
      });

      if (aiError) throw aiError;

      const { data: scriptData, error: scriptError } = await supabase
        .from('scripts')
        .insert({
          user_id: (await supabase.auth.getUser()).data.user?.id,
          original_text: fileTranscription,
          variation_text: aiResponse.text,
          script_type: 'variation' as const,
          parent_script_id: currentTranscriptionId
        })
        .select()
        .single();

      if (scriptError) throw scriptError;
      
      setFileGeneratedScript(aiResponse.text);
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

  const handleFileToScript = async (filePath: string) => {
    await fileToScriptMutation.mutateAsync(filePath);
    queryClient.invalidateQueries({ queryKey: ['scripts'] });
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <FileToScriptForm
        onSubmit={handleFileToScript}
        isLoading={fileToScriptMutation.isPending}
      />
      {fileTranscription && (
        <TranscriptionDisplay 
          transcription={fileTranscription}
          onGenerateVariation={generateVariation}
          isGenerating={isGenerating}
        />
      )}
      {fileGeneratedScript && (
        <ScriptVariation variation={fileGeneratedScript} />
      )}
    </div>
  );
}