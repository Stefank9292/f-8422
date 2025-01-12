import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { TranscribeForm } from "@/components/transcribe/TranscribeForm";
import { FileUploadForm } from "@/components/transcribe/FileUploadForm";
import { TextToScriptForm } from "@/components/transcribe/TextToScriptForm";
import { PromptToScriptForm } from "@/components/transcribe/PromptToScriptForm";
import { TranscriptionDisplay } from "@/components/transcribe/TranscriptionDisplay";
import { ScriptVariation } from "@/components/transcribe/ScriptVariation";
import { TranscriptionStage } from "@/components/transcribe/TranscriptionProgress";
import { useSessionValidation } from "@/hooks/useSessionValidation";
import { Tables } from "@/integrations/supabase/types";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { VideoIcon, FileTextIcon, MessageSquareIcon, UploadIcon } from "lucide-react";

type Script = Tables<"scripts">;

const Transcribe = () => {
  const { session } = useSessionValidation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<"video" | "text" | "prompt" | "upload">("video");
  const [currentTranscriptionId, setCurrentTranscriptionId] = useState<string | null>(() => {
    return localStorage.getItem('currentTranscriptionId') || null;
  });
  const [transcriptionStage, setTranscriptionStage] = useState<TranscriptionStage | undefined>();
  const [generatedScript, setGeneratedScript] = useState<string | undefined>();

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
          script_type: 'transcription' as const
        })
        .select()
        .single();

      if (scriptError) throw scriptError;
      
      setTranscriptionStage('completed');
      const newTranscriptionId = scriptData.id;
      setCurrentTranscriptionId(newTranscriptionId);
      localStorage.setItem('currentTranscriptionId', newTranscriptionId);
      return scriptData;
    },
  });

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      setTranscriptionStage('preparing');
      
      const formData = new FormData();
      formData.append('file', file);
      
      setTranscriptionStage('transcribing');
      const { data, error } = await supabase.functions.invoke('transcribe', {
        body: { file: await file.arrayBuffer(), fileName: file.name, fileType: file.type }
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
      
      setTranscriptionStage('completed');
      const newTranscriptionId = scriptData.id;
      setCurrentTranscriptionId(newTranscriptionId);
      localStorage.setItem('currentTranscriptionId', newTranscriptionId);
      return scriptData;
    },
  });

  const textToScriptMutation = useMutation({
    mutationFn: async (text: string) => {
      const { data: aiResponse, error: aiError } = await supabase.functions.invoke('generate-script', {
        body: { text }
      });

      if (aiError) throw aiError;

      const { data: scriptData, error: scriptError } = await supabase
        .from('scripts')
        .insert({
          user_id: session?.user.id,
          original_text: text,
          variation_text: aiResponse.text,
          script_type: 'transcription' as const
        })
        .select()
        .single();

      if (scriptError) throw scriptError;
      
      setCurrentTranscriptionId(scriptData.id);
      localStorage.setItem('currentTranscriptionId', scriptData.id);
      setGeneratedScript(aiResponse.text);
      return scriptData;
    },
  });

  const promptToScriptMutation = useMutation({
    mutationFn: async ({ prompt, text }: { prompt: string; text: string }) => {
      const { data: aiResponse, error: aiError } = await supabase.functions.invoke('generate-prompt-script', {
        body: { prompt, text }
      });

      if (aiError) throw aiError;

      const { data: scriptData, error: scriptError } = await supabase
        .from('scripts')
        .insert({
          user_id: session?.user.id,
          original_text: text,
          variation_text: aiResponse.text,
          script_type: 'transcription' as const
        })
        .select()
        .single();

      if (scriptError) throw scriptError;
      
      setCurrentTranscriptionId(scriptData.id);
      localStorage.setItem('currentTranscriptionId', scriptData.id);
      setGeneratedScript(aiResponse.text);
      return scriptData;
    },
  });

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

  const handleFileUpload = async (file: File) => {
    await uploadMutation.mutateAsync(file);
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
        onValueChange={(value) => setActiveTab(value as "video" | "text" | "prompt" | "upload")}
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
          <TabsTrigger value="upload" className="space-x-2">
            <UploadIcon className="h-4 w-4" />
            <span>Upload File</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="video" className="space-y-6">
          <TranscribeForm 
            onSubmit={handleTranscribe}
            isLoading={transcribeMutation.isPending}
            stage={transcriptionStage}
          />
        </TabsContent>

        <TabsContent value="text" className="space-y-6">
          <TextToScriptForm 
            onSubmit={handleTextToScript}
            isLoading={textToScriptMutation.isPending}
            generatedScript={generatedScript}
          />
        </TabsContent>

        <TabsContent value="prompt" className="space-y-6">
          <PromptToScriptForm 
            onSubmit={handlePromptToScript}
            isLoading={promptToScriptMutation.isPending}
            generatedScript={generatedScript}
          />
        </TabsContent>

        <TabsContent value="upload" className="space-y-6">
          <FileUploadForm 
            onSubmit={handleFileUpload}
            isLoading={uploadMutation.isPending}
            stage={transcriptionStage}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Transcribe;
