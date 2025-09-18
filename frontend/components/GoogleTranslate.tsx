'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import {
  Languages,
  Globe,
  ChevronDown,
  Check,
  Sparkles,
  Settings,
  Eye,
  EyeOff,
  RotateCcw,
  Info,
  ExternalLink,
  History,
  Sun,
  Moon,
  Clock,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Language {
  code: string;
  name: string;
  native: string;
  flag: string;
  popular: boolean;
}

interface GoogleTranslateProps {
  isMobile?: boolean;
  languages: Language[];
}

declare global {
  interface Window {
    google: any;
    googleTranslateElementInit: () => void;
  }
}

function GoogleTranslate({ isMobile = false, languages }: GoogleTranslateProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('en');
  const [isTranslating, setIsTranslating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isTranslationEnabled, setIsTranslationEnabled] = useState(true);
  const [showOriginal, setShowOriginal] = useState(false);
  const [recentLanguages, setRecentLanguages] = useState<string[]>(['en', 'es', 'fr']);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const googleTranslateRef = useRef<HTMLDivElement>(null);
  const initAttempts = useRef(0);
  const maxInitAttempts = 10;
  const [isDarkMode, setIsDarkMode] = useState(false);

  const filteredLanguages = languages.filter(
    (lang) =>
      lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lang.native.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const popularLanguages = filteredLanguages.filter((lang) => lang.popular);
  const otherLanguages = filteredLanguages.filter((lang) => !lang.popular);
  const recentLangs = recentLanguages.map((code) => languages.find((l) => l.code === code)).filter(Boolean);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const initializeGoogleTranslate = () => {
    console.log('🌍 Attempting to initialize Google Translate, attempt:', initAttempts.current + 1);

    if (window.google && window.google.translate && window.google.translate.TranslateElement) {
      try {
        const existingElement = document.getElementById('google_translate_element');
        if (existingElement) {
          existingElement.innerHTML = '';
        }
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            includedLanguages: languages.map((lang) => lang.code).join(','),
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false,
          },
          'google_translate_element'
        );
        console.log('✅ Google Translate initialized successfully');
        return true;
      } catch (error) {
        console.error('❌ Error initializing Google Translate:', error);
      }
    }

    initAttempts.current++;
    if (initAttempts.current < maxInitAttempts) {
      console.log('⏳ Retrying Google Translate initialization in 500ms...');
      setTimeout(initializeGoogleTranslate, 500);
    } else {
      console.error('❌ Failed to initialize Google Translate after maximum attempts');
    }
    return false;
  };

  useEffect(() => {
    const initImmediately = () => {
      const existingScript = document.querySelector('script[src*="translate.google.com"]');
      if (window.google && window.google.translate && existingScript) {
        setIsScriptLoaded(true);
        setTimeout(initializeGoogleTranslate, 100);
        return;
      }
      if (existingScript) {
        setIsScriptLoaded(true);
        existingScript.addEventListener('load', () => {
          setTimeout(initializeGoogleTranslate, 100);
        });
        return;
      }
      window.googleTranslateElementInit = () => {
        setIsScriptLoaded(true);
        setTimeout(initializeGoogleTranslate, 50);
      };
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      script.defer = false;
      document.head.appendChild(script);
    };
    initImmediately();
  }, []);

  useEffect(() => {
    if (!isScriptLoaded) return;
    const checkReadiness = () => {
      const selectElement = document.querySelector('select.goog-te-combo') as HTMLSelectElement;
      if (selectElement) {
        console.log('✅ Google Translate select element found, component is ready');
        setIsReady(true);
        return true;
      }
      return false;
    };
    if (checkReadiness()) return;
    const interval = setInterval(() => {
      if (checkReadiness()) {
        clearInterval(interval);
      }
    }, 500);
    const timeout = setTimeout(() => {
      clearInterval(interval);
      console.warn('⚠️ Timeout waiting for Google Translate to be ready');
    }, 10000);
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [isScriptLoaded]);

  const handleLanguageSelect = (langCode: string) => {
    if (!isTranslationEnabled) {
      console.warn('⚠️ Google Translate is disabled.');
      return;
    }

    setIsTranslating(true);
    setCurrentLang(langCode);

    const newRecent = [langCode, ...recentLanguages.filter((l) => l !== langCode)].slice(0, 5);
    setRecentLanguages(newRecent);

    const checkAndTranslate = (retries: number) => {
      const selectElement = document.querySelector('select.goog-te-combo') as HTMLSelectElement;

      if (selectElement) {
        console.log('🎯 Triggering translation to:', langCode);
        selectElement.value = langCode;
        const changeEvent = new Event('change', { bubbles: true });
        selectElement.dispatchEvent(changeEvent);
        setIsOpen(false);
        setTimeout(() => setIsTranslating(false), 1000);
      } else if (retries > 0) {
        console.log(`⏳ Element not found, retrying in 100ms... Retries left: ${retries - 1}`);
        setTimeout(() => checkAndTranslate(retries - 1), 100);
      } else {
        console.error('❌ Google Translate select element not found after multiple retries. The script may have failed to load.');
        setIsTranslating(false);
      }
    };
    
    checkAndTranslate(5);
  };

  const getCurrentLanguage = () => {
    return languages.find((lang) => lang.code === currentLang) || languages[0];
  };

  const resetTranslation = () => {
    handleLanguageSelect('en');
    setShowOriginal(false);
  };

  const toggleTranslation = () => {
    const newState = !isTranslationEnabled;
    setIsTranslationEnabled(newState);
    if (!newState) {
      resetTranslation();
    }
  };

  const toggleOriginalText = () => {
    setShowOriginal(!showOriginal);
    const googleBar = document.querySelector('.goog-te-banner-frame');
    if (googleBar) {
      (googleBar as HTMLElement).style.display = showOriginal ? 'block' : 'none';
    }
  };

  const openGoogleTranslateHelp = () => {
    window.open('https://support.google.com/translate', '_blank');
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark', !isDarkMode);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div id="google_translate_element" ref={googleTranslateRef} className="hidden" />
      <Button
        variant="ghost"
        onClick={() => setIsOpen(!isOpen)}
        className={`
          relative group transition-all duration-300 px-4 py-2 rounded-xl border-2
          ${
            isMobile
              ? 'w-full justify-start bg-teal-800/20 border-teal-700/30 text-white hover:bg-teal-700/30 hover:border-teal-600/50'
              : 'bg-teal-800/15 border-teal-700/25 text-white hover:bg-teal-700/25 hover:border-teal-600/40'
          }
          ${isOpen ? 'bg-teal-700/30 border-teal-600/50 shadow-2xl scale-105' : ''}
          backdrop-blur-sm shadow-lg
          ${isTranslating ? 'bg-teal-600/30 border-teal-500/50' : ''}
        `}
        title={!isReady ? 'Loading Google Translate...' : 'Choose language to translate'}
      >
        <div className="flex items-center gap-2">
          <div className="relative flex items-center justify-center w-6 h-6">
            {!isReady ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <Globe className="w-4 h-4 text-teal-900" />
              </motion.div>
            ) : isTranslating ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 flex items-center justify-center text-teal-400"
              >
                <Sparkles className="w-4 h-4" />
              </motion.div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-teal-600">
                <Globe className="w-4 h-4" />
              </div>
            )}
            <div className="absolute top-[50%] left-[50%] -translate-x-1/2 translate-y-[-50%] text-sm drop-shadow-sm pointer-events-none">
              {getCurrentLanguage().flag}
            </div>
          </div>

          <div className="flex flex-col items-start">
            <span className="text-xs font-medium text-white/90 drop-shadow-sm">
              {!isReady ? 'Loading...' : isTranslationEnabled ? 'Translate' : 'Disabled'}
            </span>
            <span className="text-sm font-bold text-white drop-shadow-sm">
              {!isReady ? 'Please wait' : getCurrentLanguage().native}
            </span>
          </div>

          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="bg-white/20 rounded-full p-1"
          >
            <ChevronDown className={`w-3 h-3 text-white ${!isReady ? 'opacity-30' : ''}`} />
          </motion.div>
        </div>

        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-teal-500/30 via-teal-600/30 to-teal-700/30 rounded-xl"
          animate={{
            backgroundPosition: isTranslating ? ['0% 50%', '100% 50%', '0% 50%'] : '0% 50%',
          }}
          transition={{
            duration: 2,
            repeat: isTranslating ? Infinity : 0,
            ease: 'linear',
          }}
          style={{
            backgroundSize: '200% 200%',
          }}
        />

      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className={`
              absolute top-full mt-2 z-[70]
              ${isMobile ? 'left-0 right-0' : 'right-0 w-96'}
            `}
          >
            <Card className="shadow-2xl border-0 bg-white/98 dark:bg-gray-900/98 backdrop-blur-xl">
              <CardContent className="p-0">
                <div className="p-4 border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-teal-50 via-teal-100 to-teal-50 dark:from-teal-950 dark:via-teal-900 dark:to-teal-950">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Languages className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                      <span className="font-semibold text-gray-800 dark:text-gray-200">Google Translate</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={openGoogleTranslateHelp}
                        className="text-xs text-teal-600 dark:text-teal-400 hover:text-teal-700 hover:bg-teal-50 dark:hover:text-teal-300 dark:hover:bg-teal-900 p-1"
                      >
                        <Info className="w-3 h-3 mr-1" />
                        Help
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Settings className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Translation</span>
                      </div>
                      <Switch
                        checked={isTranslationEnabled}
                        onCheckedChange={toggleTranslation}
                        className="data-[state=checked]:bg-teal-600 dark:data-[state=checked]:bg-teal-500"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {isDarkMode ? (
                          <Moon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        ) : (
                          <Sun className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        )}
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Theme</span>
                      </div>
                      <Switch
                        checked={isDarkMode}
                        onCheckedChange={toggleDarkMode}
                        className="data-[state=checked]:bg-teal-600 dark:data-[state=checked]:bg-teal-500"
                      />
                    </div>

                    <Separator className="bg-gray-200 dark:bg-gray-700" />

                    {isTranslationEnabled && currentLang !== 'en' && (
                      <>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {showOriginal ? (
                              <Eye className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                            ) : (
                              <EyeOff className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                            )}
                            <span className="text-sm text-gray-700 dark:text-gray-300">Show Original</span>
                          </div>
                          <Switch
                            checked={showOriginal}
                            onCheckedChange={toggleOriginalText}
                            className="data-[state=checked]:bg-teal-600 dark:data-[state=checked]:bg-teal-500"
                          />
                        </div>

                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={resetTranslation}
                            className="flex-1 text-xs hover:bg-gray-50 dark:hover:bg-gray-800"
                          >
                            <RotateCcw className="w-3 h-3 mr-1" />
                            Reset to English
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.location.reload()}
                            className="flex-1 text-xs hover:bg-gray-50 dark:hover:bg-gray-800"
                          >
                            <ExternalLink className="w-3 h-3 mr-1" />
                            Reload Page
                          </Button>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="mt-3">
                    <input
                      type="text"
                      placeholder="Search languages..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400 dark:bg-gray-800 dark:text-gray-200"
                      disabled={!isTranslationEnabled}
                    />
                  </div>
                </div>

                {isTranslationEnabled && (
                  <div className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-gray-100 dark:scrollbar-track-gray-800">
                    {recentLangs.length > 0 && !searchQuery && (
                      <div className="p-2">
                        <div className="flex items-center gap-2 px-2 py-1 mb-2">
                          <History className="w-3 h-3 text-gray-500 dark:text-gray-400" />
                          <Badge variant="secondary" className="text-xs bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-200">
                            Recent
                          </Badge>
                        </div>
                        <div className="space-y-1">
                          {recentLangs.slice(0, 3).map((language) => (
                            <LanguageItem
                              key={`recent-${language?.code}`}
                              language={language!}
                              isSelected={currentLang === language?.code}
                              onClick={() => handleLanguageSelect(language?.code || 'en')}
                              fullWidth
                              variant="recent"
                              isReady={isReady}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {popularLanguages.length > 0 && !searchQuery && (
                      <div className="p-2">
                        {recentLangs.length > 0 && <Separator className="mb-2 bg-gray-200 dark:bg-gray-700" />}
                        <div className="flex items-center gap-2 px-2 py-1 mb-2">
                          <Badge variant="secondary" className="text-xs bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-200">
                            Popular
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-1">
                          {popularLanguages.map((language) => (
                            <LanguageItem
                              key={language.code}
                              language={language}
                              isSelected={currentLang === language.code}
                              onClick={() => handleLanguageSelect(language.code)}
                              fullWidth
                              isReady={isReady}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {otherLanguages.length > 0 && (
                      <div className="p-2">
                        {!searchQuery && popularLanguages.length > 0 && <Separator className="mb-2 bg-gray-200 dark:bg-gray-700" />}
                        <div className="space-y-1">
                          {otherLanguages.map((language) => (
                            <LanguageItem
                              key={language.code}
                              language={language}
                              isSelected={currentLang === language.code}
                              onClick={() => handleLanguageSelect(language.code)}
                              fullWidth
                              isReady={isReady}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {filteredLanguages.length === 0 && (
                      <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                        <Languages className="w-8 h-8 mx-auto mb-2 opacity-30" />
                        <p className="text-sm">No languages found</p>
                      </div>
                    )}
                  </div>
                )}

                <div className="p-3 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
                  <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <img
                      src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTggMEMzLjU4IDAgMCAzLjU4IDAgOEM0LjQxIDEyIDggOC40MSA4IDhDOCA4LjQxIDExLjU5IDEyIDE2IDhDMTYgMy41OCAxMi40MiAwIDggMFoiIGZpbGw9IiM0Mjg1RjQiLz4KPHBhdGggZD0iTTUuNSA1aDEwLjVWN2g1LjVWMTBoLTUuNVY4WiIgZmlsbD0id2hpdGUiLz4KPHBhdGggZD0iTTUuNSA4aDEwLjVWMTBoLTYuNVY4WiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+Cg=="
                      alt="Google Translate"
                      className="w-4 h-4"
                    />
                    <span>Powered by Google Translate</span>
                    {isTranslationEnabled && (
                      <Badge variant="outline" className="ml-2 text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                        Status: {isReady ? 'Ready' : 'Loading...'}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface LanguageItemProps {
  language: Language;
  isSelected: boolean;
  onClick: () => void;
  fullWidth?: boolean;
  variant?: 'default' | 'recent';
  isReady: boolean;
}

function LanguageItem({ language, isSelected, onClick, fullWidth = false, variant = 'default', isReady }: LanguageItemProps) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`
        relative p-3 rounded-lg transition-all duration-200 text-left
        ${fullWidth ? 'w-full' : ''}
        ${
          isSelected
            ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-lg'
            : variant === 'recent'
            ? 'hover:bg-teal-50 dark:hover:bg-teal-900 text-gray-700 dark:text-gray-300 hover:shadow-sm border border-teal-200/50 dark:border-teal-700/50'
            : 'hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 hover:shadow-sm'
        }
        ${!isReady && 'opacity-60 cursor-not-allowed'}
      `}
      disabled={!isReady}
    >
      <div className="flex items-center gap-3">
        <span className="text-xl flex-shrink-0">{language.flag}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm truncate">{language.name}</span>
            {isReady ? (
              <Check className="w-4 h-4 flex-shrink-0 text-green-500" />
            ) : (
              <Clock className="w-4 h-4 flex-shrink-0 text-gray-400 animate-spin" />
            )}
          </div>
          <span className={`text-xs ${isSelected ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'} truncate`}>{language.native}</span>
        </div>
      </div>
    </motion.button>
  );
}

export { GoogleTranslate };