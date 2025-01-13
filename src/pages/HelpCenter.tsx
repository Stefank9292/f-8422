import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const faqItems = [
  {
    category: "general",
    question: "Do you need access to my Account?",
    answer: "No, all features are available without the need of logging in your Instagram account."
  },
  {
    category: "billing",
    question: "What is your cancellation policy?",
    answer: "Our goal is to make you happy. You can cancel at any time and won't be billed for subsequent months. No hard feelings."
  },
  {
    category: "billing",
    question: "What are my payment options?",
    answer: "We accept all major credit cards."
  },
  {
    category: "billing",
    question: "What currency are your prices in?",
    answer: "Our prices are in USD."
  },
  {
    category: "billing",
    question: "Can I change my plan?",
    answer: "You can change your plan at any time!"
  },
  {
    category: "features",
    question: "Do you have a referral plan?",
    answer: "We currently do not have a referral program, but plan to add one in the near future."
  },
  {
    category: "technical",
    question: "Can I use VyralSearch on my phone?",
    answer: "Yes! Our platform supports all common devices with a web browser."
  },
  {
    category: "technical",
    question: "My search came up with no results. What happened?",
    answer: "Although our software is incredibly awesome, it has its limits. We aren't able to search private accounts, so please make sure you are only searching public profiles."
  },
  {
    category: "features",
    question: "Do I need to give credit to the owner of content I'm reposting?",
    answer: "Some accounts get away with doing this. We highly advise against it. Our platform will provide you with all the users tagged in the content. Sometimes there will be multiple users on that list. You can feel free to only tag the original poster in those cases."
  }
];

const HelpCenter = () => {
  return (
    <div className="min-h-screen bg-background pt-20 md:pt-6 pb-6 md:pb-8">
      <div className="container max-w-4xl mx-auto px-4 space-y-6 md:space-y-8">
        <div className="space-y-2">
          <h1 className="text-xl md:text-2xl font-semibold tracking-tight">Help Center</h1>
          <p className="text-sm text-muted-foreground">
            Get help with using our platform
          </p>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="w-full flex flex-wrap justify-start gap-2 bg-transparent h-auto p-0 mb-6 md:mb-8">
            <TabsTrigger 
              value="all" 
              className="rounded-full px-4 py-2 text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              All Questions
            </TabsTrigger>
            {["general", "billing", "features", "technical"].map((category) => (
              <TabsTrigger
                key={category}
                value={category}
                className="rounded-full px-4 py-2 text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground capitalize"
              >
                {category}
              </TabsTrigger>
            ))}
          </TabsList>

          {["all", "general", "billing", "features", "technical"].map((tab) => (
            <TabsContent key={tab} value={tab} className="mt-0">
              <Accordion type="single" collapsible className="w-full space-y-2">
                {faqItems
                  .filter((item) => tab === "all" || item.category === tab)
                  .map((item, index) => (
                    <AccordionItem 
                      key={index} 
                      value={`item-${index}`} 
                      className="border rounded-lg px-4"
                    >
                      <AccordionTrigger className="text-sm font-medium text-left">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-sm text-muted-foreground text-left">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
              </Accordion>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default HelpCenter;
