interface ChatCompletionResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export async function sendChatMessage(prompt: string): Promise<string> {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  console.log("🔑 当前 API Key:", apiKey); 
  
  if (!apiKey) {
    throw new Error('OpenAI API key is not configured');
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7
    })
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to get response from OpenAI');
  }

  const data: ChatCompletionResponse = await response.json();
  return data.choices[0].message.content.trim();
} 

export async function getFeedbackFromGPT(
  question: string,
  studentAnswer: string,
  referenceAnswer: string
): Promise<string> {
  const prompt = `As an English language tutor, please provide constructive feedback on this student's answer.

Question: "${question}"

Student's Answer: "${studentAnswer}"

Reference Answer: "${referenceAnswer}"

Please provide feedback that:
1. Compares the student's answer with the reference answer
2. Highlights differences or missing parts
3. Suggests specific improvements
4. Praises correct parts
5. Keeps the response to 2-3 sentences maximum

Be encouraging but honest in your assessment.`;

  return await sendChatMessage(prompt);
} 