import React from 'react';
import { LoaderCircle, Download, Mic, CheckCircle } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

export type TranscriptionStage = 'preparing' | 'downloading' | 'transcribing' | 'completed';

interface TranscriptionProgressProps {
  stage: TranscriptionStage;
}

export function TranscriptionProgress({ stage }: TranscriptionProgressProps) {
  const stages: { key: TranscriptionStage; label: string; icon: React.ReactNode }[] = [
    { 
      key: 'preparing', 
      label: 'Setting things up to process your request. Hang tight!',
      icon: <LoaderCircle className="h-6 w-6 animate-spin" />
    },
    { 
      key: 'downloading', 
      label: 'Downloading the video from Instagram... This might take a moment.',
      icon: <Download className="h-6 w-6 animate-bounce" />
    },
    { 
      key: 'transcribing', 
      label: 'Transcribing the audio using OpenAI\'s Whisper model... Just a few more seconds!',
      icon: <Mic className="h-6 w-6 animate-pulse" />
    },
    { 
      key: 'completed', 
      label: '✨ Transcription complete! Here\'s what the video says:',
      icon: <CheckCircle className="h-6 w-6 text-green-500" />
    }
  ];

  const currentStageIndex = stages.findIndex(s => s.key === stage);
  const progress = ((currentStageIndex + 1) / stages.length) * 100;

  return (
    <Card className="p-6 md:p-8 space-y-6">
      <Progress value={progress} className="h-2" />
      
      <div className="space-y-4">
        {stages.map((s, index) => {
          const isCurrentStage = s.key === stage;
          const isPastStage = stages.findIndex(st => st.key === stage) > index;
          
          return (
            <div 
              key={s.key}
              className={cn(
                "flex items-center gap-4 p-4 rounded-lg transition-colors",
                isCurrentStage && "bg-primary/10",
                isPastStage && "opacity-50"
              )}
            >
              <div className="shrink-0">
                {s.icon}
              </div>
              <p className={cn(
                "text-base md:text-lg",
                isCurrentStage && "font-medium"
              )}>
                {s.label}
              </p>
            </div>
          );
        })}
      </div>
    </Card>
  );
}