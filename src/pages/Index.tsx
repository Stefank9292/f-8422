import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fetchInstagramPosts } from "@/utils/apifyClient";
import { SearchHeader } from "@/components/search/SearchHeader";
import { SearchBar } from "@/components/search/SearchBar";
import { SearchSettings } from "@/components/search/SearchSettings";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Filter, 
  Download,
  Calendar,
  HelpCircle,
  Eye,
  Play,
  Heart,
  MessageCircle,
  Clock,
  Zap,
  ExternalLink
} from "lucide-react";

const Index = () => {
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [numberOfVideos, setNumberOfVideos] = useState(3);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [posts, setPosts] = useState<any[]>([]);
  const [filters, setFilters] = useState({
    minViews: "",
    minPlays: "",
    minLikes: "",
    minComments: "",
    minDuration: "",
    minEngagement: "",
    postsNewerThan: ""
  });
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!username) {
      toast({
        title: "Error",
        description: "Please enter an Instagram username",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      console.log('Starting Apify API request for username:', username);
      const fetchedPosts = await fetchInstagramPosts(username);
      setPosts(fetchedPosts);
      toast({
        title: "Success",
        description: `Found ${fetchedPosts.length} posts for @${username}`,
      });
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast({
        title: "Error",
        description: "Failed to fetch Instagram posts",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const filteredPosts = posts.filter(post => {
    if (filters.minViews && post.viewsCount < parseInt(filters.minViews)) return false;
    if (filters.minPlays && post.playsCount < parseInt(filters.minPlays)) return false;
    if (filters.minLikes && post.likesCount < parseInt(filters.minLikes)) return false;
    if (filters.minComments && post.commentsCount < parseInt(filters.minComments)) return false;
    if (filters.minDuration && post.duration < filters.minDuration) return false;
    if (filters.minEngagement && parseFloat(post.engagement) < parseFloat(filters.minEngagement)) return false;
    if (filters.postsNewerThan && new Date(post.date) < new Date(filters.postsNewerThan)) return false;
    return true;
  });

  return (
    <div className="container mx-auto flex flex-col items-center justify-start min-h-screen p-4 space-y-8">
      <SearchHeader />

      <p className="text-gray-600 text-lg text-center">
        Save time finding viral content for social media
      </p>

      <div className="w-full max-w-2xl space-y-4">
        <SearchBar
          username={username}
          onUsernameChange={setUsername}
          onSearch={handleSearch}
        />

        <Button 
          onClick={handleSearch} 
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? "Searching..." : "Search"}
        </Button>

        <SearchSettings
          isSettingsOpen={isSettingsOpen}
          setIsSettingsOpen={setIsSettingsOpen}
          numberOfVideos={numberOfVideos}
          setNumberOfVideos={setNumberOfVideos}
        />
      </div>

      {/* Results Section */}
      {posts.length > 0 && (
        <div className="w-full max-w-6xl space-y-4">
          {/* Filter Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              <h2 className="text-lg font-semibold">Filter Results</h2>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                Showing {filteredPosts.length} of {posts.length} results
              </span>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
              <Button variant="outline" size="sm" onClick={() => setFilters({
                minViews: "",
                minPlays: "",
                minLikes: "",
                minComments: "",
                minDuration: "",
                minEngagement: "",
                postsNewerThan: ""
              })}>
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
                onChange={(e) => handleFilterChange('postsNewerThan', e.target.value)}
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
                onChange={(e) => handleFilterChange('minViews', e.target.value)}
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
                onChange={(e) => handleFilterChange('minPlays', e.target.value)}
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
                onChange={(e) => handleFilterChange('minLikes', e.target.value)}
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
                onChange={(e) => handleFilterChange('minComments', e.target.value)}
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
                onChange={(e) => handleFilterChange('minDuration', e.target.value)}
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
                onChange={(e) => handleFilterChange('minEngagement', e.target.value)}
              />
            </div>
          </div>

          {/* Results Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Caption</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Views</TableHead>
                <TableHead>Plays</TableHead>
                <TableHead>Likes</TableHead>
                <TableHead>Comments</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Engagement</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Hashtags</TableHead>
                <TableHead>Mentions</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPosts.map((post, index) => (
                <TableRow key={index}>
                  <TableCell>{post.type}</TableCell>
                  <TableCell>@{post.ownerUsername}</TableCell>
                  <TableCell className="max-w-xs truncate">{post.caption}</TableCell>
                  <TableCell title={post.timestamp}>{post.date}</TableCell>
                  <TableCell>{post.viewsCount.toLocaleString()}</TableCell>
                  <TableCell>{post.playsCount.toLocaleString()}</TableCell>
                  <TableCell>{post.likesCount.toLocaleString()}</TableCell>
                  <TableCell>{post.commentsCount.toLocaleString()}</TableCell>
                  <TableCell>{post.duration}</TableCell>
                  <TableCell>{post.engagement}</TableCell>
                  <TableCell>{post.locationName || '-'}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {post.hashtags.map((tag, i) => (
                        <span key={i} className="text-xs bg-muted px-1 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {post.mentions.map((mention, i) => (
                        <span key={i} className="text-xs text-blue-500">
                          {mention}
                        </span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => window.open(post.url, '_blank')}>
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default Index;
