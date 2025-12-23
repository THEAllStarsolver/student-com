import { groq } from '@ai-sdk/groq';
import { streamText } from 'ai';

export const maxDuration = 30;

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return Response.json({ error: 'No prompt provided' }, { status: 400 });
    }

    const result = streamText({
      model: groq('llama-3.3-70b-versatile'),
      system: 'You are a helpful student companion assistant. Be concise, friendly, and practical. Help with careers, skills, exams, study tips, and nearby places.',
      prompt,
      temperature: 0.7,
      maxTokens: 500,
    });

    return result.toTextStreamResponse();
  } catch (error: any) {
    console.error('LLM error:', error);
    return Response.json(
      { error: error.message || 'AI temporarily unavailable' },
      { status: 500 }
    );
  }
}
