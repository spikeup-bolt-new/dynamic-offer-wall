import React from 'react';
import { Building2 } from 'lucide-react';

interface BrandFilterProps {
  brands: string[];
  selectedBrand: string;
  onBrandChange: (brand: string) => void;
}

export function BrandFilter({ brands, selectedBrand, onBrandChange }: BrandFilterProps) {
  return (
    <div className="flex items-center gap-2">
      <Building2 className="h-5 w-5 text-gray-400" />
      <select
        value={selectedBrand}
        onChange={(e) => onBrandChange(e.target.value)}
        className="rounded-lg border border-gray-300 py-2 px-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
      >
        <option value="">All Brands</option>
        {brands.map((brand) => (
          <option key={brand} value={brand}>
            {brand}
          </option>
        ))}
      </select>
    </div>
  );
}