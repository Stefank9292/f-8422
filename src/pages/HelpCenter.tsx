import { BookOpen, AlertTriangle, Lightbulb, Mail, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function HelpCenter() {
  return (
    <div className="responsive-container py-8 md:py-12 animate-in fade-in duration-300">
      <div className="text-center mb-12 space-y-4">
        <h1 className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 bg-clip-text text-transparent">
          Help Center
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Welcome to the central repository for tips, tricks, tutorials, known issues, and best practices
          for VyralSearch usage. Please review the content below carefully before reaching out to
          Support.
        </p>
      </div>

      {/* Video Section */}
      <div className="material-card p-8 md:p-12 mb-12 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center mb-4">
          <div className="w-8 h-8 border-2 border-muted-foreground rounded-full flex items-center justify-center">
            <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-muted-foreground border-b-8 border-b-transparent ml-1"></div>
          </div>
        </div>
        <p className="text-muted-foreground">Tutorial video coming soon</p>
      </div>

      {/* Search Bar */}
      <div className="relative mb-12">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search help articles..."
          className="material-input pl-10 w-full"
        />
      </div>

      {/* Help Categories */}
      <div className="responsive-grid">
        <Card className="material-card p-6 hover:shadow-md transition-shadow cursor-pointer">
          <div className="flex items-center gap-4">
            <div className="bg-secondary p-3 rounded-lg">
              <BookOpen className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-semibold">Getting Started</h2>
          </div>
        </Card>

        <Card className="material-card p-6 hover:shadow-md transition-shadow cursor-pointer">
          <div className="flex items-center gap-4">
            <div className="bg-secondary p-3 rounded-lg">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-semibold">Known Issues</h2>
          </div>
        </Card>

        <Card className="material-card p-6 hover:shadow-md transition-shadow cursor-pointer">
          <div className="flex items-center gap-4">
            <div className="bg-secondary p-3 rounded-lg">
              <Lightbulb className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-semibold">Best Practices</h2>
          </div>
        </Card>
      </div>

      {/* Contact Support Section */}
      <div className="mt-12 rounded-lg overflow-hidden">
        <div 
          className="p-8 md:p-12 text-center text-white"
          style={{
            background: "linear-gradient(90deg, #9333EA 0%, #E11D48 50%, #F97316 100%)"
          }}
        >
          <Mail className="w-12 h-12 mx-auto mb-4" />
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Need More Help?</h2>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Can't find what you're looking for? Our support team is here to help.
          </p>
          <Button 
            variant="secondary" 
            size="lg"
            className="bg-white text-primary hover:bg-white/90"
          >
            Contact Support
          </Button>
        </div>
      </div>
    </div>
  );
};