import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SearchResultsProps {
  posts: any[];
}

export const SearchResults = ({ posts }: SearchResultsProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Thumbnail</TableHead>
          <TableHead>Username</TableHead>
          <TableHead>Caption</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Views</TableHead>
          <TableHead>Plays</TableHead>
          <TableHead>Likes</TableHead>
          <TableHead>Comments</TableHead>
          <TableHead>Duration</TableHead>
          <TableHead>Engagement</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {posts.map((post, index) => (
          <TableRow key={index}>
            <TableCell>
              {post.displayUrl && (
                <img 
                  src={post.displayUrl} 
                  alt="Post thumbnail" 
                  className="w-16 h-16 object-cover rounded-md"
                />
              )}
            </TableCell>
            <TableCell>@{post.ownerUsername}</TableCell>
            <TableCell className="max-w-xs truncate">{post.caption}</TableCell>
            <TableCell title={post.timestamp}>{post.date}</TableCell>
            <TableCell>{post.viewsCount.toLocaleString()}</TableCell>
            <TableCell>{post.playsCount.toLocaleString()}</TableCell>
            <TableCell>{post.likesCount.toLocaleString()}</TableCell>
            <TableCell>{post.commentsCount.toLocaleString()}</TableCell>
            <TableCell>{post.duration}</TableCell>
            <TableCell>{post.engagement}</TableCell>
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
  );
};