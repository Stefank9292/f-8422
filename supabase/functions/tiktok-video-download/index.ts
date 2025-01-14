import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { videoUrl } = await req.json()
    console.log('Attempting to download video from:', videoUrl);
    
    if (!videoUrl) {
      console.error('No video URL provided');
      return new Response(
        JSON.stringify({ error: 'Video URL is required' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Fetch the video
    const response = await fetch(videoUrl)
    
    if (!response.ok) {
      console.error('Failed to fetch video:', response.statusText);
      throw new Error(`Failed to fetch video: ${response.statusText}`)
    }

    // Get the video data
    const videoData = await response.arrayBuffer()
    console.log('Successfully fetched video data, size:', videoData.byteLength);

    // Return the video data with appropriate headers
    return new Response(videoData, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'video/mp4',
        'Content-Disposition': `attachment; filename="tiktok-video.mp4"`,
      },
    })
  } catch (error) {
    console.error('Download error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})