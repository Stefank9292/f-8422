import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { VideoIcon, FileTextIcon, MessageSquareIcon, FileIcon } from "lucide-react";

interface MobileTabSelectProps {
  value: string;
  onValueChange: (value: string) => void;
}

export function MobileTabSelect({ value, onValueChange }: MobileTabSelectProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-full">
        <SelectValue>
          <div className="flex items-center space-x-2">
            {value === "video" && <VideoIcon className="h-4 w-4" />}
            {value === "text" && <FileTextIcon className="h-4 w-4" />}
            {value === "prompt" && <MessageSquareIcon className="h-4 w-4" />}
            {value === "file" && <FileIcon className="h-4 w-4" />}
            <span>
              {value === "video" && "Video to Script"}
              {value === "text" && "Text to Script"}
              {value === "prompt" && "Prompt to Script"}
              {value === "file" && "File to Script"}
            </span>
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="video">
          <div className="flex items-center space-x-2">
            <VideoIcon className="h-4 w-4" />
            <span>Video to Script</span>
          </div>
        </SelectItem>
        <SelectItem value="text">
          <div className="flex items-center space-x-2">
            <FileTextIcon className="h-4 w-4" />
            <span>Text to Script</span>
          </div>
        </SelectItem>
        <SelectItem value="prompt">
          <div className="flex items-center space-x-2">
            <MessageSquareIcon className="h-4 w-4" />
            <span>Prompt to Script</span>
          </div>
        </SelectItem>
        <SelectItem value="file">
          <div className="flex items-center space-x-2">
            <FileIcon className="h-4 w-4" />
            <span>File to Script</span>
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  );
}