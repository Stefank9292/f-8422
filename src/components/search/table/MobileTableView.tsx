import { MobilePostRow } from "../MobilePostRow";

interface MobileTableViewProps {
  posts: any[];
  handleCopyCaption: (caption: string) => void;
  handleDownload: (videoUrl: string) => void;
  formatNumber: (num: number) => string;
  truncateCaption: (caption: string) => string;
}

export const MobileTableView = ({
  posts,
  handleCopyCaption,
  handleDownload,
  formatNumber,
  truncateCaption,
}: MobileTableViewProps) => {
  return (
    <div className="space-y-4">
      {posts.map((post, index) => (
        <MobilePostRow
          key={index}
          post={post}
          onCopyCaption={handleCopyCaption}
          onDownload={handleDownload}
          formatNumber={formatNumber}
          truncateCaption={truncateCaption}
        />
      ))}
    </div>
  );
};