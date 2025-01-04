import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const categories = [
    { id: "all", label: "All Questions" },
    { id: "general", label: "General" },
    { id: "billing", label: "Billing" },
    { id: "features", label: "Features" },
    { id: "technical", label: "Technical" },
  ];

  const faqs = [
    {
      question: "Do you need access to my Account?",
      answer: "No, we don't need direct access to your account. Our platform is designed to work independently while providing you full control over your data and settings.",
      category: "general",
    },
    {
      question: "What is your cancellation policy?",
      answer: "You can cancel your subscription at any time. Once cancelled, you'll continue to have access to your account until the end of your current billing period. We don't offer refunds for partial months.",
      category: "billing",
    },
    {
      question: "What are my payment options?",
      answer: "We accept all major credit cards (Visa, MasterCard, American Express) and PayPal. All payments are processed securely through our payment provider.",
      category: "billing",
    },
    {
      question: "What currency are your prices in?",
      answer: "All our prices are listed in USD (United States Dollars). The charges will be converted to your local currency by your bank at their current exchange rate.",
      category: "billing",
    },
    {
      question: "Can I change my plan?",
      answer: "Yes, you can upgrade or downgrade your plan at any time. Changes to your subscription will take effect immediately, with any price differences prorated for the remainder of your billing period.",
      category: "billing",
    },
    {
      question: "Do you have a referral plan?",
      answer: "Yes! You can earn credits by referring new users to VyralSearch. Each successful referral earns you and your referred friend a bonus. Check your account dashboard for your unique referral link.",
      category: "general",
    },
  ];

  const filteredFaqs = faqs.filter(
    (faq) =>
      (activeCategory === "all" || faq.category === activeCategory) &&
      (searchQuery === "" ||
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen p-4 md:p-6 animate-in fade-in duration-300">
      <div className="responsive-container space-y-8 pt-8">
        <div className="text-center space-y-4">
          <h1 className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 bg-clip-text text-transparent">
            Frequently Asked Questions
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground">
            Find answers to common questions about VyralSearch
          </p>
        </div>

        <div className="touch-spacing">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="material-input pl-10 w-full"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          <div className="flex flex-wrap gap-2 py-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === category.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted hover:bg-muted/80"
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>

          <Accordion type="single" collapsible className="w-full space-y-2">
            {filteredFaqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="material-card border-none px-4"
              >
                <AccordionTrigger className="text-left hover:no-underline py-4">
                  <span className="text-base md:text-lg font-medium">
                    {faq.question}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
};

export default FAQ;