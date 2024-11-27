import React from 'react';
import { Globe } from 'lucide-react';

interface CountryFilterProps {
  countries: string[];
  selectedCountry: string;
  onCountryChange: (country: string) => void;
}

export function CountryFilter({ countries, selectedCountry, onCountryChange }: CountryFilterProps) {
  return (
    <div className="flex items-center gap-2">
      <Globe className="h-5 w-5 text-gray-400" />
      <select
        value={selectedCountry}
        onChange={(e) => onCountryChange(e.target.value)}
        className="rounded-lg border border-gray-300 py-2 px-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
      >
        <option value="">All Countries</option>
        {countries.map((country) => (
          <option key={country} value={country}>
            {country}
          </option>
        ))}
      </select>
    </div>
  );
}