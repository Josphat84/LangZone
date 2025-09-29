// app/api/chat/route.ts
import { NextRequest, NextResponse } from "next/server";

// ✅ Updated model for better chatbot responses
const API_URL = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct";
const API_TOKEN = process.env.HUGGING_FACE_API_TOKEN;

if (!API_TOKEN) {
  throw new Error("HUGGING_FACE_API_TOKEN is not defined in your environment.");
}

// Optional timeout in milliseconds
const REQUEST_TIMEOUT = 20000;

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return NextResponse.json({ error: "Message (prompt) is required" }, { status: 400 });
    }

    const inputPrompt = message.trim();

    // AbortController for timeout handling
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: inputPrompt,
        parameters: {
          max_new_tokens: 50, // Keep small for speed
          temperature: 0.8,
          do_sample: true,
        },
        options: { wait_for_model: true },
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Log raw response for debugging
    const rawText = await response.text();
    console.log("HF API raw response:", rawText);

    if (!response.ok) {
      throw new Error(`Hugging Face API error: ${response.statusText}. Details: ${rawText}`);
    }

    const data = JSON.parse(rawText);

    // Extract generated text safely
    let generatedText = data[0]?.generated_text?.trim() || "No response generated.";

    // Remove original prompt from output
    if (generatedText.startsWith(inputPrompt)) {
      generatedText = generatedText.substring(inputPrompt.length).trim();
    }

    if (generatedText.length === 0) {
      generatedText =
        "I generated a response, but it was too similar to your input. Please try rephrasing.";
    }

    return NextResponse.json({ response: generatedText });
  } catch (error: any) {
    console.error("Error in /api/chat:", error);

    const isTimeout = error.name === "AbortError";
    const clientMessage = isTimeout
      ? "The request timed out. Please try again."
      : "Failed to generate response. Please check your API token or model endpoint.";

    return NextResponse.json({ error: clientMessage }, { status: 500 });
  }
}
