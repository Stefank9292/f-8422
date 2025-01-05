import { BookOpen, AlertCircle, CheckCircle, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const HelpCenter = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-[1200px] py-12">
        {/* Header */}
        <div className="space-y-4 text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">Help Center</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Welcome to the central repository for tips, tricks, tutorials, known issues, and best practices
            for VyralSearch usage. Please review the content below carefully before reaching out to
            Support.
          </p>
        </div>

        {/* Video Placeholder */}
        <div className="bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-background/60 rounded-lg p-16 mb-8 flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-muted/20 flex items-center justify-center mb-4">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
              <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-muted-foreground border-b-8 border-b-transparent ml-1" />
            </div>
          </div>
          <p className="text-muted-foreground">Tutorial video coming soon</p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search help articles..."
            className="w-full pl-10 bg-background"
          />
        </div>

        {/* Help Sections */}
        <div className="space-y-4">
          {/* Getting Started */}
          <Card className="hover:bg-accent/5 transition-colors cursor-pointer">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-2 rounded-lg bg-primary/5">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Getting Started</h2>
              </div>
            </CardContent>
          </Card>

          {/* Known Issues */}
          <Card className="hover:bg-accent/5 transition-colors cursor-pointer">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-2 rounded-lg bg-destructive/5">
                <AlertCircle className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Known Issues</h2>
              </div>
            </CardContent>
          </Card>

          {/* Best Practices */}
          <Card className="hover:bg-accent/5 transition-colors cursor-pointer">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-2 rounded-lg bg-green-500/5">
                <CheckCircle className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Best Practices</h2>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;