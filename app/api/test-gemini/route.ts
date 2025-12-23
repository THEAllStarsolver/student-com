import { NextRequest, NextResponse } from 'next/server';
import { geminiService } from '../../../lib/services/geminiService';

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();
    
    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    console.log('API Test: Testing Gemini with prompt:', prompt);
    
    const response = await geminiService.generateContent(prompt);
    
    return NextResponse.json({
      success: true,
      response,
      provider: 'gemini',
      timestamp: new Date().toISOString()
    });
    
  } catch (error: any) {
    console.error('API Test Error:', error);
    
    return NextResponse.json({
      success: false,
      error: error.message,
      details: error.toString(),
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Gemini API Test Endpoint',
    status: 'Ready',
    apiKeyConfigured: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString()
  });
}