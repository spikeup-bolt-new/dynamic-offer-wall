import React from 'react';
import { Tag } from 'lucide-react';

interface OfferTypeFilterProps {
  offerTypes: string[];
  selectedOfferType: string;
  onOfferTypeChange: (offerType: string) => void;
}

export function OfferTypeFilter({ offerTypes, selectedOfferType, onOfferTypeChange }: OfferTypeFilterProps) {
  return (
    <div className="flex items-center gap-2">
      <Tag className="h-5 w-5 text-gray-400" />
      <select
        value={selectedOfferType}
        onChange={(e) => onOfferTypeChange(e.target.value)}
        className="rounded-lg border border-gray-300 py-2 px-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
      >
        <option value="">All Offer Types</option>
        {offerTypes.map((offerType) => (
          <option key={offerType} value={offerType}>
            {offerType.charAt(0).toUpperCase() + offerType.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
}