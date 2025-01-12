import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card } from "@/components/ui/card";
import { Loader2, Download, Mic, CheckCircle2 } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { TranscriptionStage } from "./TranscriptionProgress";

const instagramUrlPattern = /^https:\/\/(?:www\.)?instagram\.com\/p\/[A-Za-z0-9_-]+\/?$/;

const formSchema = z.object({
  url: z.string()
    .url("Please enter a valid URL")
    .regex(instagramUrlPattern, "Please enter a valid Instagram post URL (e.g., https://www.instagram.com/p/ABC123)")
});

type FormData = z.infer<typeof formSchema>;

interface TranscribeFormProps {
  onSubmit: (url: string) => Promise<void>;
  isLoading: boolean;
  stage?: TranscriptionStage;
}

export function TranscribeForm({ onSubmit, isLoading, stage }: TranscribeFormProps) {
  const { toast } = useToast();
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: ""
    }
  });

  const getStageContent = (stage: TranscriptionStage) => {
    switch (stage) {
      case 'downloading':
        return {
          text: "Downloading the video...",
          icon: <Download className="mr-2 h-4 w-4 animate-bounce" />
        };
      case 'transcribing':
        return {
          text: "Transcribing the audio...",
          icon: <Mic className="mr-2 h-4 w-4 animate-pulse" />
        };
      case 'completed':
        return {
          text: "Transcription complete!",
          icon: <CheckCircle2 className="mr-2 h-4 w-4 text-white" />
        };
      default:
        return {
          text: "Transcribe Video",
          icon: isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null
        };
    }
  };

  const handleSubmit = async (data: FormData) => {
    try {
      await onSubmit(data.url);
      form.reset();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to transcribe video"
      });
    }
  };

  const stageContent = stage ? getStageContent(stage) : getStageContent('preparing');

  return (
    <Card className="p-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Instagram Video URL</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="https://www.instagram.com/p/..." 
                    className="h-10"
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            {stageContent.icon}
            <span>{stageContent.text}</span>
          </Button>
        </form>
      </Form>
    </Card>
  );
}