// Unified LLM Service - Supports both Gemini and GROQ APIs
import { config, getApiHeaders } from '../config';
import { geminiService } from './geminiService';

export interface LLMResponse {
  content: string;
  provider: 'gemini' | 'groq';
  usage?: {
    promptTokens?: number;
    completionTokens?: number;
    totalTokens?: number;
  };
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

class LLMService {
  private primaryProvider: 'gemini' | 'groq' = 'gemini';
  private fallbackProvider: 'gemini' | 'groq' = 'groq';

  constructor() {
    // Determine which provider to use based on available API keys
    if (config.gemini.apiKey && config.groq.apiKey) {
      this.primaryProvider = 'gemini';
      this.fallbackProvider = 'groq';
    } else if (config.gemini.apiKey) {
      this.primaryProvider = 'gemini';
      this.fallbackProvider = 'gemini';
    } else if (config.groq.apiKey) {
      this.primaryProvider = 'groq';
      this.fallbackProvider = 'groq';
    }
  }

  // Generate content using the best available provider
  async generateContent(prompt: string): Promise<LLMResponse> {
    console.log('LLM Service: Generating content with prompt:', prompt.substring(0, 100) + '...');
    
    try {
      // Try primary provider first (Gemini)
      if (this.primaryProvider === 'gemini' && config.gemini.apiKey) {
        console.log('LLM Service: Using Gemini as primary provider');
        try {
          const content = await geminiService.generateContent(prompt);
          console.log('LLM Service: Gemini response received');
          return {
            content,
            provider: 'gemini'
          };
        } catch (geminiError) {
          console.error('LLM Service: Gemini failed:', geminiError);
          throw geminiError;
        }
      }

      // If Gemini is not available, try GROQ (though it uses same key)
      if (this.primaryProvider === 'groq' && config.groq.apiKey) {
        console.log('LLM Service: Using GROQ as primary provider');
        const content = await this.generateWithGroq(prompt);
        return {
          content,
          provider: 'groq'
        };
      }

      // If no providers available, return mock response
      console.log('LLM Service: No providers available, using mock response');
      return {
        content: this.getMockResponse(prompt),
        provider: 'gemini'
      };

    } catch (error) {
      console.error('LLM Service Error:', error);
      
      // Return error information in mock response
      return {
        content: this.getErrorResponse(prompt, error as Error),
        provider: 'gemini'
      };
    }
  }

  // Generate content using GROQ API
  private async generateWithGroq(prompt: string): Promise<string> {
    const response = await fetch(`${config.groq.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: getApiHeaders('groq'),
      body: JSON.stringify({
        model: 'mixtral-8x7b-32768', // GROQ's fast model
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1024,
        temperature: 0.7
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(`GROQ API Error: ${data.error?.message || 'Unknown error'}`);
    }

    return data.choices[0]?.message?.content || 'No response generated';
  }

  // Chat with conversation context
  async chat(messages: ChatMessage[]): Promise<LLMResponse> {
    try {
      if (this.primaryProvider === 'gemini' && config.gemini.apiKey) {
        // Convert to Gemini format
        const geminiMessages = messages.map(msg => ({
          role: (msg.role === 'assistant' ? 'model' : 'user') as 'user' | 'model',
          parts: [{ text: msg.content }]
        }));
        
        const content = await geminiService.chat(geminiMessages);
        return {
          content,
          provider: 'gemini'
        };
      }

      if (this.primaryProvider === 'groq' && config.groq.apiKey) {
        const content = await this.chatWithGroq(messages);
        return {
          content,
          provider: 'groq'
        };
      }

      return {
        content: this.getMockResponse(messages[messages.length - 1]?.content || ''),
        provider: 'gemini'
      };

    } catch (error) {
      console.error('LLM Chat Error:', error);
      return {
        content: this.getMockResponse(messages[messages.length - 1]?.content || ''),
        provider: 'gemini'
      };
    }
  }

  // Chat using GROQ API
  private async chatWithGroq(messages: ChatMessage[]): Promise<string> {
    const response = await fetch(`${config.groq.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: getApiHeaders('groq'),
      body: JSON.stringify({
        model: 'mixtral-8x7b-32768',
        messages: messages.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        max_tokens: 1024,
        temperature: 0.7
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(`GROQ API Error: ${data.error?.message || 'Unknown error'}`);
    }

    return data.choices[0]?.message?.content || 'No response generated';
  }

  // Get provider status
  getProviderStatus() {
    return {
      primary: this.primaryProvider,
      fallback: this.fallbackProvider,
      geminiAvailable: !!config.gemini.apiKey,
      groqAvailable: !!config.groq.apiKey
    };
  }

  // Specialized methods using the unified service
  async generateStudyContent(topic: string, level: 'beginner' | 'intermediate' | 'advanced'): Promise<LLMResponse> {
    const prompt = `Create a comprehensive study guide for "${topic}" at ${level} level. Include:
    1. Key concepts and definitions
    2. Important points to remember
    3. Practice questions
    4. Real-world applications
    5. Further reading suggestions
    
    Format the response in a clear, structured manner suitable for students.`;

    return this.generateContent(prompt);
  }

  async generateTravelRecommendations(destination: string, interests: string[]): Promise<LLMResponse> {
    const prompt = `Generate travel recommendations for ${destination} based on these interests: ${interests.join(', ')}. Include:
    1. Top attractions and activities
    2. Local cuisine recommendations
    3. Cultural experiences
    4. Practical travel tips
    5. Best time to visit
    
    Provide specific, actionable recommendations.`;

    return this.generateContent(prompt);
  }

  async reviewCode(code: string, language: string): Promise<LLMResponse> {
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

  async getAcademicHelp(subject: string, question: string): Promise<LLMResponse> {
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
  private getMockResponse(prompt: string): string {
    return `**STARK AI Assistant Response**

This is a demonstration response for: "${prompt}"

The AI system would provide intelligent, contextual responses including:

• **Detailed Analysis**: Comprehensive breakdown of your query
• **Step-by-Step Guidance**: Clear instructions and explanations  
• **Relevant Examples**: Practical applications and use cases
• **Personalized Recommendations**: Tailored suggestions based on context

**System Status**: Gemini API is configured with key: ${config.gemini.apiKey ? 'Present' : 'Missing'}

To enable full AI capabilities, ensure your API key is properly configured and the Gemini API is enabled in Google Cloud Console.`;
  }

  // Error response with debugging information
  private getErrorResponse(prompt: string, error: Error): string {
    return `**AI Service Error**

**Your Question:** "${prompt}"

**Error Details:** ${error.message}

**Troubleshooting:**
1. **API Key Status:** ${config.gemini.apiKey ? '✅ Present' : '❌ Missing'}
2. **Network:** Check your internet connection
3. **API Limits:** Verify you haven't exceeded rate limits
4. **Service Status:** Check Google AI Studio status

**Next Steps:**
- Try a simpler question
- Refresh the page and try again
- Check the browser console for detailed error logs

The system is configured to work with Gemini AI. This appears to be a connectivity or API issue.`;
  }
}

export const llmService = new LLMService();
export default llmService;