import { BookOpen, AlertCircle, CheckCircle, ArrowRight, Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const HelpCenter = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="responsive-container py-12 touch-spacing">
        {/* Header */}
        <div className="space-y-3 text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight">Help Center</h1>
          <p className="text-muted-foreground text-lg">
            Get help with VyralSearch and learn how to make the most of our features
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Getting Started Section */}
          <Card className="material-card card-hover">
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-primary/10">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Getting Started</h2>
                  <p className="text-muted-foreground">Welcome to VyralSearch</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <p className="font-medium">Get started with our platform in three simple steps:</p>
                <ol className="space-y-3">
                  <li className="flex items-center gap-2.5 text-muted-foreground">
                    <ArrowRight className="h-4 w-4 text-primary shrink-0" />
                    Enter an Instagram username or profile URL
                  </li>
                  <li className="flex items-center gap-2.5 text-muted-foreground">
                    <ArrowRight className="h-4 w-4 text-primary shrink-0" />
                    Configure your search settings (optional)
                  </li>
                  <li className="flex items-center gap-2.5 text-muted-foreground">
                    <ArrowRight className="h-4 w-4 text-primary shrink-0" />
                    Click "Search Viral Videos" to start analyzing
                  </li>
                </ol>
              </div>
            </CardContent>
          </Card>

          {/* Known Issues Section */}
          <Card className="material-card card-hover">
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-yellow-500/10">
                  <AlertCircle className="h-6 w-6 text-yellow-500" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Known Issues</h2>
                  <p className="text-muted-foreground">Current limitations</p>
                </div>
              </div>

              <div className="rounded-xl bg-muted/50 p-5 space-y-4">
                <div className="flex items-center gap-2 text-foreground/90">
                  <Info className="h-4 w-4 text-muted-foreground" />
                  <h3 className="font-medium">Current Limitations</h3>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2 text-muted-foreground">
                    <span className="select-none">•</span>
                    Private Instagram accounts cannot be searched
                  </li>
                  <li className="flex items-start gap-2 text-muted-foreground">
                    <span className="select-none">•</span>
                    Some videos may have limited metadata available
                  </li>
                  <li className="flex items-start gap-2 text-muted-foreground">
                    <span className="select-none">•</span>
                    Historical data beyond 90 days may be incomplete
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Best Practices Section */}
          <Card className="material-card card-hover md:col-span-2 lg:col-span-1">
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-green-500/10">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Best Practices</h2>
                  <p className="text-muted-foreground">Optimize your searches</p>
                </div>
              </div>
              
              <div className="grid gap-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 w-8 h-8 rounded-full flex items-center justify-center">
                      <span className="font-semibold text-primary">1</span>
                    </div>
                    <h3 className="font-medium">Use Specific Searches</h3>
                  </div>
                  <p className="text-muted-foreground">
                    Target specific content creators rather than broad hashtags or topics.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 w-8 h-8 rounded-full flex items-center justify-center">
                      <span className="font-semibold text-primary">2</span>
                    </div>
                    <h3 className="font-medium">Filter Results Effectively</h3>
                  </div>
                  <p className="text-muted-foreground">
                    Use engagement rates and view counts to identify truly viral content.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 w-8 h-8 rounded-full flex items-center justify-center">
                      <span className="font-semibold text-primary">3</span>
                    </div>
                    <h3 className="font-medium">Regular Analysis</h3>
                  </div>
                  <p className="text-muted-foreground">
                    Monitor successful accounts frequently to stay updated with trending content.
                  </p>
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