import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json({
        success: false,
        error: 'GEMINI_API_KEY not found in environment variables',
        timestamp: new Date().toISOString()
      }, { status: 400 });
    }

    // Test the API key with a simple request
    const testUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    
    console.log('Testing Gemini API with URL:', testUrl.replace(apiKey, 'HIDDEN_KEY'));
    
    const response = await fetch(testUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: 'Hello, please respond with "API verification successful" to confirm the connection.',
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 50,
        },
      }),
    });

    console.log('Gemini API Response Status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API Error:', errorText);
      
      let errorMessage = `HTTP ${response.status}`;
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.error?.message || errorText;
      } catch (e) {
        errorMessage = errorText;
      }
      
      return NextResponse.json({
        success: false,
        error: errorMessage,
        status: response.status,
        apiKeyLength: apiKey.length,
        apiKeyPrefix: apiKey.substring(0, 10) + '...',
        timestamp: new Date().toISOString()
      }, { status: response.status });
    }

    const data = await response.json();
    console.log('Gemini API Success Response:', data);
    
    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response text';
    
    return NextResponse.json({
      success: true,
      message: 'Gemini API is working correctly',
      response: responseText,
      apiKeyLength: apiKey.length,
      apiKeyPrefix: apiKey.substring(0, 10) + '...',
      timestamp: new Date().toISOString()
    });
    
  } catch (error: any) {
    console.error('Verification Error:', error);
    
    return NextResponse.json({
      success: false,
      error: error.message,
      details: error.toString(),
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}