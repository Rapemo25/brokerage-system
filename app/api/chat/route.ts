import { NextResponse } from 'next/server';
import groq from '@/lib/groq';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const chatCompletion = await groq.chat.completions.create({
      messages,
      model: 'mixtral-8x7b-32768',
      temperature: 0.7,
      max_tokens: 1024,
      stream: false,
    });

    return NextResponse.json(chatCompletion.choices[0].message);
  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json(
      { error: 'Failed to process chat request' },
      { status: 500 }
    );
  }
} 