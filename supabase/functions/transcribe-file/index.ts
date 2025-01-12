import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const formData = await req.formData()
    const file = formData.get('file')

    if (!file) {
      throw new Error('No file uploaded')
    }

    // Check file size (25MB limit)
    const MAX_SIZE = 25 * 1024 * 1024 // 25MB in bytes
    if (file.size > MAX_SIZE) {
      throw new Error('File size exceeds 25MB limit')
    }

    // Prepare form data for Whisper API
    const whisperFormData = new FormData()
    whisperFormData.append('file', file)
    whisperFormData.append('model', 'whisper-1')

    // Send to Whisper API
    console.log('Sending to Whisper API...')
    const whisperResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
      },
      body: whisperFormData,
    })

    if (!whisperResponse.ok) {
      const error = await whisperResponse.text()
      throw new Error(`Whisper API error: ${error}`)
    }

    const transcription = await whisperResponse.json()
    console.log('Transcription complete')

    return new Response(
      JSON.stringify({ 
        text: transcription.text,
        status: 'success'
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )

  } catch (error) {
    console.error('Error in transcribe-file function:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        status: 'error'
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )
  }
})