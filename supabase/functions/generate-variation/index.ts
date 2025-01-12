import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
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

    if (fetchError) {
      throw fetchError;
    }

    // Generate variation using GPT-4
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a creative writer that helps create variations of Instagram video scripts. Keep the same message and tone but vary the wording and structure.'
          },
          {
            role: 'user',
            content: `Create a variation of this Instagram video script, maintaining the same message but with different wording: ${originalScript.original_text}`
          }
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to generate variation');
    }

    const data = await response.json();
    const variation = data.choices[0].message.content;
    console.log('Variation generated successfully');

    // Store variation in database
    const { data: variationScript, error: insertError } = await supabaseClient
      .from('scripts')
      .insert({
        user_id: req.auth.uid,
        original_text: variation,
        script_type: 'variation',
        parent_script_id: transcriptionId
      })
      .select()
      .single();

    if (insertError) {
      throw insertError;
    }

    return new Response(
      JSON.stringify({ id: variationScript.id, variation }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in generate-variation function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});