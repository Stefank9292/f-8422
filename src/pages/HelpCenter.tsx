import { BookOpen, AlertCircle, CheckCircle, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const HelpCenter = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="responsive-container py-12 touch-spacing">
        {/* Header */}
        <div className="space-y-4 text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight">Help Center</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Get help with VyralSearch and learn how to make the most of our features
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Getting Started Section */}
          <Card className="material-card card-hover border-none bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <CardContent className="p-8 space-y-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-primary/10">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Getting Started</h2>
                  <p className="text-muted-foreground">Welcome to VyralSearch</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <p className="font-medium text-foreground/90">Get started with our platform in three simple steps:</p>
                <ol className="space-y-4">
                  <li className="flex items-center gap-3 text-muted-foreground">
                    <ArrowRight className="h-5 w-5 text-primary shrink-0" />
                    <span>Enter an Instagram username or profile URL</span>
                  </li>
                  <li className="flex items-center gap-3 text-muted-foreground">
                    <ArrowRight className="h-5 w-5 text-primary shrink-0" />
                    <span>Configure your search settings (optional)</span>
                  </li>
                  <li className="flex items-center gap-3 text-muted-foreground">
                    <ArrowRight className="h-5 w-5 text-primary shrink-0" />
                    <span>Click "Search Viral Videos" to start analyzing</span>
                  </li>
                </ol>
              </div>
            </CardContent>
          </Card>

          {/* Known Issues Section */}
          <Card className="material-card card-hover border-none bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <CardContent className="p-8 space-y-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-yellow-500/10">
                  <AlertCircle className="h-6 w-6 text-yellow-500" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Known Issues</h2>
                  <p className="text-muted-foreground">Current limitations</p>
                </div>
              </div>

              <div className="rounded-xl bg-muted p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <h3 className="font-medium text-foreground/90">Current Limitations</h3>
                </div>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3 text-muted-foreground">
                    <span className="select-none text-primary">•</span>
                    <span>Private Instagram accounts cannot be searched</span>
                  </li>
                  <li className="flex items-start gap-3 text-muted-foreground">
                    <span className="select-none text-primary">•</span>
                    <span>Some videos may have limited metadata available</span>
                  </li>
                  <li className="flex items-start gap-3 text-muted-foreground">
                    <span className="select-none text-primary">•</span>
                    <span>Historical data beyond 90 days may be incomplete</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Best Practices Section */}
          <Card className="material-card card-hover border-none bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:col-span-2 lg:col-span-1">
            <CardContent className="p-8 space-y-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-green-500/10">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Best Practices</h2>
                  <p className="text-muted-foreground">Optimize your searches</p>
                </div>
              </div>
              
              <div className="grid gap-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 w-10 h-10 rounded-xl flex items-center justify-center">
                      <span className="font-semibold text-primary">1</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground/90">Use Specific Searches</h3>
                      <p className="text-muted-foreground">
                        Target specific content creators rather than broad hashtags or topics.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 w-10 h-10 rounded-xl flex items-center justify-center">
                      <span className="font-semibold text-primary">2</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground/90">Filter Results Effectively</h3>
                      <p className="text-muted-foreground">
                        Use engagement rates and view counts to identify truly viral content.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 w-10 h-10 rounded-xl flex items-center justify-center">
                      <span className="font-semibold text-primary">3</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground/90">Regular Analysis</h3>
                      <p className="text-muted-foreground">
                        Monitor successful accounts frequently to stay updated with trending content.
                      </p>
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