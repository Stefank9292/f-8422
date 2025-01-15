import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlayCircle, Book, MessageCircle, Mail, ExternalLink } from "lucide-react";

const videoTutorials = [
  {
    title: "Getting Started with VyralSearch",
    description: "Learn the basics of using our platform and discover viral content",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    duration: "5:30"
  },
  {
    title: "Advanced Search Techniques",
    description: "Master the art of content discovery and trend analysis",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    duration: "8:45"
  },
  {
    title: "Using Bulk Search",
    description: "Learn how to efficiently search multiple accounts at once",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    duration: "6:15"
  }
];

const guides = [
  {
    title: "Quick Start Guide",
    description: "Get up and running in minutes with our platform",
    icon: Book,
    link: "/docs/quickstart"
  },
  {
    title: "Video Tutorials",
    description: "Learn through our comprehensive video guides",
    icon: PlayCircle,
    link: "#video-tutorials"
  },
  {
    title: "Community Forum",
    description: "Connect with other users and share insights",
    icon: MessageCircle,
    link: "https://community.vyralsearch.com"
  }
];

const HelpCenter = () => {
  return (
    <div className="min-h-screen bg-background pt-20 md:pt-24 pb-12">
      <div className="container max-w-6xl mx-auto px-4 space-y-12">
        {/* Header Section */}
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Help Center</h1>
          <p className="text-muted-foreground text-lg">
            Find everything you need to get started and make the most of VyralSearch
          </p>
        </div>

        {/* Quick Access Guide Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {guides.map((guide, index) => (
            <Card 
              key={index} 
              className="hover:shadow-lg transition-shadow duration-200 cursor-pointer group"
              onClick={() => window.location.href = guide.link}
            >
              <CardHeader className="space-y-3">
                <div className="flex items-center justify-between">
                  <guide.icon className="w-8 h-8 text-primary" />
                  {guide.link.startsWith('http') && (
                    <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </div>
                <div>
                  <CardTitle className="text-xl">{guide.title}</CardTitle>
                  <CardDescription className="text-sm mt-1">{guide.description}</CardDescription>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>

        {/* Video Tutorials Section */}
        <div id="video-tutorials" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold tracking-tight">Video Tutorials</h2>
            <Button variant="outline" className="hidden md:flex items-center gap-2">
              <PlayCircle className="w-4 h-4" />
              View All
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videoTutorials.map((tutorial, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="aspect-video bg-muted">
                  <iframe
                    className="w-full h-full"
                    src={tutorial.videoUrl}
                    title={tutorial.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <CardContent className="p-4 space-y-2">
                  <h3 className="font-semibold text-lg leading-tight">{tutorial.title}</h3>
                  <p className="text-sm text-muted-foreground">{tutorial.description}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <PlayCircle className="w-4 h-4" />
                    {tutorial.duration}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <Button variant="outline" className="w-full md:hidden">
            <PlayCircle className="w-4 h-4 mr-2" />
            View All Tutorials
          </Button>
        </div>

        {/* Common Questions Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold tracking-tight">Common Questions</h2>
          <Accordion type="single" collapsible className="w-full space-y-4">
            <AccordionItem value="item-1" className="border rounded-lg px-4">
              <AccordionTrigger className="text-base font-medium">
                How do I get started with VyralSearch?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Getting started is easy! Simply sign up for an account, choose your subscription plan,
                and you can immediately begin searching for viral content. Our Quick Start Guide
                will walk you through the basics.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2" className="border rounded-lg px-4">
              <AccordionTrigger className="text-base font-medium">
                What features are included in my subscription?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Each subscription plan includes different features. Check our pricing page for a detailed
                comparison of what's included in each plan. You can upgrade or downgrade your plan
                at any time.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3" className="border rounded-lg px-4">
              <AccordionTrigger className="text-base font-medium">
                How does bulk search work?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Bulk search allows you to search multiple accounts simultaneously. Simply paste your
                list of accounts or URLs, set your filters, and let VyralSearch do the work. Watch
                our video tutorial on bulk search for a detailed walkthrough.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Contact Support Section */}
        <Card className="bg-primary/5 border-primary/10">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6 justify-between">
              <div className="flex items-start gap-4">
                <Mail className="w-8 h-8 text-primary mt-1" />
                <div className="space-y-1">
                  <CardTitle className="text-xl">Need More Help?</CardTitle>
                  <CardDescription>
                    Our support team is here to help you succeed
                  </CardDescription>
                </div>
              </div>
              <div className="flex gap-4 w-full md:w-auto">
                <Button className="flex-1 md:flex-none">
                  Contact Support
                </Button>
                <Button variant="outline" className="flex-1 md:flex-none">
                  View Documentation
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HelpCenter;