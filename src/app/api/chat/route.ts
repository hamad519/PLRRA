import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { getApplicationContext } from '@/lib/ai-context';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    
    const GROQ_API_KEY = process.env.GROQ_API_KEY;

    if (!GROQ_API_KEY) {
      return NextResponse.json({ 
        role: 'bot', 
        content: "Missing GROQ_API_KEY. Please add it to your .env file." 
      }, { status: 500 });
    }

    // 1. Extract text from your PDFs and Docs based on the user's query
    const lastUserMessage = messages.filter((m: any) => m.role === 'user').pop()?.content || '';
    const siteContext = await getApplicationContext(lastUserMessage);

    // 2. Create a forceful system prompt
    const systemPrompt = `You are the official PLRA (Pakistan Long Range Rifle Association) AI assistant.
You have full access to the association's internal records, documents, and data.

CRITICAL RULES:
1. NEVER say "I cannot read PDFs" or "I don't have access to files." The PDF content is already extracted and given to you below.
2. The CONTEXT DATA below contains ACTUAL TEXT extracted from PDF documents — national records, press releases, and competition results.
3. When a user asks about national records, use the "=== NATIONAL RECORDS ===" section.
4. When a user asks about press releases or news, use the "=== PRESS RELEASES ===" section.
5. When a user asks about past results or competitions, use the "=== PAST COMPETITION RESULTS ===" section.
6. Always answer in the same language the user used (Urdu or English).
7. If the specific information is not in the context, say so honestly and suggest contacting plra.pakistan2022@gmail.com.
8. Be precise — quote names, dates, scores, and rankings directly from the document text when available.

CONTEXT DATA:
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
    console.error("Chat API Error:", error);
    return NextResponse.json({ 
      role: 'bot', 
      content: "I had trouble reading the document data. Please check if your Groq API key is valid and your documents are in the correct folder." 
    }, { status: 500 });
  }
}