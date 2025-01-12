import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, MessageSquare } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { ScriptVariation } from "./ScriptVariation";

const formSchema = z.object({
  prompt: z.string().min(10, "Please enter at least 10 characters for your prompt"),
});

type FormData = z.infer<typeof formSchema>;

interface PromptToScriptFormProps {
  onSubmit: (prompt: string, text: string) => Promise<void>;
  isLoading: boolean;
  generatedScript?: string;
}

export function PromptToScriptForm({ onSubmit, isLoading, generatedScript }: PromptToScriptFormProps) {
  const { toast } = useToast();
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    }
  });

  const handleSubmit = async (data: FormData) => {
    try {
      await onSubmit(data.prompt, "");
      form.reset();
      toast({
        title: "Success",
        description: "Script generated successfully!",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate script"
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="prompt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Prompt</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter your instructions for how to transform the text..." 
                      className="min-h-[100px]"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Generate Script
                </>
              )}
            </Button>
          </form>
        </Form>
      </Card>

      {generatedScript && (
        <ScriptVariation variation={generatedScript} />
      )}
    </div>
  );
}