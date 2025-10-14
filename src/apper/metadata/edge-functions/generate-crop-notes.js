import apper from 'https://cdn.apper.io/actions/apper-actions.js';
import OpenAI from 'npm:openai';

apper.serve(async (req) => {
  try {
    // Only accept POST requests
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({
        success: false,
        message: 'Method not allowed. Use POST.'
      }), {
        status: 405,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Parse request body
    const body = await req.json();
    const { cropName, variety, stage, status } = body;

    // Validate required fields
    if (!cropName || !status) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Missing required fields: cropName and status are required'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Get OpenAI API key from secrets
    const apiKey = await apper.getSecret('OPENAI_API_KEY');
    
    if (!apiKey) {
      return new Response(JSON.stringify({
        success: false,
        message: 'OpenAI API key not configured'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: apiKey
    });

    // Construct prompt for generating crop notes
    const prompt = `Generate concise, practical farming notes for a crop with the following details:
- Crop Name: ${cropName}
${variety ? `- Variety: ${variety}` : ''}
${stage ? `- Growth Stage: ${stage}` : ''}
- Current Status: ${status}

Provide 2-3 actionable recommendations or observations specific to this crop's current status. Focus on:
- What to monitor or watch for
- Recommended actions or care tips
- Timeline expectations or next steps

Keep the response concise (100-150 words) and practical for farmers.`;

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an agricultural expert assistant helping farmers track and manage their crops. Provide practical, concise guidance.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 300
    });

    // Extract generated notes
    const generatedNotes = completion.choices[0]?.message?.content || '';

    if (!generatedNotes) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Failed to generate notes from OpenAI'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Return successful response
    return new Response(JSON.stringify({
      success: true,
      notes: generatedNotes
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    // Handle any errors
    return new Response(JSON.stringify({
      success: false,
      message: error.message || 'An error occurred while generating crop notes'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});