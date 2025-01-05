import { APIFY_CONFIG, APIFY_ENDPOINTS, APIFY_API_KEY } from '../config/apifyConfig';
import { ApifyRequestBody } from '../types/InstagramTypes';

export async function makeApifyRequest(requestBody: ApifyRequestBody) {
  console.log('Making Apify request to endpoint');
  const apiEndpoint = `${APIFY_ENDPOINTS.BASE_URL}/${APIFY_ENDPOINTS.INSTAGRAM_SCRAPER}?token=${APIFY_API_KEY}`;
  
  // Merge performance configurations with request body
  const optimizedRequestBody = {
    ...requestBody,
    ...APIFY_CONFIG,
  };
  
  try {
    console.log('Sending optimized request to Apify:', { ...optimizedRequestBody, token: '[REDACTED]' });
    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(optimizedRequestBody)
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