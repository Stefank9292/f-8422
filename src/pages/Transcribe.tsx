import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { VideoIcon, FileTextIcon, MessageSquareIcon, FileIcon } from "lucide-react";
import { VideoTab } from "@/components/transcribe/tabs/VideoTab";
import { TextTab } from "@/components/transcribe/tabs/TextTab";
import { PromptTab } from "@/components/transcribe/tabs/PromptTab";
import { FileTab } from "@/components/transcribe/tabs/FileTab";
import { MobileTabSelect } from "@/components/transcribe/MobileTabSelect";

const Transcribe = () => {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState<"video" | "text" | "prompt" | "file">("video");

  const handleTabChange = (value: string) => {
    setActiveTab(value as "video" | "text" | "prompt" | "file");
  };

  return (
    <div className="container max-w-4xl py-4 md:py-6 px-4 md:px-4 space-y-4 md:space-y-6 mt-14 md:mt-0">
      <div className="space-y-2">
        <h1 className="text-lg md:text-xl font-semibold tracking-tight">Script Generator</h1>
        <p className="text-xs md:text-sm text-muted-foreground">
          Transform your videos or text content into engaging social media scripts.
        </p>
      </div>
      
      {isMobile ? (
        <div className="space-y-6">
          <MobileTabSelect value={activeTab} onValueChange={handleTabChange} />
          <div className="space-y-6">
            {activeTab === "video" && <VideoTab />}
            {activeTab === "text" && <TextTab />}
            {activeTab === "prompt" && <PromptTab />}
            {activeTab === "file" && <FileTab />}
          </div>
        </div>
      ) : (
        <Tabs 
          defaultValue="video" 
          className="space-y-4 md:space-y-6"
          onValueChange={handleTabChange}
        >
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 gap-1">
            <TabsTrigger value="video" className="space-x-1 md:space-x-2 px-2 md:px-4">
              <VideoIcon className="h-3 w-3 md:h-4 md:w-4" />
              <span className="text-xs md:text-sm">Video to Script</span>
            </TabsTrigger>
            <TabsTrigger value="text" className="space-x-1 md:space-x-2 px-2 md:px-4">
              <FileTextIcon className="h-3 w-3 md:h-4 md:w-4" />
              <span className="text-xs md:text-sm">Text to Script</span>
            </TabsTrigger>
            <TabsTrigger value="prompt" className="space-x-1 md:space-x-2 px-2 md:px-4">
              <MessageSquareIcon className="h-3 w-3 md:h-4 md:w-4" />
              <span className="text-xs md:text-sm">Prompt to Script</span>
            </TabsTrigger>
            <TabsTrigger value="file" className="space-x-1 md:space-x-2 px-2 md:px-4">
              <FileIcon className="h-3 w-3 md:h-4 md:w-4" />
              <span className="text-xs md:text-sm">File to Script</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="video">
            <VideoTab />
          </TabsContent>

          <TabsContent value="text">
            <TextTab />
          </TabsContent>

          <TabsContent value="prompt">
            <PromptTab />
          </TabsContent>

          <TabsContent value="file">
            <FileTab />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default Transcribe;