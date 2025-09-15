// This is a demo page for testing translation functionality.
//frontend/app/translate-demo/page.tsx


"use client";

import { useState } from "react";

export default function TranslateDemo() {
  const [input, setInput] = useState("Hello, how are you?");
  const [output, setOutput] = useState("");
  const [lang, setLang] = useState("sn");
  const [loading, setLoading] = useState(false);

  const handleTranslate = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input, targetLang: lang }),
      });

      const data = await res.json();
      if (data.translatedText) {
        setOutput(data.translatedText);
      } else {
        setOutput("⚠️ Translation failed");
      }
    } catch (err) {
      console.error(err);
      setOutput("❌ Error calling translation API");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50 text-gray-900">
      <h1 className="text-2xl font-bold mb-6">🌍 Translation Demo</h1>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        rows={3}
        className="w-full max-w-md border rounded p-2 mb-4"
      />

      <div className="flex space-x-3 mb-4">
        <select
          value={lang}
          onChange={(e) => setLang(e.target.value)}
          className="border rounded p-2"
        >
          <option value="sn">Shona</option>
          <option value="fr">French</option>
          <option value="es">Spanish</option>
          <option value="de">German</option>
          <option value="pt">Portuguese</option>
          <option value="zh">Chinese</option>
        </select>

        <button
          onClick={handleTranslate}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Translating..." : "Translate"}
        </button>
      </div>

      {output && (
        <div className="w-full max-w-md p-4 border rounded bg-white shadow">
          <p className="font-semibold">Translated Text:</p>
          <p className="mt-2 text-lg">{output}</p>
        </div>
      )}
    </div>
  );
}
