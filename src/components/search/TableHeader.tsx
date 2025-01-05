import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { User, PenLine, Clock, Play, Eye, Heart, MessageSquare, Zap, Link, File, ArrowUpDown } from "lucide-react";
import { SortDirection } from "./TableContent";
import { cn } from "@/lib/utils";

interface TableHeaderProps {
  onSort: (key: string) => void;
  sortKey: string;
  sortDirection: SortDirection;
}

export const PostTableHeader = ({ onSort, sortKey, sortDirection }: TableHeaderProps) => {
  const getSortIcon = (columnKey: string) => {
    if (sortKey !== columnKey) {
      return <ArrowUpDown className="h-3 w-3 ml-1 inline-block opacity-0 group-hover:opacity-100 transition-opacity" />;
    }
    return <ArrowUpDown className={cn(
      "h-3 w-3 ml-1 inline-block",
      sortDirection === "desc" ? "rotate-180" : ""
    )} />;
  };

  return (
    <TableHeader>
      <TableRow className="hover:bg-transparent border-b border-border/50">
        <TableHead className="h-9">
          <Tooltip>
            <TooltipTrigger>
              <User className="h-3.5 w-3.5 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent>Username</TooltipContent>
          </Tooltip>
        </TableHead>
        <TableHead className="h-9">
          <Tooltip>
            <TooltipTrigger>
              <PenLine className="h-3.5 w-3.5 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent>Caption</TooltipContent>
          </Tooltip>
        </TableHead>
        <TableHead onClick={() => onSort('date')} className="group cursor-pointer hover:bg-muted/50 text-center h-9">
          <Tooltip>
            <TooltipTrigger className="flex items-center justify-center">
              <Clock className="h-3.5 w-3.5 text-muted-foreground" />
              {getSortIcon('date')}
            </TooltipTrigger>
            <TooltipContent>Date</TooltipContent>
          </Tooltip>
        </TableHead>
        <TableHead onClick={() => onSort('playsCount')} className="group cursor-pointer hover:bg-muted/50 text-center h-9">
          <Tooltip>
            <TooltipTrigger className="flex items-center justify-center">
              <Eye className="h-3.5 w-3.5 text-green-500" />
              {getSortIcon('playsCount')}
            </TooltipTrigger>
            <TooltipContent>Views</TooltipContent>
          </Tooltip>
        </TableHead>
        <TableHead onClick={() => onSort('viewsCount')} className="group cursor-pointer hover:bg-muted/50 text-center h-9">
          <Tooltip>
            <TooltipTrigger className="flex items-center justify-center">
              <Play className="h-3.5 w-3.5 text-primary" />
              {getSortIcon('viewsCount')}
            </TooltipTrigger>
            <TooltipContent>Plays</TooltipContent>
          </Tooltip>
        </TableHead>
        <TableHead onClick={() => onSort('likesCount')} className="group cursor-pointer hover:bg-muted/50 text-center h-9">
          <Tooltip>
            <TooltipTrigger className="flex items-center justify-center">
              <Heart className="h-3.5 w-3.5 text-rose-500" />
              {getSortIcon('likesCount')}
            </TooltipTrigger>
            <TooltipContent>Likes</TooltipContent>
          </Tooltip>
        </TableHead>
        <TableHead onClick={() => onSort('commentsCount')} className="group cursor-pointer hover:bg-muted/50 text-center h-9">
          <Tooltip>
            <TooltipTrigger className="flex items-center justify-center">
              <MessageSquare className="h-3.5 w-3.5 text-blue-400" />
              {getSortIcon('commentsCount')}
            </TooltipTrigger>
            <TooltipContent>Comments</TooltipContent>
          </Tooltip>
        </TableHead>
        <TableHead onClick={() => onSort('engagement')} className="group cursor-pointer hover:bg-muted/50 text-center h-9">
          <Tooltip>
            <TooltipTrigger className="flex items-center justify-center">
              <Zap className="h-3.5 w-3.5 text-orange-500" />
              {getSortIcon('engagement')}
            </TooltipTrigger>
            <TooltipContent>Engagement</TooltipContent>
          </Tooltip>
        </TableHead>
        <TableHead className="text-center h-9">
          <Tooltip>
            <TooltipTrigger>
              <Link className="h-3.5 w-3.5 mx-auto text-rose-400" />
            </TooltipTrigger>
            <TooltipContent>Open URL</TooltipContent>
          </Tooltip>
        </TableHead>
        <TableHead className="text-center h-9">
          <Tooltip>
            <TooltipTrigger>
              <File className="h-3.5 w-3.5 mx-auto text-blue-400" />
            </TooltipTrigger>
            <TooltipContent>Download</TooltipContent>
          </Tooltip>
        </TableHead>
      </TableRow>
    </TableHeader>
  );
};