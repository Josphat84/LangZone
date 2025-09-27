// app/api/chat/route.ts

import { NextRequest, NextResponse } from "next/server";

const API_URL = "https://api-inference.huggingface.co/models/gpt2";
// ⚠️ Ensure this environment variable is set in Vercel: HUGGING_FACE_API_TOKEN
const API_TOKEN = process.env.HUGGING_FACE_API_TOKEN; 

export async function POST(req: NextRequest) {
  // 💡 FIX 1: Destructure 'message' to match the frontend's JSON body:
  const { message } = await req.json();

  if (!message) {
    return NextResponse.json({ error: "Message (prompt) is required" }, { status: 400 });
  }

  // 💡 Prepare prompt for GPT-2:
  // GPT-2 often includes the input prompt in its output, so we need to
  // provide the prompt as a dedicated string for the API call.
  const inputPrompt = message; 

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
        "Content-Type": "application/json",
      },
      // 💡 FIX 2: Added 'wait_for_model' to prevent timeout errors on Vercel
      body: JSON.stringify({ 
        inputs: inputPrompt, 
        parameters: { 
          max_length: 150, // Increased length slightly for better conversation
          temperature: 0.8, // Increased temperature for less predictable (more conversational) results
          do_sample: true, // Required for temperature sampling
        },
        options: {
          wait_for_model: true, // Avoids "Model is loading" errors
        }
      }),
    });

    if (!response.ok) {
      // Get detailed error from API if possible
      const errorDetail = await response.text();
      throw new Error(`Hugging Face API error: ${response.statusText}. Details: ${errorDetail}`);
    }

    const data = await response.json();
    
    // 💡 FIX 3: Clean the output. GPT-2 tends to repeat the input prompt.
    let generatedText = data[0]?.generated_text?.trim() || "No response generated.";

    // Remove the original prompt from the generated text
    if (generatedText.startsWith(inputPrompt)) {
        generatedText = generatedText.substring(inputPrompt.length).trim();
    }
    
    // Fallback if cleaning results in empty string
    if (generatedText.length === 0) {
        generatedText = "I generated a response, but it was too similar to your input. Please try rephrasing.";
    }

    return NextResponse.json({ response: generatedText });
  } catch (error) {
    console.error("Error fetching from Hugging Face API:", error);
    return NextResponse.json({ error: "Failed to generate response. Please check your API token." }, { status: 500 });
  }
}