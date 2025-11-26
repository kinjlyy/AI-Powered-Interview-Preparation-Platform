import companyData from '../data/companyData';

const GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export async function evaluateWithAI(prompt: string): Promise<string> {
  if (!GEMINI_KEY) {
    throw new Error('Missing Gemini API key. Set VITE_GEMINI_API_KEY in .env');
  }

  const url = 'https://gen.generativeai.google/api/v1beta2/models/gemini-lite:generateText';
  const body = {
    prompt: {
      text: prompt,
    },
    maxOutputTokens: 256,
  };

  const useBearer = GEMINI_KEY.startsWith('Bearer ');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (useBearer) {
    headers['Authorization'] = GEMINI_KEY;
  }

  const fullUrl = useBearer ? url : `${url}?key=${GEMINI_KEY}`;

  const res = await fetch("http://localhost:5000/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`AI request failed: ${res.status} ${res.statusText} - ${text}`);
  }

  const json = await res.json();
  // Gemini returns a nested structure — this is a best-effort extraction
  if (json?.candidates?.[0]?.content?.[0]?.text) {
    return json.candidates[0].content[0].text;
  }

  if (json?.output?.[0]?.content?.[0]?.text) {
    return json.output[0].content[0].text;
  }

  return JSON.stringify(json);
}

export { companyData };
