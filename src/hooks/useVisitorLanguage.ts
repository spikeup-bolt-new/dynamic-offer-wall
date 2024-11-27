import { useState, useEffect } from 'react';

// Map of language codes to full names matching the offers data
const languageCodeMap: Record<string, string> = {
  'en': 'English',
  'de': 'German',
  'es': 'Spanish',
  'fr': 'French',
  'it': 'Italian',
  'pt': 'Portuguese',
  'sv': 'Swedish',
  // Add more mappings as needed
};

export function useVisitorLanguage() {
  const [visitorLanguage, setVisitorLanguage] = useState<string>('');

  useEffect(() => {
    // Get browser language code (e.g., 'en-US' -> 'en')
    const browserLang = navigator.language.split('-')[0].toLowerCase();
    const mappedLanguage = languageCodeMap[browserLang] || 'English'; // Default to English if not mapped
    setVisitorLanguage(mappedLanguage);
  }, []);

  return { visitorLanguage };
}