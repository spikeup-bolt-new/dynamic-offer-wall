import React, { useState } from 'react';
import { Star, Copy, Tag, Check } from 'lucide-react';
import type { Offer, CountryFlag, DepositMethod } from '../types/offers';
import { Carousel } from './Carousel';

interface OfferCardProps {
  offer: Offer;
}

const MAX_ITEMS_BEFORE_CAROUSEL = 6;

export function OfferCard({ offer }: OfferCardProps) {
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);

  const depositMethods = offer.deposits?.filter(deposit => 
    deposit.dark_url && deposit.dark_url.startsWith('http')
  ) || [];
  
  const countryFlags = offer.countries_flags?.filter(flag => 
    flag.url && flag.url.startsWith('http')
  ) || [];

  const handleCopyCode = async () => {
    if (!offer.coupon) return;

    try {
      await navigator.clipboard.writeText(offer.coupon);
      setCopied(true);
      setCopyError(false);
      
      // Reset copied state after 2 seconds
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to copy code:', error);
      setCopyError(true);
      
      // Reset error state after 2 seconds
      setTimeout(() => {
        setCopyError(false);
      }, 2000);
    }
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    if (img.parentElement) {
      img.parentElement.style.display = 'none';
    }
  };

  const renderFlags = () => {
    if (!countryFlags.length) return null;

    if (countryFlags.length <= MAX_ITEMS_BEFORE_CAROUSEL) {
      return (
        <div className="flex gap-1 flex-wrap">
          {countryFlags.map((flag, index) => (
            <div 
              key={`${flag.name}-${index}`}
              className="w-6 h-6 rounded-sm overflow-hidden bg-gray-100"
            >
              <img
                src={flag.url}
                alt={flag.name}
                title={flag.name}
                className="w-full h-full object-cover"
                onError={handleImageError}
                loading="lazy"
              />
            </div>
          ))}
        </div>
      );
    }

    return (
      <Carousel
        items={countryFlags}
        title="Countries"
        itemsToShow={MAX_ITEMS_BEFORE_CAROUSEL}
        renderItem={(flag: CountryFlag) => (
          <div className="w-6 h-6 rounded-sm overflow-hidden bg-gray-100">
            <img
              src={flag.url}
              alt={flag.name}
              title={flag.name}
              className="w-full h-full object-cover flex-shrink-0"
              onError={handleImageError}
              loading="lazy"
            />
          </div>
        )}
      />
    );
  };

  const renderDepositMethods = () => {
    if (!depositMethods.length) return null;

    return (
      <div className="mb-6">
        <p className="text-sm font-medium text-gray-700 mb-2">Deposit Methods</p>
        <div className="flex flex-wrap gap-2">
          {depositMethods.slice(0, MAX_ITEMS_BEFORE_CAROUSEL).map((deposit, index) => (
            <div 
              key={`${deposit.name || 'deposit'}-${index}`}
              className="h-8 w-16 flex items-center justify-center bg-gray-50 rounded p-1"
            >
              <img
                src={deposit.dark_url}
                alt={deposit.name || 'Deposit Method'}
                title={deposit.name}
                className="h-full w-auto object-contain"
                onError={handleImageError}
                loading="lazy"
              />
            </div>
          ))}
          {depositMethods.length > MAX_ITEMS_BEFORE_CAROUSEL && (
            <span className="text-sm text-gray-500 flex items-center">
              +{depositMethods.length - MAX_ITEMS_BEFORE_CAROUSEL} more
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
      <div className="relative p-6">
        <div className="flex justify-between">
          <div className="space-y-2">
            <div className="w-32 h-16 bg-gray-50 rounded flex items-center justify-center">
              <img
                src={offer.logo.dark}
                alt={offer.logo.alt}
                className="w-full h-full object-contain p-2"
                onError={handleImageError}
                loading="lazy"
              />
            </div>
            {renderFlags()}
          </div>
          <div className="flex flex-col items-end gap-2">
            {offer.ribbon && (
              <div className="bg-indigo-600 text-white px-4 py-1 rounded-lg -mr-6 whitespace-nowrap">
                {offer.ribbon}
              </div>
            )}
            <div className="flex items-center gap-2 mt-2">
              <Star className="w-8 h-8 text-yellow-400 fill-current" />
              <span className="text-2xl font-bold text-gray-800">{offer.stars.toFixed(1)}</span>
            </div>
          </div>
        </div>

        <div className="space-y-2 my-6">
          {[offer.headlines.one, offer.headlines.two, offer.headlines.three]
            .filter(headline => headline?.title)
            .map((headline, index) => (
              <h3 
                key={index}
                className={`${
                  index === 0 
                    ? 'text-xl font-bold text-indigo-600' 
                    : index === 1 
                      ? 'text-lg font-semibold text-gray-800'
                      : 'text-base text-gray-600'
                }`}
              >
                {headline.title}
              </h3>
            ))}
        </div>

        <div className="space-y-2 mb-6">
          {[offer.bullet_points.one, offer.bullet_points.two, offer.bullet_points.three]
            .filter(bullet => bullet?.title)
            .map((bullet, index) => (
              <div key={index} className="flex items-start gap-2">
                <span className="text-indigo-500 mt-1">•</span>
                <p className="text-gray-600">{bullet.title}</p>
              </div>
            ))}
        </div>

        {renderDepositMethods()}

        {offer.coupon && (
          <div className="mb-6">
            {offer.coupon_title && (
              <p className="text-sm font-medium text-gray-700 mb-2">{offer.coupon_title}</p>
            )}
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <code className="flex-1 font-mono text-indigo-600 font-medium">
                {offer.coupon}
              </code>
              <button
                onClick={handleCopyCode}
                className={`p-2 rounded-md transition-all duration-200 ${
                  copied 
                    ? 'bg-green-100 text-green-600' 
                    : copyError
                      ? 'bg-red-100 text-red-600'
                      : 'hover:bg-gray-100 text-gray-600'
                }`}
                title={copied ? 'Copied!' : copyError ? 'Failed to copy' : 'Copy code'}
              >
                {copied ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
            {copyError && (
              <p className="text-xs text-red-600 mt-1">
                Failed to copy. Please try selecting and copying manually.
              </p>
            )}
          </div>
        )}

        <a
          href={offer.links.offer}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full text-center bg-orange-500 text-white py-3 px-4 rounded-lg hover:bg-orange-600 transition-colors duration-300 font-semibold"
        >
          {offer.cta.one}
        </a>

        <p className="text-center text-sm text-gray-500 mt-3">
          {offer.cta.two}
        </p>

        <div className="flex items-center gap-2 mt-4 mb-2">
          <Tag className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-600 capitalize">
            {offer.offer_type || 'Standard'}
          </span>
        </div>
      </div>
    </div>
  );
}