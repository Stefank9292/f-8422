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

    // 1. Extract video URL using Apify
    console.log('Fetching video URL from Apify...');
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
      const errorText = await apifyResponse.text();
      console.error('Apify API error:', errorText);
      throw new Error(`Apify API error: ${apifyResponse.statusText}`);
    }

    const apifyData = await apifyResponse.json();
    console.log('Apify response:', apifyData);

    if (!apifyData[0]?.videoUrl) {
      console.error('No video URL found in response:', apifyData);
      throw new Error('No video URL found in Instagram post');
    }

    const videoUrl = apifyData[0].videoUrl;
    console.log('Found video URL:', videoUrl);

    // 2. Download video with proper error handling
    console.log('Downloading video...');
    const videoResponse = await fetch(videoUrl);
    if (!videoResponse.ok) {
      console.error('Video download error:', videoResponse.statusText);
      throw new Error('Failed to download video');
    }

    const contentType = videoResponse.headers.get('content-type');
    console.log('Content type:', contentType);

    // Accept both video and audio content types
    if (!contentType?.includes('video') && !contentType?.includes('audio')) {
      console.error('Invalid content type:', contentType);
      throw new Error('Invalid content type: ' + contentType);
    }

    const videoBuffer = await videoResponse.arrayBuffer();
    const MAX_SIZE = 25 * 1024 * 1024; // 25MB
    if (videoBuffer.byteLength > MAX_SIZE) {
      throw new Error('Video file too large (max 25MB)');
    }

    // 3. Prepare form data for Whisper API with proper content type
    console.log('Preparing audio for transcription...');
    const formData = new FormData();
    
    // Create a Blob with the video data and explicitly set the MIME type to audio/mpeg
    const blob = new Blob([videoBuffer], { type: 'audio/mpeg' });
    formData.append('file', blob, 'audio.mp3');
    formData.append('model', 'whisper-1');
    formData.append('response_format', 'json');

    // 4. Send to Whisper API with detailed error handling
    console.log('Sending to Whisper API...');
    console.log('Request size:', videoBuffer.byteLength, 'bytes');
    
    const whisperResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiKey}`,
      },
      body: formData,
    });

    if (!whisperResponse.ok) {
      const errorText = await whisperResponse.text();
      console.error('Whisper API error response:', errorText);
      throw new Error(`Whisper API error: ${errorText}`);
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