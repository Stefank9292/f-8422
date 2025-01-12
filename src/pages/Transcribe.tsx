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
import { useIsMobile } from "@/hooks/use-mobile";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Script = Tables<"scripts">;

const Transcribe = () => {
  const { session } = useSessionValidation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isMobile = useIsMobile();
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

      if (error) throw error;

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
      
      setFileGeneratedScript(data.text);
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
      setTextGeneratedScript(aiResponse.text);
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
      setPromptGeneratedScript(aiResponse.text);
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
      
      setPromptGeneratedScript(aiResponse.text);
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
    await fileToScriptMutation.mutateAsync(filePath);
    queryClient.invalidateQueries({ queryKey: ['scripts'] });
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value as "video" | "text" | "prompt" | "file");
  };

  return (
    <div className="container max-w-4xl py-4 md:py-6 px-4 md:px-4 space-y-4 md:space-y-6 mt-14 md:mt-0">
      <div className="space-y-2">
        <h1 className="text-lg md:text-xl font-semibold tracking-tight">Script Generator</h1>
        <p className="text-xs md:text-sm text-muted-foreground">
          Transform your videos or text content into engaging social media scripts.
        </p>
      </div>
      
      {isMobile ? (
        <div className="space-y-6">
          <Select value={activeTab} onValueChange={handleTabChange}>
            <SelectTrigger className="w-full">
              <SelectValue>
                <div className="flex items-center space-x-2">
                  {activeTab === "video" && <VideoIcon className="h-4 w-4" />}
                  {activeTab === "text" && <FileTextIcon className="h-4 w-4" />}
                  {activeTab === "prompt" && <MessageSquareIcon className="h-4 w-4" />}
                  {activeTab === "file" && <FileIcon className="h-4 w-4" />}
                  <span>
                    {activeTab === "video" && "Video to Script"}
                    {activeTab === "text" && "Text to Script"}
                    {activeTab === "prompt" && "Prompt to Script"}
                    {activeTab === "file" && "File to Script"}
                  </span>
                </div>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="video">
                <div className="flex items-center space-x-2">
                  <VideoIcon className="h-4 w-4" />
                  <span>Video to Script</span>
                </div>
              </SelectItem>
              <SelectItem value="text">
                <div className="flex items-center space-x-2">
                  <FileTextIcon className="h-4 w-4" />
                  <span>Text to Script</span>
                </div>
              </SelectItem>
              <SelectItem value="prompt">
                <div className="flex items-center space-x-2">
                  <MessageSquareIcon className="h-4 w-4" />
                  <span>Prompt to Script</span>
                </div>
              </SelectItem>
              <SelectItem value="file">
                <div className="flex items-center space-x-2">
                  <FileIcon className="h-4 w-4" />
                  <span>File to Script</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>

          <div className="space-y-6">
            {activeTab === "video" && (
              <div className="space-y-6">
                <TranscribeForm 
                  onSubmit={handleTranscribe}
                  isLoading={transcribeMutation.isPending}
                  stage={transcriptionStage}
                />
                {transcription && (
                  <TranscriptionDisplay 
                    transcription={transcription}
                    onGenerateVariation={generateFileVariation}
                    isGenerating={isGenerating}
                  />
                )}
                {videoGeneratedScript && (
                  <ScriptVariation variation={videoGeneratedScript} />
                )}
              </div>
            )}

            {activeTab === "text" && (
              <TextToScriptForm 
                onSubmit={handleTextToScript}
                isLoading={textToScriptMutation.isPending}
                generatedScript={textGeneratedScript}
              />
            )}

            {activeTab === "prompt" && (
              <PromptToScriptForm 
                onSubmit={handlePromptToScript}
                isLoading={promptToScriptMutation.isPending}
                generatedScript={promptGeneratedScript}
              />
            )}

            {activeTab === "file" && (
              <div className="space-y-6">
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
              </div>
            )}
          </div>
        </div>
      ) : (
        <Tabs 
          defaultValue="video" 
          className="space-y-4 md:space-y-6"
          onValueChange={(value) => setActiveTab(value as "video" | "text" | "prompt" | "file")}
        >
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 gap-1">
            <TabsTrigger value="video" className="space-x-1 md:space-x-2 px-2 md:px-4">
              <VideoIcon className="h-3 w-3 md:h-4 md:w-4" />
              <span className="text-xs md:text-sm">Video to Script</span>
            </TabsTrigger>
            <TabsTrigger value="text" className="space-x-1 md:space-x-2 px-2 md:px-4">
              <FileTextIcon className="h-3 w-3 md:h-4 md:w-4" />
              <span className="text-xs md:text-sm">Text to Script</span>
            </TabsTrigger>
            <TabsTrigger value="prompt" className="space-x-1 md:space-x-2 px-2 md:px-4">
              <MessageSquareIcon className="h-3 w-3 md:h-4 md:w-4" />
              <span className="text-xs md:text-sm">Prompt to Script</span>
            </TabsTrigger>
            <TabsTrigger value="file" className="space-x-1 md:space-x-2 px-2 md:px-4">
              <FileIcon className="h-3 w-3 md:h-4 md:w-4" />
              <span className="text-xs md:text-sm">File to Script</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="video" className="space-y-4 md:space-y-6">
            <TranscribeForm 
              onSubmit={handleTranscribe}
              isLoading={transcribeMutation.isPending}
              stage={transcriptionStage}
            />
            {transcription && (
              <TranscriptionDisplay 
                transcription={transcription}
                onGenerateVariation={generateFileVariation}
                isGenerating={isGenerating}
              />
            )}
            {videoGeneratedScript && (
              <ScriptVariation variation={videoGeneratedScript} />
            )}
          </TabsContent>

          <TabsContent value="text" className="space-y-4 md:space-y-6">
            <TextToScriptForm 
              onSubmit={handleTextToScript}
              isLoading={textToScriptMutation.isPending}
              generatedScript={textGeneratedScript}
            />
          </TabsContent>

          <TabsContent value="prompt" className="space-y-4 md:space-y-6">
            <PromptToScriptForm 
              onSubmit={handlePromptToScript}
              isLoading={promptToScriptMutation.isPending}
              generatedScript={promptGeneratedScript}
            />
          </TabsContent>

          <TabsContent value="file" className="space-y-4 md:space-y-6">
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
      )}
    </div>
  );
};

export default Transcribe;
