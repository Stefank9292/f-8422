import { InstagramPost, SupabaseSearchResult, SearchResultItem } from "@/types/instagram";

export function transformSearchResults(data: SupabaseSearchResult): SearchResultItem {
  const parsedResults = Array.isArray(data.results) 
    ? data.results.map(result => {
        if (typeof result === 'object' && result !== null) {
          const post = result as Record<string, unknown>;
          return {
            ownerUsername: String(post.ownerUsername || ''),
            caption: String(post.caption || ''),
            date: String(post.date || ''),
            playsCount: Number(post.playsCount || 0),
            viewsCount: Number(post.viewsCount || 0),
            likesCount: Number(post.likesCount || 0),
            commentsCount: Number(post.commentsCount || 0),
            duration: String(post.duration || ''),
            engagement: String(post.engagement || ''),
            url: String(post.url || ''),
            videoUrl: post.videoUrl ? String(post.videoUrl) : undefined,
            timestamp: post.timestamp ? String(post.timestamp) : undefined,
          } as InstagramPost;
        }
        return null;
      }).filter((post): post is InstagramPost => post !== null)
    : [];

  return {
    id: data.id,
    search_history_id: data.search_history_id,
    created_at: data.created_at,
    results: parsedResults
  };
}