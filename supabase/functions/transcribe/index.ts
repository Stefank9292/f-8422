import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const ACCEPTED_FILE_TYPES = [
  'audio/flac',
  'audio/m4a',
  'audio/mp3',
  'audio/mp4',
  'audio/mpeg',
  'audio/mpga',
  'audio/oga',
  'audio/ogg',
  'audio/wav',
  'audio/webm',
  'video/mp4',
  'video/mpeg',
  'video/webm'
];

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url, file, fileName, fileType } = await req.json();

    // Get OpenAI API key from environment
    const openaiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiKey) {
      throw new Error('Missing OpenAI API key');
    }

    let audioData: ArrayBuffer;
    let audioType: string;

    if (url) {
      console.log('Processing Instagram URL:', url);

      // Process Instagram URL using Apify
      const apifyResponse = await fetch('https://api.apify.com/v2/acts/apify~instagram-api-scraper/run-sync-get-dataset-items?token=apify_api_HVxy5jbYLGjOZJQHhPwziipY7WRhVQ3oulop', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "addParentData": false,
          "directUrls": [url],
          "enhanceUserSearchWithFacebookPage": false,
          "isUserReelFeedURL": false,
          "isUserTaggedFeedURL": false,
          "resultsLimit": 1,
          "resultsType": "details",
          "searchLimit": 1,
          "searchType": "user"
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

      // Download video
      console.log('Downloading video...');
      const videoResponse = await fetch(videoUrl);
      if (!videoResponse.ok) {
        throw new Error('Failed to download video');
      }

      audioData = await videoResponse.arrayBuffer();
      audioType = videoResponse.headers.get('content-type') || 'video/mp4';
    } else if (file) {
      console.log('Processing uploaded file:', fileName);
      audioData = file;
      audioType = fileType;

      // Validate file type
      if (!ACCEPTED_FILE_TYPES.includes(fileType)) {
        throw new Error(`Invalid file type. Supported formats: ${ACCEPTED_FILE_TYPES.join(', ')}`);
      }
    } else {
      throw new Error('No URL or file provided');
    }

    // Check file size
    if (audioData.byteLength > 25 * 1024 * 1024) {
      throw new Error('File size exceeds 25MB limit');
    }

    // Prepare form data for Whisper API
    console.log('Preparing audio for transcription...');
    const formData = new FormData();
    const blob = new Blob([audioData], { type: audioType });
    formData.append('file', blob, fileName || 'video.mp4');
    formData.append('model', 'whisper-1');

    // Send to Whisper API
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