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
        return items as InstagramPost[];
    } catch (error) {
        console.error('Error fetching Instagram posts:', error);
        throw error;
    }
};