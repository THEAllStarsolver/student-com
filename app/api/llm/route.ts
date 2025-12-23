import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();
    const apiKey = process.env.LLM_API_KEY?.trim();

    if (!apiKey) {
      return NextResponse.json({ response: 'LLM API key not configured. Add LLM_API_KEY to .env.local' });
    }

    // Using Google Gemini API
    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro-latest:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `You are a helpful student companion assistant. Be concise and friendly.\n\nUser: ${prompt}`
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 500,
        }
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Gemini API error:', error);
      return NextResponse.json({ response: `Error: ${response.status} - ${error}. Please check your API key.` });
    }

    const data = await response.json();
    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated';
    return NextResponse.json({ response: responseText });
  } catch (error: any) {
    console.error('LLM error:', error);
    return NextResponse.json({ response: `AI temporarily unavailable. Error: ${error.message}` });
  }
}
