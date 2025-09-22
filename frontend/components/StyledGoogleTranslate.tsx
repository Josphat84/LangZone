'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Globe, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface StyledGoogleTranslateProps {
  isMobile?: boolean;
}

declare global {
  interface Window {
    google: any;
    googleTranslateElementInit: () => void;
  }
}

export default function StyledGoogleTranslate({ isMobile = false }: StyledGoogleTranslateProps) {
  const googleTranslateRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentLang, setCurrentLang] = useState('English');

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
      if (window.google && window.google.translate && googleTranslateRef.current) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            // Remove includedLanguages to show ALL languages that Google Translate supports
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false,
            gaTrack: true,
            gaId: 'UA-XXXXXXX-X' // Replace with your GA ID if needed
          },
          googleTranslateRef.current
        );
        setIsLoaded(true);
        
        // Apply custom styles after initialization
        setTimeout(() => {
          applyCustomStyles();
          setupLanguageDetection();
        }, 1000);
      }
    };

    // If Google Translate is already loaded
    if (window.google && window.google.translate) {
      window.googleTranslateElementInit();
    }

    return () => {
      // Cleanup is handled by React
    };
  }, []);

  const applyCustomStyles = () => {
    const style = document.createElement('style');
    style.innerHTML = `
      /* Hide Google Translate branding and banner */
      .goog-te-banner-frame.skiptranslate {
        display: none !important;
      }
      
      /* Remove Google Translate top banner */
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
      
      /* Remove Google branding text */
      .goog-te-gadget .goog-te-gadget-simple {
        background: transparent !important;
        border: none !important;
      }
      
      .goog-te-gadget .goog-te-gadget-simple .goog-te-menu-value span:first-child {
        display: none !important;
      }
      
      /* Additional cleanup */
      .goog-te-gadget img {
        display: none !important;
      }
      
      .goog-te-gadget-simple {
        background-color: transparent !important;
        border: none !important;
      }
      
      /* Force consistent styling */
      .goog-te-gadget * {
        font-family: inherit !important;
      }
      
      /* Fix for mobile dropdown behavior */
      ${isMobile ? `
        @media (max-width: 768px) {
          .goog-te-gadget .goog-te-combo {
            font-size: 16px !important;
            line-height: 1.5 !important;
          }
        }
      ` : ''}
      
      /* Additional overrides for stubborn Google styles */
      .goog-te-gadget-simple .goog-te-menu-value {
        color: white !important;
      }
      
      .goog-te-gadget-simple .goog-te-menu-value > span {
        color: white !important;
      }
    `;
    document.head.appendChild(style);
    
    // Apply styles with a delay to ensure Google Translate elements are loaded
    setTimeout(() => {
      const combo = document.querySelector('.goog-te-combo');
      if (combo) {
        (combo as HTMLElement).style.setProperty('background', 
          isMobile 
            ? 'rgba(255, 255, 255, 0.1)' 
            : 'rgba(255, 255, 255, 0.1)', 
          'important'
        );
        (combo as HTMLElement).style.setProperty('color', 'white', 'important');
        (combo as HTMLElement).style.setProperty('border', '1px solid rgba(255, 255, 255, 0.2)', 'important');
        (combo as HTMLElement).style.setProperty('border-radius', '8px', 'important');
      }
    }, 1500);
  };

  const setupLanguageDetection = () => {
    const observer = new MutationObserver(() => {
      const select = googleTranslateRef.current?.querySelector('.goog-te-combo') as HTMLSelectElement;
      if (select) {
        const selectedOption = select.options[select.selectedIndex];
        if (selectedOption) {
          setCurrentLang(selectedOption.text);
        }
      }
    });

    if (googleTranslateRef.current) {
      observer.observe(googleTranslateRef.current, {
        childList: true,
        subtree: true,
        attributes: true
      });
    }

    return () => observer.disconnect();
  };

  if (isMobile) {
    return (
      <div className="w-full">
        <div className="flex items-center gap-3 mb-2">
          <Globe className="h-5 w-5 text-white/70" />
          <span className="text-sm font-medium text-white/70">Translate Page</span>
        </div>
        <div 
          ref={googleTranslateRef}
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
          ref={googleTranslateRef}
          className="relative"
          style={{ 
            filter: isLoaded ? 'none' : 'opacity(0)',
            transition: 'filter 0.3s ease'
          }}
        />
        {!isLoaded && (
          <div className="animate-pulse">
            <div className="bg-white/10 h-8 w-32 rounded-lg border border-white/20"></div>
          </div>
        )}
      </div>
    </div>
  );
}