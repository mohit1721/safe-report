import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: Request) {
  try {
    // Extract the video from the request body
    const { video } = await request.json();
    const base64Data = video.split(',')[1]; // Remove the data URI prefix

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

    // 🎥 Video Analysis Prompt
    const prompt = `Analyze this emergency situation video and respond in this exact format without any asterisks or bullet points: 

    TITLE: Write a clear, brief title  
    TYPE: Choose one (Murder, Felony, Cybercrime, Antisocial Behavior, Assault, Hate Crime, Rape, Corrupt Behaviour, Money Laundering, Sexual Assault, Arson, Robbery, Domestic Violence, Fraud, Domestic Crime, Burglary, Human Trafficking, Kidnapping, Knife Crime, Theft, Fire Outbreak, Medical Emergency, Natural Disaster, Violence, Other)  
    DESCRIPTION: Write a clear, concise description`;

    // 📤 Send video to Gemini
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Data,
          mimeType: 'video/mp4',
        },
      },
    ]);

    const text = await result.response.text(); // Ensure text() is awaited

    // 🧠 Parse the Gemini Response
    const titleMatch = text.match(/TITLE:\s*(.+)/);
    const typeMatch = text.match(/TYPE:\s*(.+)/);
    const descMatch = text.match(/DESCRIPTION:\s*(.+)/);

    return NextResponse.json({
      title: titleMatch?.[1]?.trim() || '',
      reportType: typeMatch?.[1]?.trim() || '',
      description: descMatch?.[1]?.trim() || '',
    });
  } catch (error) {
    console.error('Video analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze video' },
      { status: 500 }
    );
  }
}
