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
          content: `Create a 30-second social media video script that feels like you're talking to a friend. The first sentence should spark curiosity, address self-interest, or provide new information. Use short, punchy sentences (10 words or less). Include as many imagery words (like tree, car, house) as possible. Connect ideas with linking words (like and, but, because). The script must follow this structure:

Problem: Introduce an issue that the audience can relate to.
Agitation: Dig deeper into the subconscious problem behind the issue.
Solution: Offer a clear, easy solution to the problem.
Call to Action (CTA): Encourage the audience to act or learn more.

The tone should be friendly and human, as if you're chatting with a close friend. Avoid sounding like a sales pitch. Make it feel personal, warm, and relatable.

Here is the content to transform:

${text}

Please provide the output in this structure:

Hooks

1. [First Hook]

2. [Second Hook]

3. [Third Hook]

Video Script:

[Video script here]

Caption

[Caption Text]

CTA

[CTA Text]

Explanation of Script

[Explanation Text]`
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