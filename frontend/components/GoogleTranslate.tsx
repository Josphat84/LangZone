'use client';

import React, { useEffect } from 'react';

interface GoogleTranslateProps {
  isMobile?: boolean;
}

const GoogleTranslate: React.FC<GoogleTranslateProps> = ({ isMobile = false }) => {
  useEffect(() => {
    // Load the Google Translate script
    const addScript = () => {
      const script = document.createElement('script');
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);
    };

    // Initialize Google Translate
    (window as any).googleTranslateElementInit = () => {
      new (window as any).google.translate.TranslateElement(
        {
          pageLanguage: 'en',
          layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false,
        },
        'google_translate_element'
      );
    };

    if (!(window as any).google) {
      addScript();
    } else {
      (window as any).googleTranslateElementInit();
    }
  }, []);

  return (
    <div className={`w-full ${isMobile ? 'mt-2' : ''}`}>
      <div id="google_translate_element" className="w-full"></div>

      <style>{`
        /* Hide top banner */
        .goog-te-banner-frame.skiptranslate { display: none !important; }
        body { top: 0 !important; }

        /* Hide Google logo/link */
        .goog-logo-link, .goog-te-gadget span { display: none !important; }

        /* Style the dropdown */
        #google_translate_element select {
          padding: 0.25rem 0.5rem;
          border-radius: 0.5rem;
          border: 1px solid #9ca3af; /* Tailwind gray-400 */
          background-color: #ffffff; /* header bg */
          color: #111827; /* Tailwind gray-900 */
          font-size: 0.875rem;
          line-height: 1.25rem;
          cursor: pointer;
        }

        #google_translate_element select:focus {
          outline: none;
          border-color: #14b8a6; /* Tailwind teal-500 */
          box-shadow: 0 0 0 2px rgba(20,184,166,0.3);
        }
      `}</style>
    </div>
  );
};

export default GoogleTranslate;
