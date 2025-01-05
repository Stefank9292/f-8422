import { BookOpen, AlertCircle, CheckCircle, ArrowRight, Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const HelpCenter = () => {
  return (
    <div className="min-h-screen p-4 bg-background">
      <div className="max-w-4xl mx-auto space-y-8 pt-8">
        <div className="space-y-4">
          <h1 className="text-3xl font-semibold tracking-tight">Help Center</h1>
          <p className="text-muted-foreground">
            Get help with VyralSearch and learn how to make the most of our features
          </p>
        </div>

        {/* Getting Started Section */}
        <Card className="p-6">
          <div className="flex items-start gap-3">
            <BookOpen className="h-6 w-6 text-primary shrink-0" />
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Getting Started</h2>
              <p className="text-muted-foreground">Welcome to VyralSearch</p>
              
              <div className="space-y-4">
                <p>Get started with our platform in three simple steps:</p>
                <ol className="space-y-2 pl-5">
                  <li className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4 text-primary shrink-0" />
                    Enter an Instagram username or profile URL
                  </li>
                  <li className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4 text-primary shrink-0" />
                    Configure your search settings (optional)
                  </li>
                  <li className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4 text-primary shrink-0" />
                    Click "Search Viral Videos" to start analyzing
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </Card>

        {/* Known Issues Section */}
        <Card className="p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-6 w-6 text-yellow-500 shrink-0" />
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Known Issues</h2>
              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <h3 className="font-medium flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  Current Limitations
                </h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Private Instagram accounts cannot be searched</li>
                  <li>• Some videos may have limited metadata available</li>
                  <li>• Historical data beyond 90 days may be incomplete</li>
                </ul>
              </div>
            </div>
          </div>
        </Card>

        {/* Best Practices Section */}
        <Card className="p-6">
          <div className="flex items-start gap-3">
            <CheckCircle className="h-6 w-6 text-green-500 shrink-0" />
            <div className="space-y-6 w-full">
              <h2 className="text-xl font-semibold">Best Practices</h2>
              
              <div className="grid gap-6 sm:grid-cols-3">
                <div className="space-y-3">
                  <div className="bg-primary/10 w-8 h-8 rounded-full flex items-center justify-center font-semibold">1</div>
                  <h3 className="font-medium">Use Specific Searches</h3>
                  <p className="text-sm text-muted-foreground">Target specific content creators rather than broad hashtags or topics.</p>
                </div>

                <div className="space-y-3">
                  <div className="bg-primary/10 w-8 h-8 rounded-full flex items-center justify-center font-semibold">2</div>
                  <h3 className="font-medium">Filter Results Effectively</h3>
                  <p className="text-sm text-muted-foreground">Use engagement rates and view counts to identify truly viral content.</p>
                </div>

                <div className="space-y-3">
                  <div className="bg-primary/10 w-8 h-8 rounded-full flex items-center justify-center font-semibold">3</div>
                  <h3 className="font-medium">Regular Analysis</h3>
                  <p className="text-sm text-muted-foreground">Monitor successful accounts frequently to stay updated with trending content.</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default HelpCenter;