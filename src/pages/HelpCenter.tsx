import { Card } from "@/components/ui/card";
import { Mail, MessageCircle, FileText, Video } from "lucide-react";
import { Link } from "react-router-dom";

const HelpCenter = () => {
  return (
    <div className="min-h-screen bg-background md:pt-12 pt-24 pb-8 md:pb-12">
      <div className="container max-w-4xl mx-auto px-4 md:px-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Help Center
          </h1>
          <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
            Get help with your account, searches, and more
          </p>
        </div>
        <div className="grid gap-6 mt-8 md:mt-12 md:grid-cols-2">
          <Link to="/faq">
            <Card className="p-6 hover:bg-accent/50 transition-colors">
              <FileText className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">FAQ</h3>
              <p className="text-muted-foreground">
                Find answers to frequently asked questions about our services
              </p>
            </Card>
          </Link>
          <a href="mailto:support@example.com">
            <Card className="p-6 hover:bg-accent/50 transition-colors">
              <Mail className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Email Support</h3>
              <p className="text-muted-foreground">
                Get in touch with our support team via email
              </p>
            </Card>
          </a>
          <Card className="p-6 hover:bg-accent/50 transition-colors">
            <MessageCircle className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Live Chat</h3>
            <p className="text-muted-foreground">
              Chat with our support team in real-time (coming soon)
            </p>
          </Card>
          <Card className="p-6 hover:bg-accent/50 transition-colors">
            <Video className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Video Tutorials</h3>
            <p className="text-muted-foreground">
              Watch tutorials on how to use our features (coming soon)
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;