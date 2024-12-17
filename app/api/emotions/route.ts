import { HfInference } from '@huggingface/inference';
import { NextResponse } from 'next/server';

// Initialize Hugging Face inference with our API key
const Hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

export const maxDuration = 60;
export async function POST(req: Request) {
  try {
    // Extract the text from the request body
    const { text } = await req.json();
    
    // Make sure we have text to analyze
    if (!text) {
      return NextResponse.json(
        { error: 'No text provided' },
        { status: 400 }
      );
    }

    // Call Hugging Face model for emotion analysis
    const response = await Hf.textClassification({
      model: 'SamLowe/roberta-base-go_emotions',
      inputs: text
    });

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error during emotion analysis:', error);
    return NextResponse.json(
      { error: 'Failed to analyze emotions' },
      { status: 500 }
    );
  }
}