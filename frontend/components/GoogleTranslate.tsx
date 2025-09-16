'use client';

import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Globe, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

declare global {
  interface Window {
    google: any;
    googleTranslateElementInit: () => void;
  }
}

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
  { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  { code: 'pl', name: 'Polski', flag: '🇵🇱' },
  { code: 'uk', name: 'Українська', flag: '🇺🇦' },
  { code: 'cs', name: 'Čeština', flag: '🇨🇿' },
  { code: 'sk', name: 'Slovenčina', flag: '🇸🇰' },
  { code: 'hu', name: 'Magyar', flag: '🇭🇺' },
  { code: 'ro', name: 'Română', flag: '🇷🇴' },
  { code: 'bg', name: 'Български', flag: '🇧🇬' },
  { code: 'hr', name: 'Hrvatski', flag: '🇭🇷' },
  { code: 'sr', name: 'Српски', flag: '🇷🇸' },
  { code: 'fi', name: 'Suomi', flag: '🇫🇮' },
  { code: 'sw', name: 'Kiswahili', flag: '🇹🇿' },
  { code: 'am', name: 'አማርኛ (Amharic)', flag: '🇪🇹' },
  { code: 'zu', name: 'isiZulu', flag: '🇿🇦' },
  { code: 'af', name: 'Afrikaans', flag: '🇿🇦' },
  { code: 'ha', name: 'Hausa', flag: '🇳🇬' },
  { code: 'yo', name: 'Yorùbá', flag: '🇳🇬' },
  { code: 'sn', name: 'chiShona', flag: '🇿🇼' },
];

export default function GoogleTranslate() {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!document.querySelector('#google-translate-script')) {
      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);

      window.googleTranslateElementInit = () => {
        if (window.google && window.google.translate) {
          new window.google.translate.TranslateElement(
            {
              pageLanguage: 'en',
              includedLanguages: languages.map(lang => lang.code).join(','),
              layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
              autoDisplay: false,
              multilanguagePage: true,
            },
            // Initialize on a hidden div
            'google_translate_element_hidden'
          );
        }
      };
    }

    const style = document.createElement('style');
    style.innerHTML = `
      .goog-te-banner-frame.skiptranslate,
      .goog-te-gadget,
      .goog-te-combo,
      #google_translate_element_hidden {
        display: none !important;
      }
      body {
        top: 0px !important;
      }
      iframe.goog-te-menu-frame {
        z-index: 99999 !important;
      }
      .skiptranslate.goog-te-gadget {
        display: none !important;
      }
    `;
    document.head.appendChild(style);

    const storedLang = localStorage.getItem('preferred-translate-language');
    const urlLang = window.location.href.match(/#googtrans\(en\|(.+?)\)/);
    
    if (storedLang && storedLang !== 'en') {
      translatePage(storedLang);
    } else if (urlLang) {
      setCurrentLanguage(urlLang[1]);
    }
  }, []);

  const filteredLanguages = languages.filter(lang =>
    lang.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lang.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const translatePage = (languageCode: string) => {
    const lang = languages.find(l => l.code === languageCode);
    if (lang) {
      setCurrentLanguage(lang.code);
    }
    setIsOpen(false);
    setSearchTerm('');

    if (languageCode === 'en') {
      const url = window.location.href;
      const cleanUrl = url.split('#googtrans')[0];
      localStorage.setItem('preferred-translate-language', 'en');
      if (url !== cleanUrl) {
        window.history.replaceState({}, document.title, cleanUrl);
        window.location.reload();
      }
      return;
    }

    const combo = document.querySelector('.goog-te-combo') as HTMLSelectElement;
    if (combo) {
      combo.value = languageCode;
      combo.dispatchEvent(new Event('change'));
      localStorage.setItem('preferred-translate-language', languageCode);
      return;
    }

    const currentUrl = window.location.href;
    const baseUrl = currentUrl.split('#googtrans')[0];
    const newUrl = `${baseUrl}#googtrans(en|${languageCode})`;
    
    if (currentUrl !== newUrl) {
      window.location.href = newUrl;
      localStorage.setItem('preferred-translate-language', languageCode);
    }
  };

  return (
    <div className="relative z-[60]">
      {/* Hidden div for Google Translate to initialize on */}
      <div id="google_translate_element_hidden" className="hidden"></div>
      
      <Select open={isOpen} onOpenChange={setIsOpen} value={currentLanguage} onValueChange={translatePage}>
        <SelectTrigger className="w-[160px] bg-background/50 dark:bg-zinc-800/50 backdrop-blur-sm border-zinc-200/50 dark:border-zinc-700/50 text-foreground transition-all focus:ring-1 focus:ring-teal-500 hover:bg-background/60 dark:hover:bg-zinc-700/60 shadow-md rounded-full px-4 py-2">
          <div className="flex items-center gap-2 font-medium">
            <Globe className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
            <SelectValue placeholder="Translate" />
          </div>
        </SelectTrigger>
        <SelectContent className="w-[280px] bg-background/90 dark:bg-zinc-900/90 backdrop-blur-md p-0 rounded-xl shadow-lg border border-zinc-200/50 dark:border-zinc-800/50">
          <div className="p-3 border-b border-border relative">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search languages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-9 bg-transparent border-none focus:ring-2 focus:ring-teal-500 focus:bg-background/50"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          
          <div className="max-h-[300px] overflow-y-auto">
            {filteredLanguages.length > 0 ? (
              filteredLanguages.map((lang) => (
                <SelectItem 
                  key={lang.code} 
                  value={lang.code}
                  className="hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50 cursor-pointer py-3 transition-colors text-base"
                >
                  <div className="flex items-center gap-3 w-full">
                    <span className="text-xl flex-shrink-0">{lang.flag}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-foreground truncate">
                        {lang.name}
                      </div>
                      <div className="text-xs text-muted-foreground uppercase">
                        {lang.code}
                      </div>
                    </div>
                  </div>
                </SelectItem>
              ))
            ) : (
              <div className="p-4 text-center text-muted-foreground text-sm">
                No languages found matching "{searchTerm}"
              </div>
            )}
          </div>
        </SelectContent>
      </Select>
    </div>
  );
}