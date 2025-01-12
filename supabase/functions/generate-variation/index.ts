import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
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

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { transcriptionId } = await req.json();
    console.log('Generating variation for transcription:', transcriptionId);

    if (!transcriptionId) {
      throw new Error('Transcription ID is required');
    }

    const { data: originalScript, error: fetchError } = await supabaseClient
      .from('scripts')
      .select('original_text')
      .eq('id', transcriptionId)
      .single();

    if (fetchError || !originalScript) {
      throw new Error('Failed to fetch original script');
    }

    console.log('Original script:', originalScript);

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a creative script writer that helps create engaging social media content."
        },
        {
          role: "user",
          content: `Create a new script variation with 3 hook options based on this original script:\n\n${originalScript.original_text}\n\nInclude:\n1. Three different hook options\n2. A complete script example\n3. An explanation of why it works`
        }
      ],
    });

    const variation = completion.choices[0]?.message?.content;
    if (!variation) {
      throw new Error('Failed to generate variation');
    }

    console.log('Generated variation:', variation);

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (userError || !user) {
      throw new Error('User not authenticated');
    }

    const { data: variationScript, error: insertError } = await supabaseClient
      .from('scripts')
      .insert({
        user_id: user.id,
        original_text: originalScript.original_text,
        variation_text: variation,
        script_type: 'variation',
        parent_script_id: transcriptionId
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error storing variation:', insertError);
      throw new Error('Failed to store variation');
    }

    return new Response(JSON.stringify(variationScript), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-variation function:', error);
    return new Response(
      JSON.stringify({ error: error.message }), 
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});