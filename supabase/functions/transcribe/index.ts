import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

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
    console.log('Processing Instagram URL:', url);

    // Get OpenAI API key from environment
    const openaiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiKey) {
      throw new Error('Missing OpenAI API key');
    }

    // 1. Extract video URL using Apify with the provided endpoint
    console.log('Fetching video URL from Apify...');
    const apifyResponse = await fetch('https://api.apify.com/v2/acts/apify~instagram-api-scraper/run-sync-get-dataset-items?token=apify_api_HVxy5jbYLGjOZJQHhPwziipY7WRhVQ3oulop', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "directUrls": [url],
        "resultsLimit": 1,
        "resultsType": "details"
      })
    });

    if (!apifyResponse.ok) {
      throw new Error(`Apify API error: ${apifyResponse.statusText}`);
    }

    const apifyData = await apifyResponse.json();
    console.log('Apify response:', apifyData);

    if (!apifyData[0]?.videoUrl) {
      throw new Error('No video URL found in Instagram post');
    }

    const videoUrl = apifyData[0].videoUrl;

    // 2. Download video
    console.log('Downloading video...');
    const videoResponse = await fetch(videoUrl);
    if (!videoResponse.ok) {
      throw new Error('Failed to download video');
    }

    const contentType = videoResponse.headers.get('content-type');
    if (!contentType?.includes('video')) {
      throw new Error('Invalid content type: ' + contentType);
    }

    const videoBuffer = await videoResponse.arrayBuffer();
    const MAX_SIZE = 25 * 1024 * 1024; // 25MB
    if (videoBuffer.byteLength > MAX_SIZE) {
      throw new Error('Video file too large (max 25MB)');
    }

    // 3. Prepare form data for Whisper API
    console.log('Preparing video for transcription...');
    const formData = new FormData();
    formData.append('file', new Blob([videoBuffer], { type: 'video/mp4' }), 'video.mp4');
    formData.append('model', 'whisper-1');

    // 4. Send to Whisper API
    console.log('Sending to Whisper API...');
    const whisperResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiKey}`,
      },
      body: formData,
    });

    if (!whisperResponse.ok) {
      const error = await whisperResponse.text();
      throw new Error(`Whisper API error: ${error}`);
    }

    const transcription = await whisperResponse.json();
    console.log('Transcription complete');

    return new Response(
      JSON.stringify({ 
        text: transcription.text,
        status: 'success'
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );

  } catch (error) {
    console.error('Error in transcribe function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        status: 'error'
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  }
});