import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { ApifyClient } from "https://esm.sh/apify-client@2.9.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { username, numberOfVideos, selectedDate, location } = await req.json();

    // Initialize the Apify client
    const client = new ApifyClient({
      token: Deno.env.get('TIKTOK_APIFY_API_KEY'),
    });

    // Prepare the input
    const input = {
      username,
      maxPostCount: numberOfVideos || 3,
      startDate: selectedDate,
      proxyConfiguration: {
        useApifyProxy: true,
        apifyProxyCountry: location,
      },
    };

    console.log("Running actor with input:", input);

    // Run the actor and wait for it to finish
    const run = await client.actor("clockworks/tiktok-scraper").call(input);

    console.log("Actor finished, fetching results");

    // Fetch the actor's output
    const { items: results } = await client.dataset(run.defaultDatasetId).listItems();

    console.log("Transforming results");

    // Transform the results
    const transformedResults = results.map((post: any) => ({
      username: post.authorUsername,
      caption: post.caption,
      date: post.createTime,
      viewsCount: post.playCount,
      sharesCount: post.shareCount,
      likesCount: post.likeCount,
      commentsCount: post.commentCount,
      engagement: ((post.likeCount + post.commentCount + post.shareCount) / post.playCount * 100).toFixed(2) + '%',
      url: post.webVideoUrl,
      videoUrl: post.downloadUrl,
      timestamp: post.createTime,
    }));

    console.log("Returning transformed results");

    return new Response(
      JSON.stringify({ results: transformedResults }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    );
  } catch (error) {
    console.error("Error in tiktok-scraper:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    );
  }
});