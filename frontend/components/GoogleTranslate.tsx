'use client';

import React, { useEffect, useRef, useState } from 'react';

interface GoogleTranslateProps {
  isMobile: boolean;
}

declare global {
  interface Window {
    google: any;
    googleTranslateElementInit: () => void;
  }
}

export default function GoogleTranslate({ isMobile }: GoogleTranslateProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (loaded) return;

    const script = document.createElement('script');
    script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    document.body.appendChild(script);

    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: 'en',
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false,
        },
        'google_translate_element'
      );
    };

    setLoaded(true);
  }, [loaded]);

  // Elegant Tailwind styling for the dropdown
  useEffect(() => {
    const interval = setInterval(() => {
      const select = containerRef.current?.querySelector<HTMLSelectElement>('select');
      if (select) {
        // Base style
        select.style.width = '100%';
        select.style.padding = '0.5rem 0.75rem';
        select.style.borderRadius = '0.5rem';
        select.style.border = '1px solid #d1d5db'; // Tailwind gray-300
        select.style.backgroundColor = '#ffffff';
        select.style.color = '#111827'; // Tailwind gray-900
        select.style.fontSize = '0.875rem';
        select.style.fontWeight = '500';
        select.style.cursor = 'pointer';
        select.style.transition = 'all 0.3s ease';
        select.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';

        // Hover and focus effects
        select.addEventListener('mouseover', () => {
          select.style.borderColor = '#14b8a6'; // teal-400
          select.style.boxShadow = '0 4px 12px rgba(20,184,166,0.15)';
        });
        select.addEventListener('mouseout', () => {
          select.style.borderColor = '#d1d5db';
          select.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
        });
        select.onfocus = () => {
          select.style.outline = 'none';
          select.style.borderColor = '#14b8a6';
          select.style.boxShadow = '0 0 0 2px rgba(20,184,166,0.3)';
        };

        clearInterval(interval);
      }
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      id="google_translate_element"
      ref={containerRef}
      className={`transition-all duration-300 ${
        isMobile ? 'w-full' : 'max-w-[180px]'
      } rounded-md`}
    ></div>
  );
}
