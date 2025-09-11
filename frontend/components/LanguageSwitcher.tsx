"use client";

import { useTranslation } from "react-i18next";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// List of 9 languages with flags
const languages = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "sn", label: "Shona", flag: "🇿🇼" },
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "de", label: "Deutsch", flag: "🇩🇪" },
  { code: "pt", label: "Português", flag: "🇵🇹" },
  { code: "zh", label: "中文", flag: "🇨🇳" },
  { code: "ko", label: "한국어", flag: "🇰🇷" },
  { code: "ja", label: "日本語", flag: "🇯🇵" },
];

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  return (
    <div className="w-[140px] md:w-[180px]">
      <Select
        onValueChange={(value) => i18n.changeLanguage(value)}
        defaultValue={i18n.language}
      >
        <SelectTrigger className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm h-9 px-2 py-1 text-sm hover:border-gray-400 dark:hover:border-gray-600 transition-all duration-200">
          <SelectValue placeholder="🌐" />
        </SelectTrigger>

        <SelectContent className="bg-white dark:bg-gray-800 text-sm shadow-lg rounded-md">
          {languages.map((lang) => (
            <SelectItem
              key={lang.code}
              value={lang.code}
              className="flex items-center gap-2 px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
            >
              <span className="text-lg transform transition-transform duration-200 hover:scale-125">
                {lang.flag}
              </span>
              <span className="hidden md:inline">{lang.label}</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
