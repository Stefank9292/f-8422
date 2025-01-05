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
              Do you need access to my Account?
            </AccordionTrigger>
            <AccordionContent className="text-[11px] text-muted-foreground">
              No, all features are available without the need of logging in your Instagram account.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-2" className="border rounded-lg px-4">
            <AccordionTrigger className="text-[13px] font-medium">
              What is your cancellation policy?
            </AccordionTrigger>
            <AccordionContent className="text-[11px] text-muted-foreground">
              Our goal is to make you happy. You can cancel at any time and won't be billed for subsequent months. No hard feelings.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-3" className="border rounded-lg px-4">
            <AccordionTrigger className="text-[13px] font-medium">
              What are my payment options?
            </AccordionTrigger>
            <AccordionContent className="text-[11px] text-muted-foreground">
              We accept all major credit cards.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4" className="border rounded-lg px-4">
            <AccordionTrigger className="text-[13px] font-medium">
              What currency are your prices in?
            </AccordionTrigger>
            <AccordionContent className="text-[11px] text-muted-foreground">
              Our prices are in USD.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-5" className="border rounded-lg px-4">
            <AccordionTrigger className="text-[13px] font-medium">
              Can I change my plan?
            </AccordionTrigger>
            <AccordionContent className="text-[11px] text-muted-foreground">
              You can change your plan at any time!
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-6" className="border rounded-lg px-4">
            <AccordionTrigger className="text-[13px] font-medium">
              Do you have a referral plan?
            </AccordionTrigger>
            <AccordionContent className="text-[11px] text-muted-foreground">
              We currently do not have a referral program, but plan to add one in the near future.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-7" className="border rounded-lg px-4">
            <AccordionTrigger className="text-[13px] font-medium">
              Can I use VyralSearch on my phone?
            </AccordionTrigger>
            <AccordionContent className="text-[11px] text-muted-foreground">
              Yes! Our platform supports all common devices with a web browser.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-8" className="border rounded-lg px-4">
            <AccordionTrigger className="text-[13px] font-medium">
              My search came up with no results. What happened?
            </AccordionTrigger>
            <AccordionContent className="text-[11px] text-muted-foreground">
              Although our software is incredibly awesome, it has its limits. We aren't able to search private accounts, so please make sure you are only searching public profiles.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-9" className="border rounded-lg px-4">
            <AccordionTrigger className="text-[13px] font-medium">
              Do I need to give credit to the owner of content I'm reposting?
            </AccordionTrigger>
            <AccordionContent className="text-[11px] text-muted-foreground">
              Some accounts get away with doing this. We highly advise against it. Our platform will provide you with all the users tagged in the content. Sometimes there will be multiple users on that list. You can feel free to only tag the original poster in those cases.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default FAQ;