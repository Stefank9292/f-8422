import { create } from 'zustand';

interface TranscriptionState {
  videoTranscription: string | undefined;
  videoGeneratedScript: string | undefined;
  textGeneratedScript: string | undefined;
  promptGeneratedScript: string | undefined;
  fileTranscription: string | undefined;
  fileGeneratedScript: string | undefined;
  setVideoTranscription: (transcription: string | undefined) => void;
  setVideoGeneratedScript: (script: string | undefined) => void;
  setTextGeneratedScript: (script: string | undefined) => void;
  setPromptGeneratedScript: (script: string | undefined) => void;
  setFileTranscription: (transcription: string | undefined) => void;
  setFileGeneratedScript: (script: string | undefined) => void;
  reset: () => void;
}

export const useTranscriptionStore = create<TranscriptionState>((set) => ({
  videoTranscription: undefined,
  videoGeneratedScript: undefined,
  textGeneratedScript: undefined,
  promptGeneratedScript: undefined,
  fileTranscription: undefined,
  fileGeneratedScript: undefined,
  setVideoTranscription: (transcription) => set({ videoTranscription: transcription }),
  setVideoGeneratedScript: (script) => set({ videoGeneratedScript: script }),
  setTextGeneratedScript: (script) => set({ textGeneratedScript: script }),
  setPromptGeneratedScript: (script) => set({ promptGeneratedScript: script }),
  setFileTranscription: (transcription) => set({ fileTranscription: transcription }),
  setFileGeneratedScript: (script) => set({ fileGeneratedScript: script }),
  reset: () => set({
    videoTranscription: undefined,
    videoGeneratedScript: undefined,
    textGeneratedScript: undefined,
    promptGeneratedScript: undefined,
    fileTranscription: undefined,
    fileGeneratedScript: undefined,
  })
}));