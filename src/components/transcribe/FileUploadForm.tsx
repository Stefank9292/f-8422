import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card } from "@/components/ui/card";
import { Loader2, Upload } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { TranscriptionProgress, TranscriptionStage } from "./TranscriptionProgress";

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB
const ACCEPTED_FILE_TYPES = [
  "video/mp4",
  "video/mpeg",
  "video/webm",
  "audio/mpeg",
  "audio/wav",
  "audio/webm",
];

const formSchema = z.object({
  file: z
    .instanceof(FileList)
    .refine((files) => files.length > 0, "Please select a file")
    .transform((files) => files[0])
    .refine(
      (file) => file.size <= MAX_FILE_SIZE,
      "File size must be less than 25MB"
    )
    .refine(
      (file) => ACCEPTED_FILE_TYPES.includes(file.type),
      "File type not supported. Please upload MP4, MPEG, WebM video or MP3, WAV audio files."
    ),
});

type FormData = z.infer<typeof formSchema>;

interface FileUploadFormProps {
  onSubmit: (file: File) => Promise<void>;
  isLoading: boolean;
  stage?: TranscriptionStage;
}

export function FileUploadForm({ onSubmit, isLoading, stage }: FileUploadFormProps) {
  const { toast } = useToast();
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const handleSubmit = async (data: FormData) => {
    try {
      await onSubmit(data.file);
      form.reset();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to transcribe file",
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
              name="file"
              render={({ field: { onChange, value, ...field } }) => (
                <FormItem>
                  <FormLabel>Upload Video or Audio File</FormLabel>
                  <FormControl>
                    <div className="flex items-center justify-center w-full">
                      <label
                        htmlFor="file-upload"
                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 border-muted-foreground/20 hover:bg-muted/70 transition-colors"
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6 space-y-2">
                          <Upload className="w-8 h-8 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">
                            Click to upload or drag and drop
                          </p>
                          <p className="text-xs text-muted-foreground">
                            MP4, MPEG, WebM video or MP3, WAV audio (max 25MB)
                          </p>
                        </div>
                        <input
                          id="file-upload"
                          type="file"
                          className="hidden"
                          accept={ACCEPTED_FILE_TYPES.join(",")}
                          onChange={(e) => {
                            onChange(e.target.files);
                          }}
                          disabled={isLoading}
                          {...field}
                        />
                      </label>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Transcribe File
            </Button>
          </form>
        </Form>
      </Card>

      {isLoading && stage && <TranscriptionProgress stage={stage} />}
    </div>
  );
}