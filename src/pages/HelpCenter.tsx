import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlayCircle, Book, MessageCircle, Mail } from "lucide-react";

const videoTutorials = [
  {
    title: "Getting Started with VyralSearch",
    description: "Learn the basics of using our platform",
    videoUrl: "https://www.youtube.com/embed/your-video-id",
    duration: "5:30"
  },
  {
    title: "Advanced Search Techniques",
    description: "Master the art of content discovery",
    videoUrl: "https://www.youtube.com/embed/your-video-id",
    duration: "8:45"
  }
];

const guides = [
  {
    title: "Quick Start Guide",
    description: "Get up and running in minutes",
    icon: Book
  },
  {
    title: "Video Tutorials",
    description: "Learn through step-by-step videos",
    icon: PlayCircle
  },
  {
    title: "Community Forum",
    description: "Connect with other users",
    icon: MessageCircle
  }
];

const HelpCenter = () => {
  return (
    <div className="min-h-screen bg-background pt-20 md:pt-24 pb-6 md:pb-8">
      <div className="container max-w-6xl mx-auto px-4 space-y-8">
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Help Center</h1>
          <p className="text-sm text-muted-foreground">
            Find everything you need to get started and make the most of VyralSearch
          </p>
        </div>

        {/* Quick Access Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {guides.map((guide, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <guide.icon className="w-8 h-8 text-primary mb-2" />
                <CardTitle className="text-lg">{guide.title}</CardTitle>
                <CardDescription>{guide.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>

        {/* Video Tutorials Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Video Tutorials</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {videoTutorials.map((tutorial, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="aspect-video bg-muted rounded-lg mb-4">
                    <iframe
                      className="w-full h-full rounded-lg"
                      src={tutorial.videoUrl}
                      title={tutorial.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                  <h3 className="font-medium mb-1">{tutorial.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{tutorial.description}</p>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <PlayCircle className="w-4 h-4" />
                    {tutorial.duration}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Common Questions Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Common Questions</h2>
          <Accordion type="single" collapsible className="w-full space-y-2">
            <AccordionItem value="item-1" className="border rounded-lg px-4">
              <AccordionTrigger className="text-sm font-medium">
                How do I get started with VyralSearch?
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                Getting started is easy! Simply sign up for an account, choose your subscription plan,
                and you can immediately begin searching for viral content.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2" className="border rounded-lg px-4">
              <AccordionTrigger className="text-sm font-medium">
                What features are included in my subscription?
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                Each subscription plan includes different features. Check our pricing page for a detailed
                comparison of what's included in each plan.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Contact Support */}
        <Card className="bg-primary/5 border-primary/10">
          <CardHeader>
            <div className="flex items-center gap-4">
              <Mail className="w-8 h-8 text-primary" />
              <div>
                <CardTitle className="text-lg">Need More Help?</CardTitle>
                <CardDescription>Our support team is here to help you</CardDescription>
              </div>
              <Button className="ml-auto">Contact Support</Button>
            </div>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
};

export default HelpCenter;