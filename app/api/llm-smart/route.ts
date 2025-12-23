import { groq } from '@ai-sdk/groq';
import { streamText, tool } from 'ai';
import { z } from 'zod';
import { searchFlights } from '@/lib/flights';
import { searchYouTube } from '@/lib/youtube';

export const maxDuration = 30;

const tools = {
  searchFlights: tool({
    description: 'Search for flights between two cities on a specific date',
    parameters: z.object({
      from: z.string().describe('Departure city name or code (e.g., lko, delhi, bombay)'),
      to: z.string().describe('Arrival city name or code (e.g., bombay, bangalore, delhi)'),
      date: z.string().describe('Flight date in YYYY-MM-DD format or relative date like "tomorrow", "today"'),
    }),
    execute: async ({ from, to, date }) => {
      try {
        // Convert relative dates to actual dates
        let actualDate = date;
        if (date.toLowerCase() === 'tomorrow') {
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          actualDate = tomorrow.toISOString().split('T')[0];
        } else if (date.toLowerCase() === 'today') {
          actualDate = new Date().toISOString().split('T')[0];
        }

        const flights = await searchFlights(from, to, actualDate);
        return {
          success: true,
          data: flights,
          message: flights.length > 0 
            ? `Found ${flights.length} flights from ${from} to ${to} on ${date}`
            : `No flights found from ${from} to ${to} on ${date}`,
        };
      } catch (error: any) {
        return {
          success: false,
          message: `Error searching flights: ${error.message}`,
        };
      }
    },
  }),

  searchYouTube: tool({
    description: 'Search for YouTube videos',
    parameters: z.object({
      query: z.string().describe('Video search query'),
      maxResults: z.number().optional().describe('Maximum number of results (default 5)'),
    }),
    execute: async ({ query, maxResults = 5 }) => {
      try {
        const videos = await searchYouTube(query, maxResults);
        return {
          success: true,
          data: videos,
          message: `Found ${videos.length} videos for "${query}"`,
        };
      } catch (error: any) {
        return {
          success: false,
          message: `Error searching YouTube: ${error.message}`,
        };
      }
    },
  }),

  getAppFeatures: tool({
    description: 'Get information about available app features and how to use them',
    parameters: z.object({
      feature: z.string().optional().describe('Specific feature to ask about (e.g., flights, internships, focus-mode)'),
    }),
    execute: async ({ feature }) => {
      const features = {
        flights: 'Search and book flights between cities. Ask "show flights from X to Y on [date]"',
        hotels: 'Search for hotels in different cities',
        internships: 'Browse internship opportunities across companies',
        academics: 'Access academic resources and study materials',
        focusMode: 'Enter fullscreen focus mode with timer for distraction-free studying',
        chatbot: 'Ask me anything! I can help with flights, hotels, internships, and more',
        youtube: 'Search and watch YouTube videos',
        stocks: 'Get stock market data and financial insights',
        games: 'Play interactive games',
      };

      if (feature) {
        const featureLower = feature.toLowerCase();
        const info = Object.entries(features).find(([key]) => key.includes(featureLower))?.[1];
        return info || `Feature "${feature}" not found. Available features: ${Object.keys(features).join(', ')}`;
      }

      return `Available features: ${Object.keys(features).join(', ')}. Ask me about any of these!`;
    },
  }),
};

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return Response.json({ error: 'No prompt provided' }, { status: 400 });
    }

    const result = streamText({
      model: groq('llama-3.3-70b-versatile'),
      tools,
      system: `You are an intelligent student companion AI assistant with access to app features. 
You can search for flights, hotels, videos, and more. When a user asks about these:
- For flights: use searchFlights tool with from, to, and date
- For videos: use searchYouTube tool
- For app features: use getAppFeatures tool

Extract the required information intelligently:
- "lko" means Lucknow, "bombay" means Mumbai, "del" means Delhi
- "tomorrow" means next day, "today" means current day
- Be helpful, concise, and friendly. Format results nicely.`,
      prompt,
      temperature: 0.7,
      maxTokens: 1000,
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
