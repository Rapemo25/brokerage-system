import { NextResponse } from 'next/server';
import groq from '@/lib/groq';

export async function POST(req: Request) {
  if (!process.env.GROQ_API_KEY) {
    console.error('GROQ_API_KEY is not set');
    return NextResponse.json(
      { error: 'API key not configured' },
      { status: 500 }
    );
  }

  try {
    const { messages } = await req.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Invalid messages format' },
        { status: 400 }
      );
    }

    console.log('Sending request to Groq with messages:', messages);

    const chatCompletion = await groq.chat.completions.create({
      messages,
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 1024,
      stream: false,
    });

    console.log('Received response from Groq:', chatCompletion);

    if (!chatCompletion.choices?.[0]?.message) {
      console.error('Invalid response format from Groq:', chatCompletion);
      return NextResponse.json(
        { error: 'Invalid response from AI' },
        { status: 500 }
      );
    }

    return NextResponse.json(chatCompletion.choices[0].message);
  } catch (error: any) {
    console.error('Error in chat API:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process chat request',
        details: error.message || 'Unknown error'
      },
      { status: 500 }
    );
  }
} 