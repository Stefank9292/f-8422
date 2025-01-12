import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
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
    // Get auth user
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (userError || !user) {
      throw new Error('Invalid user token');
    }

    const { url } = await req.json();
    console.log('Processing URL:', url);

    // Validate URL format
    if (!url.includes('instagram.com')) {
      throw new Error('Invalid Instagram URL format');
    }

    // Fetch video details from Instagram
    const response = await fetch('https://api.apify.com/v2/acts/apify~instagram-post-scraper/run-sync-get-dataset-items', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('APIFY_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "addParentData": false,
        "directUrls": [url],
        "expandVideo": true,
        "includeVideoMetadata": true,
        "enhanceUserSearchWithFacebookPage": false,
        "isUserReelFeedURL": false,
        "isUserTaggedFeedURL": false,
        "resultsLimit": 1,
        "resultsType": "details",
        "searchLimit": 1,
        "searchType": "user",
        "maxRequestRetries": 3
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Instagram API error:', errorText);
      throw new Error(`Failed to fetch video details: ${response.statusText || 'Bad Request'}`);
    }

    const data = await response.json();
    console.log('Instagram API response:', data);

    if (!data || data.length === 0) {
      throw new Error('No video data found');
    }

    // For now, return a mock transcription
    // In a real implementation, you would process the video and transcribe it
    const transcriptionText = "This is a mock transcription of the video content.";

    return new Response(
      JSON.stringify({ 
        text: transcriptionText,
        userId: user.id 
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
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  }
});