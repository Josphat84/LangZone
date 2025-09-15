// This is the API route for handling translation requests.
//frontend/app/api/translate/route.ts

// app/api/translate/route.ts
import { NextResponse } from "next/server";
import { translateText } from "@/lib/translator";

export async function POST(req: Request) {
  try {
    const { text, targetLang } = await req.json();
    const translatedText = await translateText(text, targetLang);
    return NextResponse.json({ translatedText });
  } catch (err) {
    console.error("API translation error:", err);
    return NextResponse.json(
      { error: "Translation failed" },
      { status: 500 }
    );
  }
}

