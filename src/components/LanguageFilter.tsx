import React from 'react';
import { Languages } from 'lucide-react';

interface LanguageFilterProps {
  languages: string[];
  selectedLanguage: string;
  onLanguageChange: (language: string) => void;
}

export function LanguageFilter({ languages, selectedLanguage, onLanguageChange }: LanguageFilterProps) {
  return (
    <div className="flex items-center gap-2">
      <Languages className="h-5 w-5 text-gray-400" />
      <select
        value={selectedLanguage}
        onChange={(e) => onLanguageChange(e.target.value)}
        className="rounded-lg border border-gray-300 py-2 px-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
      >
        <option value="">All Languages</option>
        {languages.map((language) => (
          <option key={language} value={language}>
            {language}
          </option>
        ))}
      </select>
    </div>
  );
}