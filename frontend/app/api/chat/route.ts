// app/api/chat/route.ts
import { NextRequest, NextResponse } from "next/server";

// Optional: model URL (fallback to dummy response if API fails)
const API_URL = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct";
const API_TOKEN = process.env.HUGGING_FACE_API_TOKEN;

// Optional timeout in milliseconds
const REQUEST_TIMEOUT = 20000;

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return NextResponse.json({ error: "Message (prompt) is required" }, { status: 400 });
    }

    const inputPrompt = message.trim();

    // If API token is missing, return a safe fallback response
    if (!API_TOKEN) {
      console.warn("HUGGING_FACE_API_TOKEN not defined. Returning fallback response.");
      return NextResponse.json({
        response: "Chatbot is temporarily unavailable. Please try again later.",
      });
    }

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
          max_new_tokens: 50,
          temperature: 0.8,
          do_sample: true,
        },
        options: { wait_for_model: true },
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // If the API fails, return fallback response
    if (!response.ok) {
      console.warn("Hugging Face API request failed. Returning fallback response.");
      return NextResponse.json({
        response: "Chatbot is temporarily unavailable. Please try again later.",
      });
    }

    const rawText = await response.text();
    const data = JSON.parse(rawText);

    let generatedText = data[0]?.generated_text?.trim() || "No response generated.";

    if (generatedText.startsWith(inputPrompt)) {
      generatedText = generatedText.substring(inputPrompt.length).trim();
    }

    if (generatedText.length === 0) {
      generatedText = "I generated a response, but it was too similar to your input. Please try rephrasing.";
    }

    return NextResponse.json({ response: generatedText });
  } catch (error: any) {
    console.error("Error in /api/chat:", error);

    // Always return a fallback response instead of crashing
    return NextResponse.json({
      response: "Chatbot is temporarily unavailable. Please try again later.",
    });
  }
}
