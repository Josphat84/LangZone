'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Globe, ChevronDown, Search, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

// Renamed the interface to match the new component name
interface StyledGoogleTranslateProps { 
  isMobile?: boolean;
  mode?: 'searchable' | 'styled' | 'auto';
}

interface Language {
  code: string;
  name: string;
  flag: string;
}

// Comprehensive language list with flags
const LANGUAGES: Language[] = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'it', name: 'Italian', flag: '🇮🇹' },
  { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', flag: '🇰🇷' },
  { code: 'zh', name: 'Chinese (Simplified)', flag: '🇨🇳' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
  { code: 'th', name: 'Thai', flag: '🇹🇭' },
  { code: 'vi', name: 'Vietnamese', flag: '🇻🇳' },
  { code: 'tr', name: 'Turkish', flag: '🇹🇷' },
  { code: 'pl', name: 'Polish', flag: '🇵🇱' },
  { code: 'nl', name: 'Dutch', flag: '🇳🇱' },
  { code: 'sv', name: 'Swedish', flag: '🇸🇪' },
  { code: 'da', name: 'Danish', flag: '🇩🇰' },
  { code: 'no', name: 'Norwegian', flag: '🇳🇴' },
  { code: 'fi', name: 'Finnish', flag: '🇫🇮' },
  { code: 'el', name: 'Greek', flag: '🇬🇷' },
  { code: 'he', name: 'Hebrew', flag: '🇮🇱' },
  { code: 'hu', name: 'Hungarian', flag: '🇭🇺' },
  { code: 'cs', name: 'Czech', flag: '🇨🇿' },
  { code: 'sk', name: 'Slovak', flag: '🇸🇰' },
  { code: 'ro', name: 'Romanian', flag: '🇷🇴' },
  { code: 'bg', name: 'Bulgarian', flag: '🇧🇬' },
  { code: 'hr', name: 'Croatian', flag: '🇭🇷' },
  { code: 'sr', name: 'Serbian', flag: '🇷🇸' },
  { code: 'sl', name: 'Slovenian', flag: '🇸🇮' },
  { code: 'et', name: 'Estonian', flag: '🇪🇪' },
  { code: 'lv', name: 'Latvian', flag: '🇱🇻' },
  { code: 'lt', name: 'Lithuanian', flag: '🇱🇹' },
  { code: 'mt', name: 'Maltese', flag: '🇲🇹' },
  { code: 'is', name: 'Icelandic', flag: '🇮🇸' },
  { code: 'ga', name: 'Irish', flag: '🇮🇪' },
  { code: 'cy', name: 'Welsh', flag: '🏴󠁧󠁢󠁷󠁬󠁳󠁿' },
  { code: 'eu', name: 'Basque', flag: '🏴󠁧󠁢󠁢󠁡󠁳󠁿' },
  { code: 'ca', name: 'Catalan', flag: '🏴󠁧󠁢󠁣󠁡󠁴󠁿' },
  { code: 'gl', name: 'Galician', flag: '🏴󠁧󠁢󠁧󠁡󠁬󠁿' },
  { code: 'uk', name: 'Ukrainian', flag: '🇺🇦' },
  { code: 'be', name: 'Belarusian', flag: '🇧🇾' },
  { code: 'mk', name: 'Macedonian', flag: '🇲🇰' },
  { code: 'sq', name: 'Albanian', flag: '🇦🇱' },
  { code: 'bn', name: 'Bengali', flag: '🇧🇩' },
  { code: 'ur', name: 'Urdu', flag: '🇵🇰' },
  { code: 'fa', name: 'Persian', flag: '🇮🇷' },
  { code: 'ps', name: 'Pashto', flag: '🇦🇫' },
  { code: 'ta', name: 'Tamil', flag: '🇱🇰' },
  { code: 'te', name: 'Telugu', flag: '🇮🇳' },
  { code: 'ml', name: 'Malayalam', flag: '🇮🇳' },
  { code: 'kn', name: 'Kannada', flag: '🇮🇳' },
  { code: 'gu', name: 'Gujarati', flag: '🇮🇳' },
  { code: 'pa', name: 'Punjabi', flag: '🇮🇳' },
  { code: 'mr', name: 'Marathi', flag: '🇮🇳' },
  { code: 'ne', name: 'Nepali', flag: '🇳🇵' },
  { code: 'si', name: 'Sinhala', flag: '🇱🇰' },
  { code: 'my', name: 'Myanmar (Burmese)', flag: '🇲🇲' },
  { code: 'km', name: 'Khmer', flag: '🇰🇭' },
  { code: 'lo', name: 'Lao', flag: '🇱🇦' },
  { code: 'ka', name: 'Georgian', flag: '🇬🇪' },
  { code: 'am', name: 'Amharic', flag: '🇪🇹' },
  { code: 'sw', name: 'Swahili', flag: '🇰🇪' },
  { code: 'zu', name: 'Zulu', flag: '🇿🇦' },
  { code: 'af', name: 'Afrikaans', flag: '🇿🇦' },
  { code: 'sn', name: 'Shona', flag: '🇿🇼' },
  { code: 'yo', name: 'Yoruba', flag: '🇳🇬' },
  { code: 'ig', name: 'Igbo', flag: '🇳🇬' },
  { code: 'ha', name: 'Hausa', flag: '🇳🇬' },
  { code: 'mg', name: 'Malagasy', flag: '🇲🇬' },
  { code: 'ny', name: 'Chichewa', flag: '🇲🇼' },
  { code: 'st', name: 'Sesotho', flag: '🇱🇸' },
  { code: 'tn', name: 'Setswana', flag: '🇧🇼' },
  { code: 'xh', name: 'Xhosa', flag: '🇿🇦' },
  { code: 'id', name: 'Indonesian', flag: '🇮🇩' },
  { code: 'ms', name: 'Malay', flag: '🇲🇾' },
  { code: 'tl', name: 'Filipino', flag: '🇵🇭' },
  { code: 'haw', name: 'Hawaiian', flag: '🏝️' },
  { code: 'mi', name: 'Maori', flag: '🇳🇿' },
  { code: 'sm', name: 'Samoan', flag: '🇼🇸' },
  { code: 'to', name: 'Tongan', flag: '🇹🇴' },
  { code: 'fj', name: 'Fijian', flag: '🇫🇯' },
];

declare global {
  interface Window {
    google: any;
    googleTranslateElementInit: () => void;
  }
}

// Renamed the function component to StyledGoogleTranslate
export default function StyledGoogleTranslate({ 
  isMobile = false, 
  mode = 'auto' 
}: StyledGoogleTranslateProps) {
  const googleTranslateRef = useRef<HTMLDivElement>(null);
  const styledTranslateRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<Language>(LANGUAGES[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [useSearchable, setUseSearchable] = useState(mode === 'searchable');

  // Auto-determine mode based on screen size if mode is 'auto'
  useEffect(() => {
    if (mode === 'auto') {
      // Use searchable on mobile for better UX, styled on desktop
      setUseSearchable(isMobile);
    } else {
      setUseSearchable(mode === 'searchable');
    }
  }, [mode, isMobile]);

  useEffect(() => {
    // Add Google Translate script
    if (!document.getElementById('google-translate-script')) {
      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);
    }

    // Initialize Google Translate
    window.googleTranslateElementInit = () => {
      if (window.google && window.google.translate) {
        // Initialize both versions
        if (googleTranslateRef.current) {
          new window.google.translate.TranslateElement(
            {
              pageLanguage: 'en',
              layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
              autoDisplay: false
            },
            googleTranslateRef.current
          );
        }

        if (styledTranslateRef.current) {
          new window.google.translate.TranslateElement(
            {
              pageLanguage: 'en',
              layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
              autoDisplay: false
            },
            styledTranslateRef.current
          );
        }

        setIsLoaded(true);
        
        setTimeout(() => {
          if (useSearchable) {
            hideGoogleWidget();
          } else {
            applyStyledTranslateCSS();
          }
        }, 1000);
      }
    };

    if (window.google && window.google.translate) {
      window.googleTranslateElementInit();
    }
  }, [useSearchable]);

  const hideGoogleWidget = () => {
    const style = document.createElement('style');
    style.id = 'hide-google-translate';
    style.innerHTML = `
      .goog-te-gadget {
        display: none !important;
      }
      .goog-te-banner-frame {
        display: none !important;
      }
      body {
        top: 0px !important;
      }
    `;
    if (!document.getElementById('hide-google-translate')) {
      document.head.appendChild(style);
    }
  };

  const applyStyledTranslateCSS = () => {
    // Remove hide styles first
    const hideStyle = document.getElementById('hide-google-translate');
    if (hideStyle) {
      hideStyle.remove();
    }

    const style = document.createElement('style');
    style.id = 'styled-google-translate';
    style.innerHTML = `
      /* Hide Google Translate branding and banner */
      .goog-te-banner-frame.skiptranslate {
        display: none !important;
      }
      
      body {
        top: 0px !important;
      }
      
      /* Style the main gadget container */
      .goog-te-gadget {
        font-family: inherit !important;
        font-size: 14px !important;
        color: inherit !important;
      }
      
      /* Style the dropdown select */
      .goog-te-gadget .goog-te-combo {
        background: ${isMobile 
          ? 'rgba(255, 255, 255, 0.1)' 
          : 'rgba(255, 255, 255, 0.1)'
        } !important;
        border: 1px solid rgba(255, 255, 255, 0.2) !important;
        border-radius: 8px !important;
        color: white !important;
        font-size: 14px !important;
        font-family: inherit !important;
        padding: ${isMobile ? '12px 40px 12px 16px' : '8px 32px 8px 12px'} !important;
        width: ${isMobile ? '100%' : 'auto'} !important;
        min-width: ${isMobile ? '200px' : '150px'} !important;
        backdrop-filter: blur(10px) !important;
        transition: all 0.2s ease !important;
        appearance: none !important;
        -webkit-appearance: none !important;
        -moz-appearance: none !important;
        cursor: pointer !important;
        height: ${isMobile ? '48px' : '36px'} !important;
      }
      
      .goog-te-gadget .goog-te-combo:hover {
        background: rgba(255, 255, 255, 0.15) !important;
        border-color: rgba(255, 255, 255, 0.3) !important;
        transform: translateY(-1px) !important;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
      }
      
      .goog-te-gadget .goog-te-combo:focus {
        outline: none !important;
        border-color: rgba(59, 130, 246, 0.5) !important;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1), 0 4px 12px rgba(0, 0, 0, 0.1) !important;
      }
      
      /* Style dropdown options */
      .goog-te-gadget .goog-te-combo option {
        background: #1f2937 !important;
        color: white !important;
        padding: 12px 16px !important;
        border: none !important;
        font-size: 14px !important;
        font-family: inherit !important;
      }
      
      .goog-te-gadget .goog-te-combo option:hover {
        background: #374151 !important;
      }
      
      /* Custom dropdown arrow */
      .goog-te-gadget .goog-te-combo {
        background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e") !important;
        background-repeat: no-repeat !important;
        background-position: right 12px center !important;
        background-size: 16px !important;
      }
      
      /* Hide the "Powered by" text and clean up gadget */
      .goog-te-gadget > span > a {
        display: none !important;
      }
      
      .goog-te-gadget > span {
        border: none !important;
        background: transparent !important;
      }
      
      .goog-te-gadget .goog-te-gadget-simple {
        background: transparent !important;
        border: none !important;
      }
      
      .goog-te-gadget img {
        display: none !important;
      }
      
      .goog-te-gadget-simple {
        background-color: transparent !important;
        border: none !important;
      }
      
      .goog-te-gadget * {
        font-family: inherit !important;
      }
      
      .goog-te-gadget-simple .goog-te-menu-value {
        color: white !important;
      }
      
      .goog-te-gadget-simple .goog-te-menu-value > span {
        color: white !important;
      }
    `;
    
    // Remove existing styled translate CSS
    const existingStyle = document.getElementById('styled-google-translate');
    if (existingStyle) {
      existingStyle.remove();
    }
    
    document.head.appendChild(style);
  };

  const triggerTranslation = (langCode: string) => {
    if (window.google && window.google.translate) {
      const selectElement = document.querySelector('.goog-te-combo') as HTMLSelectElement;
      if (selectElement) {
        const targetOption = Array.from(selectElement.options).find(
          option => option.value.includes(langCode)
        );
        
        if (targetOption) {
          selectElement.value = targetOption.value;
          selectElement.dispatchEvent(new Event('change'));
        }
      }
    }
  };

  const handleLanguageChange = (language: Language) => {
    setCurrentLanguage(language);
    setIsOpen(false);
    setSearchTerm('');
    
    setTimeout(() => {
      triggerTranslation(language.code);
    }, 100);
  };

  const filteredLanguages = LANGUAGES.filter(lang =>
    lang.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lang.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const clearSearch = () => {
    setSearchTerm('');
  };

  // Toggle between modes (for debugging/preference)
  const toggleMode = () => {
    setUseSearchable(!useSearchable);
    setTimeout(() => {
      if (!useSearchable) {
        hideGoogleWidget();
      } else {
        applyStyledTranslateCSS();
      }
    }, 100);
  };

  // SEARCHABLE VERSION
  if (useSearchable) {
    if (isMobile) {
      return (
        <div className="w-full">
          {/* Hidden Google Translate widgets */}
          <div ref={googleTranslateRef} style={{ display: 'none' }} />
          <div ref={styledTranslateRef} style={{ display: 'none' }} />
          
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <Button 
                variant="ghost" 
                className="w-full justify-start text-white hover:bg-white/10 border border-white/20 backdrop-blur-sm h-12"
              >
                <div className="flex items-center gap-3 w-full">
                  <Globe className="h-5 w-5" />
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{currentLanguage.flag}</span>
                    <span className="font-medium">{currentLanguage.name}</span>
                  </div>
                  <ChevronDown className="h-4 w-4 ml-auto" />
                </div>
              </Button>
            </PopoverTrigger>
            <PopoverContent 
              className="w-80 p-0 bg-white/95 backdrop-blur-lg border border-gray-200/50 shadow-xl"
              align="start"
            >
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-lg font-semibold">
                    <Globe className="h-5 w-5 text-teal-600" />
                    Choose Language
                  </div>
                  <button
                    onClick={toggleMode}
                    className="text-xs text-teal-600 hover:text-teal-700 underline"
                  >
                    Use Native
                  </button>
                </div>
                
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search languages..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-10 border-gray-200 focus:ring-teal-500 focus:border-teal-500"
                  />
                  {searchTerm && (
                    <button
                      onClick={clearSearch}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
              
              <ScrollArea className="h-64">
                <div className="p-2">
                  {filteredLanguages.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                      No languages found matching "{searchTerm}"
                    </div>
                  ) : (
                    filteredLanguages.map((language) => (
                      <button
                        key={language.code}
                        onClick={() => handleLanguageChange(language)}
                        className="w-full flex items-center justify-between py-3 px-3 rounded-md hover:bg-teal-50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{language.flag}</span>
                          <div className="text-left">
                            <div className="font-medium">{language.name}</div>
                            <div className="text-xs text-gray-500 uppercase">{language.code}</div>
                          </div>
                        </div>
                        {currentLanguage.code === language.code && (
                          <div className="flex items-center gap-1">
                            <Check className="h-4 w-4 text-teal-600" />
                            <span className="text-xs text-teal-600 font-medium">Active</span>
                          </div>
                        )}
                      </button>
                    ))
                  )}
                </div>
              </ScrollArea>
            </PopoverContent>
          </Popover>
        </div>
      );
    }

    // Desktop searchable version
    return (
      <div className="relative">
        <div ref={googleTranslateRef} style={{ display: 'none' }} />
        <div ref={styledTranslateRef} style={{ display: 'none' }} />
        
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button 
              variant="ghost" 
              className="text-white/90 hover:text-white hover:bg-white/10 border border-white/20 backdrop-blur-sm px-3 py-2 h-auto"
            >
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                <span className="text-lg">{currentLanguage.flag}</span>
                <span className="hidden lg:inline font-medium">{currentLanguage.name}</span>
                <ChevronDown className="h-3 w-3" />
              </div>
            </Button>
          </PopoverTrigger>
          <PopoverContent 
            className="w-96 p-0 bg-white/95 backdrop-blur-lg border border-gray-200/50 shadow-xl"
            align="end"
          >
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-lg font-semibold">
                  <Globe className="h-5 w-5 text-teal-600" />
                  Choose Your Language
                </div>
                <button
                  onClick={toggleMode}
                  className="text-xs text-teal-600 hover:text-teal-700 underline"
                >
                  Use Native
                </button>
              </div>
              
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search languages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-10 border-gray-200 focus:ring-teal-500 focus:border-teal-500"
                />
                {searchTerm && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
            
            <ScrollArea className="h-80">
              <div className="p-2">
                {filteredLanguages.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    No languages found matching "{searchTerm}"
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-1">
                    {filteredLanguages.map((language) => (
                      <button
                        key={language.code}
                        onClick={() => handleLanguageChange(language)}
                        className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-gradient-to-r hover:from-teal-50 hover:to-blue-50 transition-colors text-left"
                      >
                        <span className="text-xl">{language.flag}</span>
                        <div className="flex-1">
                          <div className="font-medium text-sm">{language.name}</div>
                          <div className="text-xs text-gray-500 uppercase">{language.code}</div>
                        </div>
                        {currentLanguage.code === language.code && (
                          <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </ScrollArea>
            
            <div className="p-3 border-t border-gray-200 bg-gray-50/50">
              <div className="text-xs text-center text-gray-500">
                🔍 {filteredLanguages.length} languages • Including Shona 🇿🇼
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    );
  }

  // STYLED NATIVE VERSION
  if (isMobile) {
    return (
      <div className="w-full">
        <div className="flex items-center gap-3 mb-2">
          <Globe className="h-5 w-5 text-white/70" />
          <span className="text-sm font-medium text-white/70">Translate Page</span>
          <button
            onClick={toggleMode}
            className="ml-auto text-xs text-white/50 hover:text-white/70 underline"
          >
            Use Search
          </button>
        </div>
        <div 
          ref={styledTranslateRef}
          className="relative"
          style={{ 
            filter: isLoaded ? 'none' : 'opacity(0)',
            transition: 'filter 0.3s ease'
          }}
        />
        {!isLoaded && (
          <div className="animate-pulse bg-white/10 h-12 rounded-lg border border-white/20"></div>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        <Globe className="h-4 w-4 text-white/80" />
        <div 
          ref={styledTranslateRef}
          className="relative"
          style={{ 
            filter: isLoaded ? 'none' : 'opacity(0)',
            transition: 'filter 0.3s ease'
          }}
        />
        <button
          onClick={toggleMode}
          className="ml-2 text-xs text-white/50 hover:text-white/70 underline"
        >
          Search
        </button>
        {!isLoaded && (
          <div className="animate-pulse bg-white/10 h-9 w-[150px] rounded-lg border border-white/20"></div>
        )}
      </div>
    </div>
  );
}