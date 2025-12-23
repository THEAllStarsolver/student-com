export async function callLLM(prompt: string, context?: any): Promise<string> {
  try {
    const response = await fetch('/api/llm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, context }),
    });
    const data = await response.json();
    return data.response;
  } catch (error) {
    return "I'm here to help with careers, skills, exams, and nearby places!";
  }
}
