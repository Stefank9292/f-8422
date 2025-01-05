import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface InstagramPost {
  url: string;
  caption: string;
  likesCount: number;
  commentsCount: number;
  viewsCount: number;
  playsCount: number;
  duration: string;
  engagement: string;
  date: string;
  type: string;
  timestamp: string;
  hashtags: string[];
  mentions: string[];
  ownerUsername: string;
  ownerId: string;
  locationName?: string;
}

async function makeApifyRequest(requestBody: any): Promise<InstagramPost[]> {
  const apiKey = Deno.env.get('APIFY_API_KEY');
  if (!apiKey) {
    throw new Error('APIFY_API_KEY is not set');
  }

  const response = await fetch(
    `https://api.apify.com/v2/acts/apify~instagram-scraper/run-sync-get-dataset-items?token=${apiKey}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    }
  );

  if (!response.ok) {
    const errorBody = await response.text();
    console.error('API Error Response:', errorBody);
    
    if (response.status === 402) {
      throw new Error('Instagram data fetch failed: Usage quota exceeded. Please try again later or reduce the number of requested posts.');
    }
    
    throw new Error(`Apify API request failed: ${response.statusText}\nResponse: ${errorBody}`);
  }

  return await response.json();
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { urls, numberOfVideos, postsNewerThan } = await req.json();
    console.log('Processing request:', { urls, numberOfVideos, postsNewerThan });

    const cleanUrls = Array.isArray(urls) ? urls.map(url => {
      let cleanUrl = url.trim();
      if (!cleanUrl.startsWith('https://')) {
        cleanUrl = `https://www.instagram.com/${cleanUrl.replace('@', '')}/`;
      }
      return cleanUrl;
    }) : [urls].map(url => {
      let cleanUrl = url.trim();
      if (!cleanUrl.startsWith('https://')) {
        cleanUrl = `https://www.instagram.com/${cleanUrl.replace('@', '')}/`;
      }
      return cleanUrl;
    });

    const requestBody = {
      addParentData: false,
      directUrls: cleanUrls,
      enhanceUserSearchWithFacebookPage: false,
      isUserReelFeedURL: false,
      isUserTaggedFeedURL: false,
      resultsLimit: numberOfVideos,
      resultsType: "posts",
      searchLimit: 1,
      searchType: "user",
      maxPosts: numberOfVideos,
      mediaTypes: ["VIDEO"],
      expandVideo: true,
      includeVideoMetadata: true
    };

    if (postsNewerThan) {
      requestBody.onlyPostsNewerThan = new Date(postsNewerThan).toISOString().split('T')[0];
    }

    const posts = await makeApifyRequest(requestBody);
    console.log(`Successfully fetched ${posts.length} posts`);

    return new Response(
      JSON.stringify(posts),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error processing request:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});