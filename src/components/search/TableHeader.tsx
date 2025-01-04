import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { User, PenLine, Clock, Play, Eye, Heart, MessageSquare, Zap, Link, File } from "lucide-react";

interface TableHeaderProps {
  onSort: (key: string) => void;
}

export const PostTableHeader = ({ onSort }: TableHeaderProps) => {
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
        <TableHead onClick={() => onSort('date')} className="cursor-pointer hover:bg-muted/50 text-center h-9">
          <Tooltip>
            <TooltipTrigger>
              <Clock className="h-3.5 w-3.5 mx-auto text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent>Date</TooltipContent>
          </Tooltip>
        </TableHead>
        <TableHead onClick={() => onSort('playsCount')} className="cursor-pointer hover:bg-muted/50 text-center h-9">
          <Tooltip>
            <TooltipTrigger>
              <Eye className="h-3.5 w-3.5 mx-auto text-green-500" />
            </TooltipTrigger>
            <TooltipContent>Views</TooltipContent>
          </Tooltip>
        </TableHead>
        <TableHead onClick={() => onSort('viewsCount')} className="cursor-pointer hover:bg-muted/50 text-center h-9">
          <Tooltip>
            <TooltipTrigger>
              <Play className="h-3.5 w-3.5 mx-auto text-primary" />
            </TooltipTrigger>
            <TooltipContent>Plays</TooltipContent>
          </Tooltip>
        </TableHead>
        <TableHead onClick={() => onSort('likesCount')} className="cursor-pointer hover:bg-muted/50 text-center h-9">
          <Tooltip>
            <TooltipTrigger>
              <Heart className="h-3.5 w-3.5 mx-auto text-rose-500" />
            </TooltipTrigger>
            <TooltipContent>Likes</TooltipContent>
          </Tooltip>
        </TableHead>
        <TableHead onClick={() => onSort('commentsCount')} className="cursor-pointer hover:bg-muted/50 text-center h-9">
          <Tooltip>
            <TooltipTrigger>
              <MessageSquare className="h-3.5 w-3.5 mx-auto text-blue-400" />
            </TooltipTrigger>
            <TooltipContent>Comments</TooltipContent>
          </Tooltip>
        </TableHead>
        <TableHead onClick={() => onSort('engagement')} className="cursor-pointer hover:bg-muted/50 text-center h-9">
          <Tooltip>
            <TooltipTrigger>
              <Zap className="h-3.5 w-3.5 mx-auto text-orange-500" />
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