import { BookOpen, AlertCircle, CheckCircle, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const HelpCenter = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-[1200px] py-12">
        {/* Header */}
        <div className="space-y-4 text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">Help Center</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Welcome to the central repository for tips, tricks, tutorials, and best practices
            for VyralSearch usage.
          </p>
        </div>

        {/* Video Placeholder */}
        <div className="bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-background/60 rounded-lg p-16 mb-12 flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-muted/20 flex items-center justify-center mb-4">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
              <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-muted-foreground border-b-8 border-b-transparent ml-1" />
            </div>
          </div>
          <p className="text-muted-foreground">Tutorial video coming soon</p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-12">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search help articles..."
            className="w-full pl-10 bg-background"
          />
        </div>

        {/* Help Sections */}
        <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-3">
          {/* Getting Started */}
          <Card className="hover:bg-accent/5 transition-colors">
            <CardContent className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 rounded-lg bg-primary/10">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-xl font-semibold">Getting Started</h2>
              </div>
              <div className="space-y-4 text-muted-foreground">
                <p className="font-medium text-foreground">Welcome to VyralSearch</p>
                <p>Get started with our platform in three simple steps:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Enter an Instagram username or profile URL</li>
                  <li>Configure your search settings (optional)</li>
                  <li>Click "Search Viral Videos" to start analyzing</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Known Issues */}
          <Card className="hover:bg-accent/5 transition-colors">
            <CardContent className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 rounded-lg bg-destructive/10">
                  <AlertCircle className="h-6 w-6 text-destructive" />
                </div>
                <h2 className="text-xl font-semibold">Known Issues</h2>
              </div>
              <div className="space-y-4">
                <p className="font-medium text-foreground">Current Limitations</p>
                <div className="bg-muted/30 rounded-lg p-4 space-y-2">
                  <p className="text-muted-foreground">• Private Instagram accounts cannot be searched</p>
                  <p className="text-muted-foreground">• Some videos may have limited metadata available</p>
                  <p className="text-muted-foreground">• Historical data beyond 90 days may be incomplete</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Best Practices */}
          <Card className="hover:bg-accent/5 transition-colors">
            <CardContent className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 rounded-lg bg-green-500/10">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                </div>
                <h2 className="text-xl font-semibold">Best Practices</h2>
              </div>
              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-start gap-4">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-green-500/10 text-green-500 font-semibold">1</span>
                    <div>
                      <p className="font-medium text-foreground">Use Specific Searches</p>
                      <p className="text-muted-foreground">Target specific content creators rather than broad hashtags or topics.</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-4">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-green-500/10 text-green-500 font-semibold">2</span>
                    <div>
                      <p className="font-medium text-foreground">Filter Results Effectively</p>
                      <p className="text-muted-foreground">Use engagement rates and view counts to identify truly viral content.</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-4">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-green-500/10 text-green-500 font-semibold">3</span>
                    <div>
                      <p className="font-medium text-foreground">Regular Analysis</p>
                      <p className="text-muted-foreground">Monitor successful accounts frequently to stay updated with trending content.</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;