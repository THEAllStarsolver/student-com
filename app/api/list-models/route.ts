import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json({
        success: false,
        error: 'GEMINI_API_KEY not found in environment variables'
      }, { status: 400 });
    }

    // List available models
    const listUrl = `https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`;
    
    console.log('Listing Gemini models...');
    
    const response = await fetch(listUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    console.log('List Models Response Status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('List Models Error:', errorText);
      return NextResponse.json({
        success: false,
        error: errorText,
        status: response.status
      }, { status: response.status });
    }

    const data = await response.json();
    console.log('Available Models:', data);
    
    return NextResponse.json({
      success: true,
      models: data.models || [],
      timestamp: new Date().toISOString()
    });
    
  } catch (error: any) {
    console.error('List Models Error:', error);
    
    return NextResponse.json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}