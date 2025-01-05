import { APIFY_ENDPOINTS, APIFY_API_KEY } from '../config/apifyConfig';
import { ApifyRequestBody } from '../types/InstagramTypes';

export async function makeApifyRequest(requestBody: ApifyRequestBody) {
  console.log('Making Apify request to endpoint');
  const apiEndpoint = `${APIFY_ENDPOINTS.BASE_URL}/${APIFY_ENDPOINTS.INSTAGRAM_SCRAPER}?token=${APIFY_API_KEY}`;
  
  try {
    console.log('Sending optimized request to Apify:', { ...requestBody, token: '[REDACTED]' });
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
    
    // Validate the response data
    if (!Array.isArray(data)) {
      console.error('Invalid response format:', data);
      throw new Error('Invalid response format from Apify API');
    }

    // Filter out any null or invalid entries
    const validData = data.filter(item => 
      item && 
      typeof item === 'object' &&
      item.ownerUsername &&
      item.caption &&
      (item.videoViewCount !== undefined || item.viewsCount !== undefined) &&
      (item.videoPlayCount !== undefined || item.playsCount !== undefined)
    );

    if (validData.length === 0) {
      console.warn('No valid posts found in the response');
    } else {
      console.log(`Successfully received ${validData.length} valid posts from Apify`);
    }

    return validData;
  } catch (error) {
    console.error('Error in makeApifyRequest:', error);
    throw error;
  }
}