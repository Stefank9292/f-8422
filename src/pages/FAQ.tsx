import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const FAQ = () => {
  return (
    <div className="min-h-screen bg-background md:pt-12 pt-24 pb-8 md:pb-12">
      <div className="container max-w-4xl mx-auto px-4 md:px-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Frequently Asked Questions
          </h1>
          <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
            Find answers to common questions about our services
          </p>
        </div>
        <div className="mx-auto mt-8 md:mt-12">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>How does the search feature work?</AccordionTrigger>
              <AccordionContent>
                Our search feature allows you to find Instagram videos by username. Simply enter the username and we'll fetch their recent videos, which you can then filter and sort based on various metrics.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>What are the subscription tiers?</AccordionTrigger>
              <AccordionContent>
                We offer different subscription tiers with varying features and search limits. Check our pricing page for detailed information about each tier's benefits and limitations.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>How often is the data updated?</AccordionTrigger>
              <AccordionContent>
                The data is fetched in real-time when you perform a search. Search history is stored for 7 days, allowing you to review past searches within that timeframe.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>Can I export the search results?</AccordionTrigger>
              <AccordionContent>
                Yes, premium subscribers can export search results to CSV format, making it easy to analyze the data in spreadsheet software or integrate it into other tools.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
};

export default FAQ;