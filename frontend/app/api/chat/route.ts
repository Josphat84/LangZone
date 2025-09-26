import { NextRequest, NextResponse } from "next/server";

const API_URL = "https://api-inference.huggingface.co/models/gpt2";
const API_TOKEN = process.env.HUGGING_FACE_API_TOKEN;

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();

  if (!prompt) {
    return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
  }

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inputs: prompt, parameters: { max_length: 100 } }),
    });

    if (!response.ok) {
      throw new Error(`Hugging Face API error: ${response.statusText}`);
    }

    const data = await response.json();
    const generatedText = data[0]?.generated_text?.trim() || "No response generated.";

    return NextResponse.json({ response: generatedText });
  } catch (error) {
    console.error("Error fetching from Hugging Face API:", error);
    return NextResponse.json({ error: "Failed to generate response" }, { status: 500 });
  }
}
