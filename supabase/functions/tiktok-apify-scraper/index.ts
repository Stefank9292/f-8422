import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TikTokRequestBody {
  username: string;
  numberOfVideos?: number;
  dateRange?: string;
  location?: string;
}

interface TikTokChannel {
  name: string;
  username: string;
  id: string;
  url: string;
  avatar: string;
  verified: boolean;
  followers: number;
  following: number;
  videos: number;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const APIFY_API_KEY = Deno.env.get('APIFY_API_KEY');
    if (!APIFY_API_KEY) {
      throw new Error('APIFY_API_KEY is not set');
    }

    const { username, numberOfVideos = 3, dateRange = "DEFAULT", location = "US" } = await req.json() as TikTokRequestBody;

    console.log('TikTok scraper request:', { username, numberOfVideos, dateRange, location });

    const requestBody = {
      "customMapFunction": "(object) => { return {...object} }",
      "dateRange": dateRange,
      "location": location,
      "maxItems": numberOfVideos,
      "startUrls": [
        `https://www.tiktok.com/@${username.replace('@', '')}`
      ]
    };

    const response = await fetch(
      'https://api.apify.com/v2/acts/apidojo~tiktok-scraper/run-sync-get-dataset-items?token=' + APIFY_API_KEY,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      throw new Error(`Apify API error: ${response.status} ${response.statusText}`);
    }

    const rawData = await response.json();
    console.log('Raw TikTok API response:', rawData);

    // Transform the data to handle dot notation and prevent circular references
    const transformedData = rawData.map((item: any) => {
      // Extract channel information from dot notation fields
      const channel: TikTokChannel = {
        name: item['channel.name']?.value || '',
        username: item['channel.username']?.value || '',
        id: item['channel.id']?.value || '',
        url: item['channel.url']?.value || '',
        avatar: item['channel.avatar']?.value || '',
        verified: item['channel.verified']?.value || false,
        followers: item['channel.followers']?.value || 0,
        following: item['channel.following']?.value || 0,
        videos: item['channel.videos']?.value || 0
      };

      // Return transformed post with proper structure
      return {
        ...item,
        channel,
        // Remove dot notation fields to prevent duplication
        'channel.name': undefined,
        'channel.username': undefined,
        'channel.id': undefined,
        'channel.url': undefined,
        'channel.avatar': undefined,
        'channel.verified': undefined,
        'channel.followers': undefined,
        'channel.following': undefined,
        'channel.videos': undefined
      };
    });

    console.log('Transformed TikTok data:', transformedData);

    return new Response(
      JSON.stringify(transformedData),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    console.error('Error in tiktok-scraper function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
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