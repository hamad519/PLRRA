import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { getApplicationContext } from '@/lib/ai-context';

export async function POST(req: Request) {
  let messages: any[] = [];
  try {
    ({ messages } = await req.json());
  } catch {
    return NextResponse.json({ role: 'bot', content: "Invalid request body." }, { status: 400 });
  }

  const GROQ_API_KEY = process.env.GROQ_API_KEY;
  if (!GROQ_API_KEY) {
    return NextResponse.json({
      role: 'bot',
      content: "The assistant isn't configured yet — GROQ_API_KEY is missing from the server's .env file. Please add it and restart the dev server.",
    }, { status: 500 });
  }

  // 1. Extract text from your PDFs and Docs based on the user's query
  const lastUserMessage = messages.filter((m: any) => m.role === 'user').pop()?.content || '';

  let siteContext = '';
  try {
    siteContext = await getApplicationContext(lastUserMessage);
  } catch (err: any) {
    console.error('[chat] Failed to build site context:', err);
    siteContext = 'Basic PLRA information: National governing body for long range shooting in Pakistan.';
  }

  try {

    // 2. Create a forceful system prompt
    const systemPrompt = `You are the official PLRA (Pakistan Long Range Rifle Association) AI assistant. Your name is **PLRA Assistant**. You are friendly, professional, and helpful.

You have access to PLRA's complete database including events, competitions, records, press releases, achievements, contributors, and senior member profiles. This data is provided below.

BEHAVIOR RULES:

1. NEVER say "I cannot read PDFs" or "I don't have access to files." The data is already extracted and given to you.

2. NEVER reference internal section names like "=== NATIONAL RECORDS ===" or "CONTEXT DATA" to the user. The user should never know how your data is structured internally.

3. When the user asks about something that IS in your data, answer confidently with specific names, dates, scores, and facts.

4. When the user asks about something NOT in your data:
   - Do NOT say "The provided context does not mention..." or "check the section..."
   - Instead, respond naturally like: "I don't have specific details about that right now, but I can help you with information about PLRA's competitions, events, records, achievements, or membership. You can also reach us at plra.pakistan2022@gmail.com for more details!"
   - Be warm and helpful, suggest related things you DO know about.

5. When the user asks a general question (like "hi", "hello", "what can you do"):
   - Greet them warmly and introduce yourself
   - Briefly mention what you can help with: events, competitions, records, achievements, membership, leadership info
   - Keep it short and inviting

6. Always answer in the same language the user used (Urdu or English).

7. You can also answer general knowledge questions about long-range shooting, F-Class shooting, rifle sports etc. using your own knowledge — you're not limited to only PLRA data.

8. For membership or registration questions, guide them to the relevant pages on the website or suggest contacting via email.

FORMATTING RULES:
- Use numbered lists (1. 2. 3.) for ranked or sequential items.
- Use bullet points (- ) for features, details, or non-ordered lists.
- Use **bold** for names, titles, and key terms.
- Use blank lines between paragraphs.
- Keep responses well-structured, clean, and easy to scan.
- NEVER dump everything on one line.

PLRA DATA:
${siteContext}`;

    const groq = new OpenAI({
      apiKey: GROQ_API_KEY,
      baseURL: "https://api.groq.com/openai/v1",
    });

    // 3. Send the extracted text to Groq
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        ...messages
      ],
      temperature: 0.1, // Low temperature for factual accuracy
    });

    return NextResponse.json({ 
      role: 'bot', 
      content: response.choices[0].message.content 
    });

  } catch (error: any) {
    const status = error?.status ?? error?.response?.status;
    const code = error?.code ?? error?.response?.data?.error?.code;
    const apiMessage = error?.response?.data?.error?.message || error?.message;
    console.error('[chat] Groq API error:', { status, code, message: apiMessage });

    let userMessage = "Sorry, the assistant ran into a problem. Please try again in a moment.";
    if (status === 401 || /invalid.*api.*key|unauthorized/i.test(apiMessage || '')) {
      userMessage = "The assistant's API key was rejected. Please check that GROQ_API_KEY in your .env file is valid.";
    } else if (status === 429 || code === 'rate_limit_exceeded') {
      userMessage = "The assistant is currently rate-limited. Please wait a moment and try again.";
    } else if (status === 404 || /model.*not.*found/i.test(apiMessage || '')) {
      userMessage = "The configured AI model is unavailable. Please contact the site administrator.";
    } else if (/timeout|ECONN|ENOTFOUND|fetch failed/i.test(apiMessage || '')) {
      userMessage = "Couldn't reach the AI service. Please check your internet connection and try again.";
    }

    return NextResponse.json({ role: 'bot', content: userMessage }, { status: 500 });
  }
}