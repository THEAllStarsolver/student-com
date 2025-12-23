import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();
    const apiKey = process.env.GROQ_API_KEY?.trim();

    if (!apiKey) {
      return NextResponse.json({ response: 'Groq API key not configured. Add GROQ_API_KEY to .env.local' });
    }

    // Using Groq API with OpenAI-compatible interface
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'mixtral-8x7b-32768',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful student companion assistant. Be concise, friendly, and practical. Help with careers, skills, exams, study tips, and nearby places.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Groq API error:', response.status, errorText);
      
      // Handle rate limit (429)
      if (response.status === 429) {
        return NextResponse.json({ 
          response: 'API rate limit exceeded. Please try again in a moment.' 
        });
      }
      
      // Handle authentication errors (401)
      if (response.status === 401) {
        return NextResponse.json({ 
          response: 'API authentication failed. Please check your GROQ_API_KEY in .env.local' 
        });
      }
      
      return NextResponse.json({ 
        response: `Service temporarily unavailable. Please try again in a moment.` 
      });
    }

    const data = await response.json();
    const responseText = data.choices?.[0]?.message?.content || 'No response generated';
    return NextResponse.json({ response: responseText });
  } catch (error: any) {
    console.error('LLM error:', error);
    return NextResponse.json({ response: `AI temporarily unavailable. Error: ${error.message}` });
  }
}
