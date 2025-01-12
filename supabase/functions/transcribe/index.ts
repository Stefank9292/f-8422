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

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB in bytes

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url, file, fileName, fileType } = await req.json();
    console.log('Request received:', { hasUrl: !!url, hasFile: !!file, fileName, fileType });

    // Get OpenAI API key from environment
    const openaiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiKey) {
      throw new Error('Missing OpenAI API key');
    }

    let audioData: ArrayBuffer;
    let audioType: string;
    let finalFileName: string;

    if (url) {
      console.log('Processing Instagram URL:', url);

      // Process Instagram URL using Apify
      const apifyKey = Deno.env.get('APIFY_API_KEY');
      if (!apifyKey) {
        throw new Error('Missing Apify API key');
      }

      const apifyResponse = await fetch('https://api.apify.com/v2/acts/apify~instagram-scraper/run-sync-get-dataset-items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apifyKey}`,
        },
        body: JSON.stringify({
          "addParentData": false,
          "directUrls": [url],
          "resultsLimit": 1,
          "resultsType": "details",
          "searchType": "user"
        })
      });

      if (!apifyResponse.ok) {
        console.error('Apify API error:', await apifyResponse.text());
        throw new Error(`Apify API error: ${apifyResponse.statusText}`);
      }

      const apifyData = await apifyResponse.json();
      console.log('Apify response:', apifyData);

      // Extract video URL from Apify response
      const videoUrl = apifyData[0]?.video_url || apifyData[0]?.videoUrl;
      if (!videoUrl) {
        console.error('No video URL found in response:', apifyData);
        throw new Error('No video URL found in Instagram post');
      }

      console.log('Found video URL:', videoUrl);
      finalFileName = 'instagram_video.mp4';

      // Download video
      console.log('Downloading video from:', videoUrl);
      const videoResponse = await fetch(videoUrl);
      if (!videoResponse.ok) {
        throw new Error('Failed to download video');
      }

      audioData = await videoResponse.arrayBuffer();
      audioType = videoResponse.headers.get('content-type') || 'video/mp4';
      console.log('Video downloaded successfully, size:', audioData.byteLength, 'bytes');
    } else if (file) {
      console.log('Processing uploaded file:', fileName);
      
      // Validate file type
      if (!ACCEPTED_FILE_TYPES.includes(fileType)) {
        throw new Error(`Invalid file type. Supported formats: ${ACCEPTED_FILE_TYPES.join(', ')}`);
      }

      // Convert file data to ArrayBuffer
      if (typeof file === 'string' && file.includes('base64,')) {
        console.log('Converting base64 to ArrayBuffer');
        const base64Data = file.split('base64,')[1];
        audioData = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0)).buffer;
      } else if (file instanceof ArrayBuffer) {
        audioData = file;
      } else {
        console.error('Invalid file data format:', typeof file);
        throw new Error('Invalid file data format');
      }

      audioType = fileType;
      finalFileName = fileName || 'uploaded_audio.mp3';
      console.log('File processed, size:', audioData.byteLength, 'bytes');
    } else {
      throw new Error('No URL or file provided');
    }

    // Check file size
    if (audioData.byteLength > MAX_FILE_SIZE) {
      throw new Error('File size exceeds 25MB limit');
    }

    // Prepare form data for Whisper API
    console.log('Preparing audio for transcription...');
    const formData = new FormData();
    const uint8Array = new Uint8Array(audioData);
    const blob = new Blob([uint8Array], { type: audioType });
    formData.append('file', blob, finalFileName);
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
      console.error('Whisper API error:', error);
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