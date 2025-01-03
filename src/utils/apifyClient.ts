import { ApifyClient } from 'apify-client';

const client = new ApifyClient({
    token: 'apify_api_yT1CTZA7SyxHa9eRpx9lI2Fkjhj7Dr0rili1',
});

export interface InstagramPost {
    url: string;  // Making url required by removing the optional operator
    caption?: string;
    likesCount?: number;
    commentsCount?: number;
    timestamp?: string;
    type?: string;
    displayUrl?: string;
    mediaCount?: number;
    ownerUsername?: string;
}

// Type guard function to check if an object is an InstagramPost
function isInstagramPost(obj: unknown): obj is InstagramPost {
    return (
        typeof obj === 'object' &&
        obj !== null &&
        'url' in obj &&
        typeof (obj as any).url === 'string'
    );
}

export const fetchInstagramPosts = async (username: string): Promise<InstagramPost[]> => {
    try {
        const input = {
            "directUrls": [
                `https://www.instagram.com/${username}/`
            ],
            "resultsType": "posts",
            "resultsLimit": 200,
            "searchType": "user",
            "searchLimit": 1,
            "addParentData": false
        };

        const run = await client.actor("shu8hvrXbJbY3Eb9W").call(input);
        const { items } = await client.dataset(run.defaultDatasetId).listItems();
        
        // Type assertion and validation of the API response
        const validPosts = items.filter((item): item is InstagramPost => {
            if (!isInstagramPost(item)) {
                console.warn('Invalid post data structure:', item);
                return false;
            }
            return true;
        });
        
        if (validPosts.length === 0) {
            console.warn('No valid Instagram posts found in the response');
        }
        
        return validPosts;
    } catch (error) {
        console.error('Error fetching Instagram posts:', error);
        throw error;
    }
};