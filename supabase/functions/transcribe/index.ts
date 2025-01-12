import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

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

    const contentType = videoResponse.headers.get('content-type');
    console.log('Video content type:', contentType);

    // Convert video to supported format (mp4)
    const videoBuffer = await videoResponse.arrayBuffer();
    console.log('Video downloaded, size:', videoBuffer.byteLength);

    // Prepare form data with video file
    console.log('Preparing video for transcription...');
    const formData = new FormData();
    formData.append('file', new Blob([videoBuffer], { type: 'video/mp4' }), 'video.mp4');
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