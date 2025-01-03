import { ApifyClient } from 'apify-client';

const client = new ApifyClient({
    token: 'apify_api_yT1CTZA7SyxHa9eRpx9lI2Fkjhj7Dr0rili1',
});

export interface InstagramPost {
    url: string;
    caption?: string;
    likesCount?: number;
    commentsCount?: number;
    timestamp?: string;
    type?: string;
    displayUrl?: string;
    mediaCount?: number;
    ownerUsername?: string;
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
        
        // Type assertion with runtime validation
        const posts = items.map(item => {
            if (typeof item === 'object' && item !== null && 'url' in item) {
                return item as InstagramPost;
            }
            throw new Error('Invalid post data structure');
        });
        
        return posts;
    } catch (error) {
        console.error('Error fetching Instagram posts:', error);
        throw error;
    }
};