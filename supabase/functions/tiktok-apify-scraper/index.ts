import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { ApifyClient } from "apify-client";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RequestBody {
  username?: string;
  numberOfVideos?: number;
  dateFrom?: string;
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

    // Get request body
    const { username, numberOfVideos = 5, dateFrom } = await req.json() as RequestBody;
    
    if (!username) {
      throw new Error('Username is required');
    }

    console.log(`Fetching TikTok data for username: ${username}`);
    console.log(`Number of videos requested: ${numberOfVideos}`);
    if (dateFrom) console.log(`Date from: ${dateFrom}`);

    // Initialize the ApifyClient
    const client = new ApifyClient({
      token: APIFY_API_KEY,
    });

    // Prepare Actor input
    const input = {
      startUrls: [`https://www.tiktok.com/@${username}`],
      maxItems: numberOfVideos,
      dateRange: dateFrom ? "CUSTOM" : "DEFAULT",
      customDateFrom: dateFrom,
    };

    console.log('Starting Apify actor run with input:', input);

    // Run the Actor and wait for it to finish
    const run = await client.actor("apidojo/tiktok-scraper").call(input);
    console.log('Actor run started, run ID:', run.id);

    // Fetch results from the run's dataset
    const { items } = await client.dataset(run.defaultDatasetId).listItems();
    console.log(`Retrieved ${items.length} items from dataset`);

    // Transform and clean the data
    const transformedResults = items.map(item => ({
      authorUsername: item.authorMeta?.name || username,
      description: item.text || '',
      createTime: new Date(item.createTime).toLocaleDateString(),
      playCount: item.playCount || 0,
      viewCount: item.playCount || 0, // TikTok uses playCount as views
      likeCount: item.diggCount || 0,
      commentCount: item.commentCount || 0,
      engagement: ((item.diggCount + item.commentCount) / (item.playCount || 1) * 100).toFixed(2),
      webVideoUrl: item.webVideoUrl || '',
    }));

    return new Response(JSON.stringify(transformedResults), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in TikTok scraper:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});