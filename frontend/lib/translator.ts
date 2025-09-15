//frontend/lib/translator.ts
// This file contains functions to translate text using an external translation API.




// lib/translator.ts
import { translate } from "@vitalets/google-translate-api";

export async function translateText(text: string, targetLang: string) {
  try {
    const res = await translate(text, { to: targetLang });
    return res.text;
  } catch (err) {
    console.error("Translation error:", err);
    return "❌ Translation failed";
  }
}
