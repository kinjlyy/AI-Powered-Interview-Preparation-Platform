// Simple server-side proxy for AI calls to avoid browser CORS and protector key exposure
// Run: node proxy.js
import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const GEMINI_KEY = process.env.GEMINI_KEY || process.env.VITE_GEMINI_API_KEY;
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || 'http://localhost:5173';

if (!GEMINI_KEY) {
  console.warn('Proxy warning: GEMINI_KEY not set in environment. Requests to /api/eval will fail until the key is provided. Use GEMINI_KEY or VITE_GEMINI_API_KEY environment variable');
}

app.use(cors({ origin: ALLOWED_ORIGIN }));
app.use(bodyParser.json());

// Health check
app.get('/api/health', (req, res) => {
  if (!GEMINI_KEY) {
    return res.status(500).json({ status: 'error', message: 'GEMINI_KEY not configured' });
  }
  return res.json({ status: 'ok' });
});

app.post('/api/eval', async (req, res) => {
  try {
    if (!GEMINI_KEY) {
      return res.status(500).json({ error: 'Server proxy misconfigured: GEMINI_KEY is required' });
    }
    const { prompt } = req.body;
    // Avoid logging whole secret prompt; show only a short preview for debugging
    const preview = String(prompt).slice(0, 120).replace(/\n/g, ' ');
    console.log(`Proxy: incoming AI eval request (${preview}${String(prompt).length > 120 ? '...' : ''})`);
    if (!prompt) {
      return res.status(400).json({ error: 'Missing prompt in request' });
    }
    const url = 'https://gen.generativeai.google/api/v1beta2/models/gemini-lite:generateText';
    const headers = {
      'Content-Type': 'application/json',
    };
    // Decide between key or bearer token
    if (GEMINI_KEY?.startsWith('Bearer ')) {
      headers['Authorization'] = GEMINI_KEY;
    } else if (GEMINI_KEY) {
      // Append key as query param
    }

    const fullUrl = GEMINI_KEY && !GEMINI_KEY.startsWith('Bearer ') ? `${url}?key=${GEMINI_KEY}` : url;

    const body = {
      prompt: {
        text: prompt,
      },
      maxOutputTokens: 256,
    };

    const r = await fetch(fullUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });
    const json = await r.json();
    console.log(`Proxy: received response from Gemini (status ${r.status})`);
    return res.json(json);
  } catch (err) {
    console.error('Proxy error', err);
    return res.status(500).json({ error: String(err) });
  }
});

app.listen(PORT, () => {
  console.log(`AI proxy running on http://localhost:${PORT}/api/eval`);
});
