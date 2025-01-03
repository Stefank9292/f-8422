import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { User, PenLine, Clock, Play, Eye, Heart, MessageSquare, Timer, Zap, Download, Chain } from "lucide-react";

interface TableHeaderProps {
  onSort: (key: string) => void;
}

export const PostTableHeader = ({ onSort }: TableHeaderProps) => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead>
          <Tooltip>
            <TooltipTrigger>
              <User className="h-4 w-4 text-gray-600" />
            </TooltipTrigger>
            <TooltipContent>Username</TooltipContent>
          </Tooltip>
        </TableHead>
        <TableHead>
          <Tooltip>
            <TooltipTrigger>
              <PenLine className="h-4 w-4 text-gray-600" />
            </TooltipTrigger>
            <TooltipContent>Caption</TooltipContent>
          </Tooltip>
        </TableHead>
        <TableHead onClick={() => onSort('date')} className="cursor-pointer hover:bg-muted/50 text-center">
          <Tooltip>
            <TooltipTrigger>
              <Clock className="h-4 w-4 mx-auto text-gray-500" />
            </TooltipTrigger>
            <TooltipContent>Date</TooltipContent>
          </Tooltip>
        </TableHead>
        <TableHead onClick={() => onSort('playsCount')} className="cursor-pointer hover:bg-muted/50 text-center">
          <Tooltip>
            <TooltipTrigger>
              <Eye className="h-4 w-4 mx-auto text-green-500" />
            </TooltipTrigger>
            <TooltipContent>Plays</TooltipContent>
          </Tooltip>
        </TableHead>
        <TableHead onClick={() => onSort('viewsCount')} className="cursor-pointer hover:bg-muted/50 text-center">
          <Tooltip>
            <TooltipTrigger>
              <Play className="h-4 w-4 mx-auto text-blue-500" />
            </TooltipTrigger>
            <TooltipContent>Views</TooltipContent>
          </Tooltip>
        </TableHead>
        <TableHead onClick={() => onSort('likesCount')} className="cursor-pointer hover:bg-muted/50 text-center">
          <Tooltip>
            <TooltipTrigger>
              <Heart className="h-4 w-4 mx-auto text-rose-500" />
            </TooltipTrigger>
            <TooltipContent>Likes</TooltipContent>
          </Tooltip>
        </TableHead>
        <TableHead onClick={() => onSort('commentsCount')} className="cursor-pointer hover:bg-muted/50 text-center">
          <Tooltip>
            <TooltipTrigger>
              <MessageSquare className="h-4 w-4 mx-auto text-blue-400" />
            </TooltipTrigger>
            <TooltipContent>Comments</TooltipContent>
          </Tooltip>
        </TableHead>
        <TableHead onClick={() => onSort('duration')} className="cursor-pointer hover:bg-muted/50 text-center">
          <Tooltip>
            <TooltipTrigger>
              <Timer className="h-4 w-4 mx-auto text-purple-500" />
            </TooltipTrigger>
            <TooltipContent>Duration</TooltipContent>
          </Tooltip>
        </TableHead>
        <TableHead onClick={() => onSort('engagement')} className="cursor-pointer hover:bg-muted/50 text-center">
          <Tooltip>
            <TooltipTrigger>
              <Zap className="h-4 w-4 mx-auto text-orange-500" />
            </TooltipTrigger>
            <TooltipContent>Engagement</TooltipContent>
          </Tooltip>
        </TableHead>
        <TableHead className="text-center">
          <Tooltip>
            <TooltipTrigger>
              <Chain className="h-4 w-4 mx-auto text-rose-400" />
            </TooltipTrigger>
            <TooltipContent>Open URL</TooltipContent>
          </Tooltip>
        </TableHead>
        <TableHead className="text-center">
          <Tooltip>
            <TooltipTrigger>
              <Download className="h-4 w-4 mx-auto text-blue-400" />
            </TooltipTrigger>
            <TooltipContent>Download</TooltipContent>
          </Tooltip>
        </TableHead>
      </TableRow>
    </TableHeader>
  );
};