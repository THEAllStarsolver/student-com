export async function callLLM(prompt: string, context?: any): Promise<string> {
  try {
    const response = await fetch('/api/llm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, context }),
    });
    const data = await response.json();
    
    // Check if response contains quota or error information
    const responseText = data.response || '';
    
    // Handle quota exceeded error
    if (response.status === 429 || 
        responseText.includes('quota') || 
        responseText.includes('RESOURCE_EXHAUSTED') ||
        responseText.includes('exceeded')) {
      return 'API quota exceeded. Please upgrade your Gemini API plan or try again later. In the meantime, I can help with:\n- Career guidance and internship information\n- Study tips and exam preparation\n- Skill development resources\n- Finding nearby places and services\n\nWhat would you like help with?';
    }
    
    // Handle other API errors
    if (!response.ok || responseText.includes('Error:')) {
      return 'I\'m here to help with careers, skills, exams, and nearby places! Please try a specific question.';
    }
    
    return responseText || 'I\'m here to help! Please try again.';
  } catch (error) {
    return "I'm here to help with careers, skills, exams, and nearby places!";
  }
}
