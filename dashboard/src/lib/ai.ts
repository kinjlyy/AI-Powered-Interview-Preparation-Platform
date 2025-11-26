import { GoogleGenerativeAI } from "@google/generative-ai";
// Adjust this path if your companyData file is located elsewhere
import { companyData } from '../data/companyData'; 

// --- Configuration ---
const GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export async function evaluateWithAI(prompt: string): Promise<string> {
  if (!GEMINI_KEY) {
    // This error will trigger the toast in your MockInterview component
    throw new Error('Missing Gemini API key. Set VITE_GEMINI_API_KEY in .env');
  }

  try {
    // 1. Initialize the Google Generative AI Client
    const genAI = new GoogleGenerativeAI(GEMINI_KEY);
    
    // 2. Select a Model (Flash is faster for real-time applications)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // 3. Generate content using the prompt received from the frontend
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return text;

  } catch (error) {
    console.error("AI Request Failed:", error);
    // Throw an error to be caught by the frontend, showing the "AI evaluation failed" toast
    throw new Error("Failed to evaluate answer. Please check your API key and network connection.");
  }
}

// Re-export companyData so the MockInterview component can import both the data 
// and the evaluation function from the same file, as in your original setup.
export { companyData };