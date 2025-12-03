// lib/aiService.ts
export interface AIServiceOptions {
  model?: string;
  temperature?: number;
}

export interface AIResponse {
  reply: string;
  model?: string;
  usage?: any;
}

export async function askAI(
  prompt: string, 
  opts?: AIServiceOptions
): Promise<AIResponse> {
  const res = await fetch("/api/ai", {
    method: "POST",
    headers: { 
      "Content-Type": "application/json" 
    },
    body: JSON.stringify({ 
      prompt, 
      model: opts?.model, 
      temperature: opts?.temperature 
    }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData?.error || `AI request failed: ${res.status}`);
  }

  const data = await res.json();
  return data as AIResponse;
}

// Function to call AI with retry logic for better reliability
export async function askAIWithRetry(
  prompt: string, 
  opts?: AIServiceOptions,
  maxRetries: number = 3
): Promise<AIResponse> {
  let lastError;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await askAI(prompt, opts);
    } catch (error) {
      lastError = error;
      if (i < maxRetries - 1) {
        // Wait before retrying (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
        continue;
      }
    }
  }
  
  throw lastError || new Error("AI request failed after retries");
}