import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import OpenAI from "https://esm.sh/openai@4.28.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const openai = new OpenAI({
      apiKey: Deno.env.get('OPENAI_API_KEY'),
    });

    const { text } = await req.json();
    console.log('Generating script for text:', text);

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a creative script writer that helps create engaging social media content."
        },
        {
          role: "user",
          content: `${text}\n\nTake this Transcription and create me a new script with 3 Hooks, a Video script, a caption for this new script, a CTA and an explanation why this script can work. Here is a provided Output structure where to put what. Please use just text without any bold or else. Dont explain to me why you did what, just generate the pieces and give me the output in provided structure:\n\nHooks\n\n1. [First Hook]\n\n2. [Second Hook]\n\n3. [Third Hook]\n\nVideo Script:\n\n[Video script here]\n\nCaption\n\n[Caption Text]\n\nCTA\n\n[CTA Text]\n\nExplanation of Script\n\n[Explanation Text]`
        }
      ],
    });

    const scriptText = completion.choices[0]?.message?.content;
    if (!scriptText) {
      throw new Error('Failed to generate script');
    }

    console.log('Generated script:', scriptText);

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          persistSession: false,
        }
      }
    );

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (userError || !user) {
      throw new Error('User not authenticated');
    }

    return new Response(
      JSON.stringify({ text: scriptText }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );

  } catch (error) {
    console.error('Error in generate-script function:', error);
    return new Response(
      JSON.stringify({ error: error.message }), 
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  }
});