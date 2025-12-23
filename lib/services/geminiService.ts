// Gemini AI Service - Google Gemini API Integration
import { config, getApiHeaders } from '../config';

export interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
    finishReason: string;
    index: number;
  }>;
}

export interface ChatMessage {
  role: 'user' | 'model';
  parts: Array<{
    text: string;
  }>;
}

class GeminiService {
  private apiKey = config.gemini.apiKey;
  private baseUrl = config.gemini.baseUrl;

  // Generate content using Gemini Pro
  async generateContent(prompt: string): Promise<string> {
    try {
      if (!this.apiKey) {
        throw new Error('Gemini API key not configured');
      }

      // Correct endpoint for Gemini AI Studio API keys
      const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${this.apiKey}`;
      
      console.log('Gemini API Request:', {
        url: url.replace(this.apiKey!, 'HIDDEN_KEY'),
        prompt: prompt.substring(0, 100) + '...'
      });

      const requestBody = {
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      console.log('Gemini API Response Status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Gemini API Error Response:', errorText);
        
        // Parse error for better user feedback
        try {
          const errorData = JSON.parse(errorText);
          if (errorData.error?.message) {
            throw new Error(`Gemini API Error: ${errorData.error.message}`);
          }
        } catch (parseError) {
          // If can't parse, use the raw error
        }
        
        throw new Error(`Gemini API Error: ${response.status} - ${errorText}`);
      }

      const data: GeminiResponse = await response.json();
      console.log('Gemini API Success Response Structure:', {
        hasCandidates: !!data.candidates,
        candidatesLength: data.candidates?.length || 0,
        firstCandidate: data.candidates?.[0] ? 'present' : 'missing'
      });

      if (!data.candidates || data.candidates.length === 0) {
        throw new Error('No response candidates from Gemini API');
      }

      const responseText = data.candidates[0]?.content?.parts[0]?.text;
      if (!responseText) {
        throw new Error('Empty response from Gemini API');
      }

      console.log('Gemini API Response Length:', responseText.length);
      return responseText;
    } catch (error) {
      console.error('Gemini Service - Generate Content Error:', error);
      throw error;
    }
  }

  // Chat with Gemini (conversation context)
  async chat(messages: ChatMessage[]): Promise<string> {
    try {
      if (!this.apiKey) {
        throw new Error('Gemini API key not configured');
      }

      const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${this.apiKey}`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: messages,
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            }
          ]
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Gemini Chat API Error:', errorText);
        throw new Error(`Gemini API Error: ${response.status} - ${errorText}`);
      }

      const data: GeminiResponse = await response.json();

      if (!data.candidates || data.candidates.length === 0) {
        throw new Error('No response candidates from Gemini API');
      }

      return data.candidates[0]?.content?.parts[0]?.text || 'No response generated';
    } catch (error) {
      console.error('Gemini Service - Chat Error:', error);
      throw error;
    }
  }

  // Test API connection
  async testConnection(): Promise<boolean> {
    try {
      const response = await this.generateContent('Hello, this is a test message. Please respond with "API connection successful".');
      console.log('Gemini API Test Response:', response);
      return true;
    } catch (error) {
      console.error('Gemini API Connection Test Failed:', error);
      return false;
    }
  }

  // Generate study content
  async generateStudyContent(topic: string, level: 'beginner' | 'intermediate' | 'advanced'): Promise<string> {
    const prompt = `Create a comprehensive study guide for "${topic}" at ${level} level. Include:
    1. Key concepts and definitions
    2. Important points to remember
    3. Practice questions
    4. Real-world applications
    5. Further reading suggestions
    
    Format the response in a clear, structured manner suitable for students.`;

    return this.generateContent(prompt);
  }

  // Generate travel recommendations
  async generateTravelRecommendations(destination: string, interests: string[]): Promise<string> {
    const prompt = `Generate travel recommendations for ${destination} based on these interests: ${interests.join(', ')}. Include:
    1. Top attractions and activities
    2. Local cuisine recommendations
    3. Cultural experiences
    4. Practical travel tips
    5. Best time to visit
    
    Provide specific, actionable recommendations.`;

    return this.generateContent(prompt);
  }

  // Code review and suggestions
  async reviewCode(code: string, language: string): Promise<string> {
    const prompt = `Review this ${language} code and provide:
    1. Code quality assessment
    2. Potential bugs or issues
    3. Performance improvements
    4. Best practices suggestions
    5. Security considerations
    
    Code:
    \`\`\`${language}
    ${code}
    \`\`\``;

    return this.generateContent(prompt);
  }

  // Academic assistance
  async getAcademicHelp(subject: string, question: string): Promise<string> {
    const prompt = `As an expert tutor in ${subject}, help with this question: "${question}"
    
    Provide:
    1. Clear explanation of concepts
    2. Step-by-step solution (if applicable)
    3. Related concepts to explore
    4. Practice suggestions
    
    Make the explanation suitable for a student learning this topic.`;

    return this.generateContent(prompt);
  }

  // Mock response for demo purposes
  getMockResponse(prompt: string): string {
    return `**STARK AI Assistant Response**

This is a demonstration response for: "${prompt}"

The Gemini AI service would provide intelligent, contextual responses based on your query. This includes:

• **Detailed Analysis**: Comprehensive breakdown of your query
• **Step-by-Step Guidance**: Clear instructions and explanations  
• **Relevant Examples**: Practical applications and use cases
• **Personalized Recommendations**: Tailored suggestions based on context

**API Status**: Gemini API key is configured. If you're seeing this message, there might be an API connectivity issue.

To troubleshoot:
1. Check your internet connection
2. Verify the API key is correct
3. Ensure the Gemini API is enabled in Google Cloud Console`;
  }
}

export const geminiService = new GeminiService();
export default geminiService;