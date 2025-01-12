import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { TranscriptionProgress, TranscriptionStage } from "./TranscriptionProgress";

const formSchema = z.object({
  url: z.string().url("Please enter a valid Instagram URL")
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

  return (
    <div className="space-y-6">
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
                      placeholder="https://www.instagram.com/reel/..." 
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
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Transcribe Video
            </Button>
          </form>
        </Form>
      </Card>

      {isLoading && stage && (
        <TranscriptionProgress stage={stage} />
      )}
    </div>
  );
}