"use client";
import { useTranslation } from "@/app/context/TranslationContext";

export default function LanguageSwitcher() {
  const { lang, setLang, availableLanguages } = useTranslation();

  return (
    <select
      value={lang}
      onChange={(e) => setLang(e.target.value)}
      className="border rounded p-2"
    >
      {availableLanguages.map((language) => (
        <option key={language.code} value={language.code}>
          {language.label}
        </option>
      ))}
    </select>
  );
}
