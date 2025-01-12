import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { Configuration, OpenAIApi } from 'https://esm.sh/openai@3.1.0';

serve(async (req) => {
  // Enable CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      }
    });
  }

  try {
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get the user from the request
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

    const { transcriptionId } = await req.json();
    console.log('Generating variation for transcription:', transcriptionId);

    if (!transcriptionId) {
      throw new Error('Transcription ID is required');
    }

    // Get original transcription
    const { data: originalScript, error: fetchError } = await supabaseClient
      .from('scripts')
      .select('original_text')
      .eq('id', transcriptionId)
      .single();

    if (fetchError || !originalScript) {
      throw new Error('Failed to fetch original script');
    }

    // Initialize OpenAI
    const configuration = new Configuration({
      apiKey: Deno.env.get('OPENAI_API_KEY'),
    });
    const openai = new OpenAIApi(configuration);

    // Generate variation using OpenAI
    const completion = await openai.createChatCompletion({
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

    const variation = completion.data.choices[0]?.message?.content;
    if (!variation) {
      throw new Error('Failed to generate variation');
    }

    // Store the variation
    const { data: variationScript, error: insertError } = await supabaseClient
      .from('scripts')
      .insert({
        user_id: user.id,
        original_text: variation,
        script_type: 'variation',
        parent_script_id: transcriptionId
      })
      .select()
      .single();

    if (insertError) {
      throw new Error('Failed to store variation');
    }

    return new Response(JSON.stringify(variationScript), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });

  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
});