import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, Upload, FileAudio, FileVideo, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface FileToScriptFormProps {
  onSubmit: (filePath: string) => void;
  isLoading: boolean;
}

export function FileToScriptForm({ onSubmit, isLoading }: FileToScriptFormProps) {
  const { toast } = useToast();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    if (files.length > 1) {
      toast({
        variant: "destructive",
        title: "Multiple files detected",
        description: "Please upload only one file at a time."
      });
      return;
    }

    const file = files[0];
    if (!file) return;

    // Check file type
    const validAudioTypes = ['audio/wav', 'audio/mp3', 'audio/mpeg', 'audio/webm'];
    const validVideoTypes = ['video/mp4', 'video/webm', 'video/mpeg'];
    const isValidType = [...validAudioTypes, ...validVideoTypes].includes(file.type);

    if (!isValidType) {
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: "Please upload a valid audio (WAV, MP3, WebM) or video (MP4, WebM, MPEG) file."
      });
      return;
    }

    // Check file size (25MB limit for Whisper API)
    const maxSize = 25 * 1024 * 1024; // 25MB in bytes
    if (file.size > maxSize) {
      toast({
        variant: "destructive",
        title: "File too large",
        description: "File size must be less than 25MB."
      });
      return;
    }

    setUploadedFile(file);
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
  };

  const handleUpload = async () => {
    if (!uploadedFile) return;

    try {
      setIsUploading(true);
      const fileExt = uploadedFile.name.split('.').pop();
      const filePath = `${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('transcription_files')
        .upload(filePath, uploadedFile);

      if (uploadError) throw uploadError;

      toast({
        title: "File uploaded successfully",
        description: "Your file is ready to be transcribed."
      });

      onSubmit(filePath);
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload file"
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-center w-full">
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 dark:hover:bg-gray-800 dark:bg-gray-700 border-gray-300 dark:border-gray-600">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-8 h-8 mb-3 text-gray-400" />
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Audio (WAV, MP3, WebM) or Video (MP4, WebM, MPEG)
              </p>
            </div>
            <input
              type="file"
              className="hidden"
              accept=".wav,.mp3,.webm,.mp4,.mpeg"
              onChange={handleFileChange}
              disabled={isUploading || isLoading}
              multiple={false}
            />
          </label>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={handleUpload}
            disabled={!uploadedFile || isUploading || isLoading}
            className="w-full sm:w-auto"
          >
            {(isUploading || isLoading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isUploading ? 'Uploading...' : isLoading ? 'Transcribing...' : 'Transcribe File'}
          </Button>

          {uploadedFile && (
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-md transition-colors">
              {uploadedFile.type.startsWith('audio/') ? (
                <FileAudio className="w-4 h-4 text-gray-500" />
              ) : (
                <FileVideo className="w-4 h-4 text-gray-500" />
              )}
              <span className="text-sm text-gray-600 dark:text-gray-300 truncate max-w-[150px]">
                {uploadedFile.name}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 p-0.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                onClick={handleRemoveFile}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}