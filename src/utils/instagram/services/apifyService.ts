import { supabase } from "@/integrations/supabase/client";
import { ApifyRequestBody } from "../types/InstagramTypes";

export async function makeApifyRequest(requestBody: ApifyRequestBody) {
  console.log('Making Apify request to endpoint');
  const apiEndpoint = `https://api.apify.com/v2/acts/apify~instagram-scraper/run-sync-get-dataset-items?token=${process.env.APIFY_API_KEY}`;
  
  try {
    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('API Error Response:', errorBody);
      
      if (response.status === 402) {
        throw new Error('Instagram data fetch failed: Usage quota exceeded. Please try again later or reduce the number of requested posts.');
      }
      
      throw new Error(`Apify API request failed: ${response.statusText}\nResponse: ${errorBody}`);
    }

    const data = await response.json();
    console.log('Successfully received data from Apify');
    return data;
  } catch (error) {
    console.error('Error in makeApifyRequest:', error);
    throw error;
  }
}

export async function checkSubscriptionAndLimits(userId: string): Promise<{
  canMakeRequest: boolean;
  maxRequestsPerDay: number;
  isSteroidsUser: boolean;
}> {
  console.log('Checking subscription and limits for user:', userId);
  
  // Get subscription status
  const { data: subscriptionData, error: subscriptionError } = await supabase.functions.invoke(
    'check-subscription',
    {
      body: { userId }
    }
  );

  if (subscriptionError) {
    console.error('Error checking subscription:', subscriptionError);
    throw new Error('Failed to check subscription status');
  }

  const isSteroidsUser = 
    subscriptionData?.priceId === "price_1Qdty5GX13ZRG2XiFxadAKJW" || 
    subscriptionData?.priceId === "price_1QdtyHGX13ZRG2Xib8px0lu0";

  const isProUser = 
    subscriptionData?.priceId === "price_1QdtwnGX13ZRG2XihcM36r3W" || 
    subscriptionData?.priceId === "price_1Qdtx2GX13ZRG2XieXrqPxAV";

  // Get current day's request count
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfDay = new Date(startOfDay);
  endOfDay.setDate(endOfDay.getDate() + 1);

  const { count } = await supabase
    .from('user_requests')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('request_type', 'instagram_search')
    .gte('created_at', startOfDay.toISOString())
    .lt('created_at', endOfDay.toISOString());

  const currentRequests = count || 0;
  const maxRequestsPerDay = isSteroidsUser ? Infinity : (isProUser ? 25 : 3);
  const canMakeRequest = currentRequests < maxRequestsPerDay;

  console.log('Subscription check results:', {
    currentRequests,
    maxRequestsPerDay,
    canMakeRequest,
    isSteroidsUser
  });

  return {
    canMakeRequest,
    maxRequestsPerDay,
    isSteroidsUser
  };
}