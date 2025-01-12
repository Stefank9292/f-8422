import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { TranscribeForm } from "@/components/transcribe/TranscribeForm";
import { TextToScriptForm } from "@/components/transcribe/TextToScriptForm";
import { PromptToScriptForm } from "@/components/transcribe/PromptToScriptForm";
import { FileToScriptForm } from "@/components/transcribe/FileToScriptForm";
import { TranscriptionDisplay } from "@/components/transcribe/TranscriptionDisplay";
import { ScriptVariation } from "@/components/transcribe/ScriptVariation";
import { TranscriptionStage } from "@/components/transcribe/TranscriptionProgress";
import { useSessionValidation } from "@/hooks/useSessionValidation";
import { Tables } from "@/integrations/supabase/types";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { VideoIcon, FileTextIcon, MessageSquareIcon, FileIcon } from "lucide-react";

type Script = Tables<"scripts">;

const Transcribe = () => {
  const { session } = useSessionValidation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<"video" | "text" | "prompt" | "file">("video");
  const [currentTranscriptionId, setCurrentTranscriptionId] = useState<string | null>(() => {
    return localStorage.getItem('currentTranscriptionId') || null;
  });
  const [transcriptionStage, setTranscriptionStage] = useState<TranscriptionStage | undefined>();
  const [videoGeneratedScript, setVideoGeneratedScript] = useState<string | undefined>();
  const [textGeneratedScript, setTextGeneratedScript] = useState<string | undefined>();
  const [promptGeneratedScript, setPromptGeneratedScript] = useState<string | undefined>();
  const [fileGeneratedScript, setFileGeneratedScript] = useState<string | undefined>();
  const [transcription, setTranscription] = useState<string | undefined>();
  const [isGenerating, setIsGenerating] = useState(false);

  const transcribeMutation = useMutation({
    mutationFn: async (url: string) => {
      setTranscriptionStage('preparing');
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      setTranscriptionStage('downloading');
      
      const { data, error } = await supabase.functions.invoke('transcribe', {
        body: { url }
      });

      if (error) {
        console.error('Transcription error:', error);
        throw error;
      }

      console.log('Transcription response:', data);
      
      setTranscriptionStage('transcribing');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const { data: scriptData, error: scriptError } = await supabase
        .from('scripts')
        .insert({
          user_id: session?.user.id,
          original_text: data.text,
          script_type: 'transcription' as const
        })
        .select()
        .single();

      if (scriptError) throw scriptError;
      
      setTranscriptionStage('completed');
      setTranscription(data.text);
      const newTranscriptionId = scriptData.id;
      setCurrentTranscriptionId(newTranscriptionId);
      localStorage.setItem('currentTranscriptionId', newTranscriptionId);
      return scriptData;
    },
  });

  const fileToScriptMutation = useMutation({
    mutationFn: async (filePath: string) => {
      const { data, error } = await supabase.functions.invoke('transcribe-file', {
        body: { filePath }
      });

      if (error) throw error;

      const { data: scriptData, error: scriptError } = await supabase
        .from('scripts')
        .insert({
          user_id: session?.user.id,
          original_text: data.text,
          script_type: 'transcription' as const
        })
        .select()
        .single();

      if (scriptError) throw scriptError;
      
      setTranscription(data.text);
      const newTranscriptionId = scriptData.id;
      setCurrentTranscriptionId(newTranscriptionId);
      localStorage.setItem('currentTranscriptionId', newTranscriptionId);
      return scriptData;
    },
  });

  const generateFileVariation = async () => {
    if (!fileGeneratedScript) {
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
        body: { text: fileGeneratedScript }
      });

      if (aiError) throw aiError;

      const { data: scriptData, error: scriptError } = await supabase
        .from('scripts')
        .insert({
          user_id: session?.user.id,
          original_text: fileGeneratedScript,
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

  const handleTranscribe = async (url: string) => {
    await transcribeMutation.mutateAsync(url);
    queryClient.invalidateQueries({ queryKey: ['scripts'] });
  };

  const handleTextToScript = async (text: string) => {
    await textToScriptMutation.mutateAsync(text);
    queryClient.invalidateQueries({ queryKey: ['scripts'] });
  };

  const handlePromptToScript = async (prompt: string, text: string) => {
    await promptToScriptMutation.mutateAsync({ prompt, text });
    queryClient.invalidateQueries({ queryKey: ['scripts'] });
  };

  const handleFileToScript = async (filePath: string) => {
    const result = await fileToScriptMutation.mutateAsync(filePath);
    setFileGeneratedScript(result.original_text);
    queryClient.invalidateQueries({ queryKey: ['scripts'] });
  };

  return (
    <div className="container max-w-4xl py-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-xl font-semibold tracking-tight">Script Generator</h1>
        <p className="text-sm text-muted-foreground">
          Transform your videos or text content into engaging social media scripts.
        </p>
      </div>
      
      <Tabs 
        defaultValue="video" 
        className="space-y-6"
        onValueChange={(value) => setActiveTab(value as "video" | "text" | "prompt" | "file")}
      >
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="video" className="space-x-2">
            <VideoIcon className="h-4 w-4" />
            <span>Video to Script</span>
          </TabsTrigger>
          <TabsTrigger value="text" className="space-x-2">
            <FileTextIcon className="h-4 w-4" />
            <span>Text to Script</span>
          </TabsTrigger>
          <TabsTrigger value="prompt" className="space-x-2">
            <MessageSquareIcon className="h-4 w-4" />
            <span>Prompt to Script</span>
          </TabsTrigger>
          <TabsTrigger value="file" className="space-x-2">
            <FileIcon className="h-4 w-4" />
            <span>File to Script</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="video" className="space-y-6">
          <TranscribeForm 
            onSubmit={handleTranscribe}
            isLoading={transcribeMutation.isPending}
            stage={transcriptionStage}
          />
          {transcription && (
            <TranscriptionDisplay 
              transcription={transcription}
              onGenerateVariation={generateVariation}
              isGenerating={isGenerating}
            />
          )}
          {videoGeneratedScript && (
            <ScriptVariation variation={videoGeneratedScript} />
          )}
        </TabsContent>

        <TabsContent value="text" className="space-y-6">
          <TextToScriptForm 
            onSubmit={handleTextToScript}
            isLoading={textToScriptMutation.isPending}
            generatedScript={textGeneratedScript}
          />
        </TabsContent>

        <TabsContent value="prompt" className="space-y-6">
          <PromptToScriptForm 
            onSubmit={handlePromptToScript}
            isLoading={promptToScriptMutation.isPending}
            generatedScript={promptGeneratedScript}
          />
        </TabsContent>

        <TabsContent value="file" className="space-y-6">
          <FileToScriptForm
            onSubmit={handleFileToScript}
            isLoading={fileToScriptMutation.isPending}
          />
          {fileGeneratedScript && (
            <>
              <TranscriptionDisplay 
                transcription={fileGeneratedScript}
                onGenerateVariation={generateFileVariation}
                isGenerating={isGenerating}
              />
              {promptGeneratedScript && (
                <ScriptVariation variation={promptGeneratedScript} />
              )}
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Transcribe;
