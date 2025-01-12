import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { TranscribeForm } from "@/components/transcribe/TranscribeForm";
import { TextToScriptForm } from "@/components/transcribe/TextToScriptForm";
import { TranscriptionDisplay } from "@/components/transcribe/TranscriptionDisplay";
import { ScriptVariation } from "@/components/transcribe/ScriptVariation";
import { TranscriptionStage } from "@/components/transcribe/TranscriptionProgress";
import { useSessionValidation } from "@/hooks/useSessionValidation";
import { Tables } from "@/integrations/supabase/types";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { VideoIcon, FileTextIcon } from "lucide-react";

type Script = Tables<"scripts">;

const Transcribe = () => {
  const { session } = useSessionValidation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [currentTranscriptionId, setCurrentTranscriptionId] = useState<string | null>(() => {
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

  const textToScriptMutation = useMutation({
    mutationFn: async (text: string) => {
      const { data: scriptData, error: scriptError } = await supabase
        .from('scripts')
        .insert({
          user_id: session?.user.id,
          original_text: text,
          script_type: 'text'
        })
        .select()
        .single();

      if (scriptError) throw scriptError;
      
      setCurrentTranscriptionId(scriptData.id);
      localStorage.setItem('currentTranscriptionId', scriptData.id);
      return scriptData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scripts'] });
      toast({
        title: "Success",
        description: "Text converted to script successfully!",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to convert text to script",
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
    staleTime: Infinity,
    gcTime: 1000 * 60 * 60,
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
    staleTime: Infinity,
    gcTime: 1000 * 60 * 60,
  });

  return (
    <div className="container max-w-4xl py-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-xl font-semibold tracking-tight">Script Generator</h1>
        <p className="text-sm text-muted-foreground">
          Transform your videos or text content into engaging social media scripts.
        </p>
      </div>
      
      <Tabs defaultValue="video" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="video" className="space-x-2">
            <VideoIcon className="h-4 w-4" />
            <span>Video to Script</span>
          </TabsTrigger>
          <TabsTrigger value="text" className="space-x-2">
            <FileTextIcon className="h-4 w-4" />
            <span>Text to Script</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="video" className="space-y-6">
          <TranscribeForm 
            onSubmit={(url) => transcribeMutation.mutateAsync(url)}
            isLoading={transcribeMutation.isPending}
            stage={transcriptionStage}
          />
        </TabsContent>

        <TabsContent value="text" className="space-y-6">
          <TextToScriptForm 
            onSubmit={(text) => textToScriptMutation.mutateAsync(text)}
            isLoading={textToScriptMutation.isPending}
          />
        </TabsContent>
      </Tabs>

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