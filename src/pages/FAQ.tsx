import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const FAQ = () => {
  return (
    <div className="min-h-screen p-4 bg-background">
      <div className="max-w-3xl mx-auto space-y-8 pt-8">
        <div className="space-y-4">
          <h1 className="text-2xl font-semibold tracking-tight">Frequently Asked Questions</h1>
          <p className="text-[13px] text-muted-foreground">
            Find answers to common questions about our service
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-2">
          <AccordionItem value="item-1" className="border rounded-lg px-4">
            <AccordionTrigger className="text-[13px] font-medium">
              What is VyralSearch?
            </AccordionTrigger>
            <AccordionContent className="text-[11px] text-muted-foreground">
              VyralSearch is a powerful tool that helps you find and analyze viral content across social media platforms.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-2" className="border rounded-lg px-4">
            <AccordionTrigger className="text-[13px] font-medium">
              How does the search limit work?
            </AccordionTrigger>
            <AccordionContent className="text-[11px] text-muted-foreground">
              Search limits vary by plan. Free users get 3 searches, Pro users get 25 searches, and Ultra users get unlimited searches per period.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-3" className="border rounded-lg px-4">
            <AccordionTrigger className="text-[13px] font-medium">
              Can I upgrade my plan anytime?
            </AccordionTrigger>
            <AccordionContent className="text-[11px] text-muted-foreground">
              Yes, you can upgrade your plan at any time. The new limits will take effect immediately after upgrading.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default FAQ;