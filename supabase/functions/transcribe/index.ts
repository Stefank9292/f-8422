import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url } = await req.json();
    console.log('Processing video URL:', url);

    if (!url) {
      throw new Error('URL is required');
    }

    // Download video content
    console.log('Downloading video...');
    const videoResponse = await fetch(url);
    if (!videoResponse.ok) {
      throw new Error('Failed to fetch video content');
    }

    // Convert video to audio using FFmpeg
    console.log('Converting video to audio...');
    const videoBuffer = await videoResponse.arrayBuffer();
    
    // Create a temporary file for the video
    const tempVideoPath = await Deno.makeTempFile({ suffix: '.mp4' });
    await Deno.writeFile(tempVideoPath, new Uint8Array(videoBuffer));

    // Create a temporary file for the audio output
    const tempAudioPath = await Deno.makeTempFile({ suffix: '.mp3' });

    // Run FFmpeg command to convert video to audio
    const ffmpegCommand = new Deno.Command("ffmpeg", {
      args: [
        "-i", tempVideoPath,
        "-vn",                 // Disable video
        "-acodec", "libmp3lame", // Use MP3 codec
        "-ar", "44100",        // Audio rate
        "-ac", "2",            // Audio channels
        "-b:a", "192k",        // Audio bitrate
        tempAudioPath
      ],
    });

    const ffmpegResult = await ffmpegCommand.output();
    console.log('FFmpeg conversion completed:', ffmpegResult.success);

    if (!ffmpegResult.success) {
      throw new Error('Failed to convert video to audio');
    }

    // Read the converted audio file
    const audioBuffer = await Deno.readFile(tempAudioPath);

    // Clean up temporary files
    await Deno.remove(tempVideoPath);
    await Deno.remove(tempAudioPath);

    // Prepare form data with audio file
    console.log('Preparing audio for transcription...');
    const formData = new FormData();
    formData.append('file', new Blob([audioBuffer], { type: 'audio/mp3' }), 'audio.mp3');
    formData.append('model', 'whisper-1');

    // Transcribe using Whisper API
    console.log('Sending request to Whisper API...');
    const transcriptionResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
      },
      body: formData,
    });

    if (!transcriptionResponse.ok) {
      const error = await transcriptionResponse.json();
      console.error('Whisper API error:', error);
      throw new Error(error.error?.message || 'Failed to transcribe video');
    }

    const transcriptionData = await transcriptionResponse.json();
    console.log('Transcription completed successfully');

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Store transcription in database
    const { data: scriptData, error: scriptError } = await supabaseClient
      .from('scripts')
      .insert({
        user_id: req.auth.uid,
        original_text: transcriptionData.text,
        script_type: 'transcription'
      })
      .select()
      .single();

    if (scriptError) {
      console.error('Database error:', scriptError);
      throw scriptError;
    }

    return new Response(
      JSON.stringify({ id: scriptData.id, transcription: transcriptionData.text }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in transcribe function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});