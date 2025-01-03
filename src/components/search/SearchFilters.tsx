import { Filter, Calendar, HelpCircle, Eye, Play, Heart, MessageCircle, Clock, Zap, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface FiltersType {
  minViews: string;
  minPlays: string;
  minLikes: string;
  minComments: string;
  minDuration: string;
  minEngagement: string;
  postsNewerThan: string;
}

interface SearchFiltersProps {
  filters: FiltersType;
  onFilterChange: (key: keyof FiltersType, value: string) => void;
  onReset: () => void;
  totalResults: number;
  filteredResults: number;
  currentPosts: any[]; // Add this prop to receive the filtered posts
}

export const SearchFilters = ({ 
  filters, 
  onFilterChange, 
  onReset,
  totalResults,
  filteredResults,
  currentPosts
}: SearchFiltersProps) => {
  const handleExportCSV = () => {
    // Convert posts data to CSV format
    const headers = [
      'Username',
      'Caption',
      'Date',
      'Plays',
      'Views',
      'Likes',
      'Comments',
      'Duration',
      'Engagement',
      'URL'
    ].join(',');

    const rows = currentPosts.map(post => [
      `@${post.ownerUsername}`,
      `"${post.caption.replace(/"/g, '""')}"`, // Escape quotes in caption
      post.date,
      post.playsCount,
      post.viewsCount,
      post.likesCount,
      post.commentsCount,
      post.duration || '0:00',
      post.engagement,
      post.url
    ].join(','));

    const csvContent = [headers, ...rows].join('\n');
    
    // Create and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `tiktok-search-results-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* Filter Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5" />
          <h2 className="text-lg font-semibold">Filter Results</h2>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            Showing {filteredResults} of {totalResults} results
          </span>
          <Button variant="outline" size="sm" onClick={handleExportCSV}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button variant="outline" size="sm" onClick={onReset}>
            Reset
          </Button>
        </div>
      </div>

      {/* Filter Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-muted/50 p-4 rounded-lg">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <label className="text-sm font-medium">Posts newer than</label>
            <HelpCircle className="w-4 h-4 text-gray-400" />
          </div>
          <Input
            type="text"
            placeholder="tt.mm.jjjj"
            value={filters.postsNewerThan}
            onChange={(e) => onFilterChange('postsNewerThan', e.target.value)}
          />
          <p className="text-xs text-gray-500">Limited to posts from the last 90 days</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-gray-500" />
            <label className="text-sm font-medium">Minimum Views</label>
          </div>
          <Input
            type="number"
            placeholder="e.g. 10000"
            value={filters.minViews}
            onChange={(e) => onFilterChange('minViews', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Play className="w-4 h-4 text-gray-500" />
            <label className="text-sm font-medium">Minimum Plays</label>
          </div>
          <Input
            type="number"
            placeholder="e.g. 5000"
            value={filters.minPlays}
            onChange={(e) => onFilterChange('minPlays', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-gray-500" />
            <label className="text-sm font-medium">Minimum Likes</label>
          </div>
          <Input
            type="number"
            placeholder="e.g. 1000"
            value={filters.minLikes}
            onChange={(e) => onFilterChange('minLikes', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-gray-500" />
            <label className="text-sm font-medium">Minimum Comments</label>
          </div>
          <Input
            type="number"
            placeholder="e.g. 100"
            value={filters.minComments}
            onChange={(e) => onFilterChange('minComments', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-500" />
            <label className="text-sm font-medium">Minimum Duration</label>
          </div>
          <Input
            type="text"
            placeholder="e.g. 30"
            value={filters.minDuration}
            onChange={(e) => onFilterChange('minDuration', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-gray-500" />
            <label className="text-sm font-medium">Minimum Engagement</label>
          </div>
          <Input
            type="text"
            placeholder="e.g. 5"
            value={filters.minEngagement}
            onChange={(e) => onFilterChange('minEngagement', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};