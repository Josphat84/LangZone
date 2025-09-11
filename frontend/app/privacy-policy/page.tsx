"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import i18n from "@/lib/i18n"; // existing i18.js
import { useTranslation } from "react-i18next";

export default function PrivacyPolicyPage() {
  const { t } = useTranslation();
  const [lang, setLang] = useState(i18n.language || "en");

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setLang(lng);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      <header className="container mx-auto px-4 sm:px-6 py-8 flex justify-between items-center max-w-4xl">
        <h1 className="text-4xl font-extrabold text-gray-900">
          {t("privacyPolicyTitle")}
        </h1>
        <div className="space-x-2">
          {["en", "fr", "sn"].map((lng) => (
            <button
              key={lng}
              onClick={() => changeLanguage(lng)}
              className={`px-3 py-1 rounded ${
                lang === lng
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              {lng.toUpperCase()}
            </button>
          ))}
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 py-8 md:py-12 max-w-4xl">
        <Card className="bg-white border border-gray-100 shadow-md rounded-xl">
          <CardContent className="p-6 md:p-8 space-y-6">
            <p className="text-lg text-gray-700">{t("privacyPolicyIntro")}</p>
            <h2 className="text-2xl font-bold mt-6 mb-4">
              {t("section1Title")}
            </h2>
            <p className="text-base text-gray-700 leading-relaxed">
              {t("section1Content")}
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
