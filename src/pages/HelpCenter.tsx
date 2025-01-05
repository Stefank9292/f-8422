import { BookOpen, AlertCircle, CheckCircle, Play, Mail } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const HelpCenter = () => {
  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data } = await supabase.auth.getSession();
      return data.session;
    },
  });

  const { data: subscriptionStatus } = useQuery({
    queryKey: ['subscription-status'],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('check-subscription', {
        headers: {
          Authorization: `Bearer ${session?.access_token}`
        }
      });
      if (error) throw error;
      return data;
    },
    enabled: !!session?.access_token,
  });

  const showSupport = subscriptionStatus?.subscribed;

  return (
    <div className="min-h-screen p-4 bg-background">
      <div className="max-w-3xl mx-auto space-y-8 pt-8">
        <div className="space-y-4">
          <h1 className="text-2xl font-semibold tracking-tight">Help Center</h1>
          <p className="text-[13px] text-muted-foreground">
            Find guides and tutorials to help you get the most out of VyralSearch
          </p>
        </div>

        <div className="relative rounded-xl overflow-hidden border">
          <AspectRatio ratio={16 / 9}>
            <div className="absolute inset-0 bg-black/20 z-10 flex items-center justify-center group cursor-pointer hover:bg-black/30 transition-colors">
              <div className="h-16 w-16 rounded-full bg-white/25 flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform">
                <Play className="h-8 w-8 text-white fill-white translate-x-0.5" />
              </div>
            </div>
            <img 
              src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b"
              alt="Tutorial Video Placeholder"
              className="object-cover w-full h-full"
            />
          </AspectRatio>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-2">
          <AccordionItem value="getting-started" className="border rounded-lg px-4">
            <AccordionTrigger className="text-[13px] font-medium">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-primary" />
                Getting Started
              </div>
            </AccordionTrigger>
            <AccordionContent className="text-[13px] text-muted-foreground">
              <div className="space-y-4">
                <p className="font-medium text-foreground">Welcome to VyralSearch</p>
                <div className="space-y-2">
                  <p>Get started with our platform in three simple steps:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Enter an Instagram username or profile URL</li>
                    <li>Configure your search settings (optional)</li>
                    <li>Click "Search Viral Videos" to start analyzing</li>
                  </ul>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="known-issues" className="border rounded-lg px-4">
            <AccordionTrigger className="text-[13px] font-medium">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-destructive" />
                Known Issues
              </div>
            </AccordionTrigger>
            <AccordionContent className="text-[13px] text-muted-foreground">
              <div className="space-y-4">
                <p className="font-medium text-foreground">Current Limitations</p>
                <div className="space-y-2">
                  <p>• Private Instagram accounts cannot be searched</p>
                  <p>• Some videos may have limited metadata available</p>
                  <p>• Historical data beyond 90 days may be incomplete</p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="best-practices" className="border rounded-lg px-4">
            <AccordionTrigger className="text-[13px] font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Best Practices
              </div>
            </AccordionTrigger>
            <AccordionContent className="text-[13px] text-muted-foreground">
              <div className="space-y-4">
                <p className="font-medium text-foreground">Tips for Better Results</p>
                <div className="space-y-2">
                  <p>• Use specific usernames rather than broad searches</p>
                  <p>• Filter results by engagement rates for better insights</p>
                  <p>• Regularly monitor successful accounts</p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {showSupport && (
          <div className="border rounded-lg p-6 space-y-4">
            <div className="space-y-2">
              <h2 className="text-lg font-semibold">Need More Help?</h2>
              <p className="text-[13px] text-muted-foreground">
                Our support team is here to help. Get in touch with us directly.
              </p>
            </div>
            <Button 
              variant="default" 
              onClick={() => window.location.href = 'mailto:support@vyralsearch.com'}
              className="w-full sm:w-auto"
            >
              <Mail className="mr-2 h-4 w-4" />
              Contact Support
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HelpCenter;