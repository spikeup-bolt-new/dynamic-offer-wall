import React, { useState, useEffect } from 'react';
import { Loader, Monitor, Globe2, Languages, Network } from 'lucide-react';
import { useOffers } from '../hooks/useOffers';
import { useVisitorCountry } from '../hooks/useVisitorCountry';
import { useVisitorLanguage } from '../hooks/useVisitorLanguage';
import { useDeviceInfo } from '../hooks/useDeviceInfo';
import { useIspType } from '../hooks/useIspType';
import { useOfferTypeScoring, OFFER_TYPES } from '../hooks/useOfferTypeScoring';
import { SearchBar } from './SearchBar';
import { BrandFilter } from './BrandFilter';
import { CountryFilter } from './CountryFilter';
import { LanguageFilter } from './LanguageFilter';
import { OfferTypeFilter } from './OfferTypeFilter';
import { ScoringDebug } from './ScoringDebug';
import { OfferCard } from './OfferCard';

export function OfferWall() {
  const { offers, loading: offersLoading, error } = useOffers();
  const { visitorCountry, visitorCountryName, loading: countryLoading } = useVisitorCountry();
  const { visitorLanguage } = useVisitorLanguage();
  const { deviceType, browser, os } = useDeviceInfo();
  const { ispType } = useIspType();
  const { recommendedOfferType, scoringDetails, loading: scoringLoading, normalizeOfferType } = useOfferTypeScoring();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedOfferType, setSelectedOfferType] = useState('');
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [selectionPath, setSelectionPath] = useState<{
    steps: Array<{
      check: string;
      result: boolean;
      action: string;
    }>;
    finalFilters: {
      country: string;
      language: string;
      offerType: string;
    };
  } | null>(null);

  const brands = [...new Set(offers.map(offer => offer.brand))].sort();
  const countries = [...new Set(offers.flatMap(offer => offer.countries))].sort();
  const languages = [...new Set(offers.map(offer => offer.language))].sort();
  const offerTypes = [...new Set(offers.map(offer => normalizeOfferType(offer.offer_type)))].filter(Boolean).sort();

  useEffect(() => {
    if (!initialLoadComplete && !countryLoading && !scoringLoading && offers.length > 0 && recommendedOfferType) {
      const steps = [];
      const finalFilters = {
        country: '',
        language: '',
        offerType: ''
      };

      // Start with checking country offers
      const countryOffers = visitorCountry ? 
        offers.filter(offer => offer.countries.includes(visitorCountry)) : [];

      steps.push({
        check: `IF: Check for offers in country "${visitorCountry}"`,
        result: countryOffers.length > 0,
        action: countryOffers.length > 0 
          ? `✓ Found ${countryOffers.length} offers for ${visitorCountry}`
          : '✗ No offers found for country'
      });

      if (countryOffers.length > 0) {
        setSelectedCountry(visitorCountry);
        finalFilters.country = visitorCountry;

        // Check for country + language offers
        const countryLanguageOffers = countryOffers.filter(
          offer => offer.language === visitorLanguage
        );

        steps.push({
          check: `  IF: Check ${visitorCountry} offers in language "${visitorLanguage}"`,
          result: countryLanguageOffers.length > 0,
          action: countryLanguageOffers.length > 0
            ? `  ✓ Found ${countryLanguageOffers.length} ${visitorLanguage} offers`
            : '  ✗ No offers in user language'
        });

        if (countryLanguageOffers.length > 0) {
          setSelectedLanguage(visitorLanguage);
          finalFilters.language = visitorLanguage;

          // Check for country + language + offer type
          const typeOffers = countryLanguageOffers.filter(
            offer => normalizeOfferType(offer.offer_type) === recommendedOfferType
          );

          steps.push({
            check: `    IF: Check for ${recommendedOfferType} offers with country and language`,
            result: typeOffers.length > 0,
            action: typeOffers.length > 0
              ? `    ✓ Found ${typeOffers.length} ${recommendedOfferType} offers`
              : '    ✗ No offers of recommended type'
          });

          if (typeOffers.length > 0) {
            setSelectedOfferType(recommendedOfferType);
            finalFilters.offerType = recommendedOfferType;
          } else {
            steps.push({
              check: '    ELSE: No matching offer type',
              result: true,
              action: '    → Using all offer types'
            });
          }
        } else {
          // No country + language offers, try country + offer type
          const countryTypeOffers = countryOffers.filter(
            offer => normalizeOfferType(offer.offer_type) === recommendedOfferType
          );

          steps.push({
            check: `  ELSE: Check ${visitorCountry} offers of type "${recommendedOfferType}"`,
            result: countryTypeOffers.length > 0,
            action: countryTypeOffers.length > 0
              ? `  ✓ Found ${countryTypeOffers.length} ${recommendedOfferType} offers`
              : '  ✗ No offers of recommended type'
          });

          if (countryTypeOffers.length > 0) {
            setSelectedOfferType(recommendedOfferType);
            finalFilters.offerType = recommendedOfferType;
          } else {
            steps.push({
              check: '  ELSE: No matching offer type',
              result: true,
              action: '  → Using all offer types'
            });
          }

          steps.push({
            check: '  ELSE: No language match',
            result: true,
            action: '  → Using all languages'
          });
        }
      } else {
        // No country offers, try language
        const languageOffers = offers.filter(
          offer => offer.language === visitorLanguage
        );

        steps.push({
          check: `ELSE: Check offers in language "${visitorLanguage}"`,
          result: languageOffers.length > 0,
          action: languageOffers.length > 0
            ? `✓ Found ${languageOffers.length} ${visitorLanguage} offers`
            : '✗ No offers in user language'
        });

        if (languageOffers.length > 0) {
          setSelectedLanguage(visitorLanguage);
          finalFilters.language = visitorLanguage;

          // Check language + offer type
          const languageTypeOffers = languageOffers.filter(
            offer => normalizeOfferType(offer.offer_type) === recommendedOfferType
          );

          steps.push({
            check: `  IF: Check for ${recommendedOfferType} offers in language`,
            result: languageTypeOffers.length > 0,
            action: languageTypeOffers.length > 0
              ? `  ✓ Found ${languageTypeOffers.length} ${recommendedOfferType} offers`
              : '  ✗ No offers of recommended type'
          });

          if (languageTypeOffers.length > 0) {
            setSelectedOfferType(recommendedOfferType);
            finalFilters.offerType = recommendedOfferType;
          } else {
            steps.push({
              check: '  ELSE: No matching offer type',
              result: true,
              action: '  → Using all offer types'
            });
          }
        } else {
          steps.push({
            check: 'ELSE: No language match',
            result: true,
            action: '→ Using all languages and offer types'
          });
        }
      }

      setSelectionPath({ steps, finalFilters });
      setInitialLoadComplete(true);
    }
  }, [countryLoading, scoringLoading, visitorCountry, visitorLanguage, offers, recommendedOfferType, initialLoadComplete, normalizeOfferType]);

  const filteredOffers = offers.filter(offer => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = !searchTerm || (
      offer.brand.toLowerCase().includes(searchLower) ||
      offer.countries?.some(country => country.toLowerCase().includes(searchLower)) ||
      offer.language?.toLowerCase().includes(searchLower) ||
      Object.values(offer.headlines).some(headline => headline?.title?.toLowerCase().includes(searchLower)) ||
      Object.values(offer.bullet_points).some(bullet => bullet?.title?.toLowerCase().includes(searchLower))
    );

    const matchesBrand = !selectedBrand || offer.brand === selectedBrand;
    const matchesCountry = !selectedCountry || offer.countries.includes(selectedCountry);
    const matchesLanguage = !selectedLanguage || offer.language === selectedLanguage;
    const matchesOfferType = !selectedOfferType || normalizeOfferType(offer.offer_type) === selectedOfferType;

    return matchesSearch && matchesBrand && matchesCountry && matchesLanguage && matchesOfferType;
  });

  if (offersLoading || countryLoading || scoringLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Casino Offers</h1>
          <p className="text-xl text-gray-600 mb-6">Find the best casino bonuses and rewards</p>

          {/* User Context Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center justify-center gap-2 text-gray-600">
                <Monitor className="w-5 h-5" />
                <span className="font-medium">System:</span>
              </div>
              <div className="mt-2 space-y-1 text-sm">
                <div>Device: <span className="font-medium">{deviceType}</span></div>
                <div>Browser: <span className="font-medium">{browser}</span></div>
                <div>OS: <span className="font-medium">{os}</span></div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center justify-center gap-2 text-gray-600">
                <Globe2 className="w-5 h-5" />
                <span className="font-medium">Location:</span>
              </div>
              <div className="mt-2 space-y-1 text-sm">
                <div>Country: <span className="font-medium">{visitorCountryName || 'Unknown'}</span></div>
                <div>Language: <span className="font-medium">{visitorLanguage || 'Unknown'}</span></div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center justify-center gap-2 text-gray-600">
                <Network className="w-5 h-5" />
                <span className="font-medium">Connection:</span>
              </div>
              <div className="mt-2 space-y-1 text-sm">
                <div>ISP Type: <span className="font-medium">{ispType || 'Unknown'}</span></div>
              </div>
            </div>
          </div>

          {/* Debug Sections */}
          {scoringDetails && (
            <ScoringDebug 
              scoringDetails={scoringDetails}
              recommendedOfferType={recommendedOfferType}
              selectionPath={selectionPath}
            />
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-8">
          <div className="w-full sm:w-96">
            <SearchBar 
              searchTerm={searchTerm} 
              onSearchChange={setSearchTerm}
              placeholder="Search by brand, country, language, or offers..."
            />
          </div>
          <div className="flex flex-wrap gap-4">
            <BrandFilter
              brands={brands}
              selectedBrand={selectedBrand}
              onBrandChange={setSelectedBrand}
            />
            <CountryFilter
              countries={countries}
              selectedCountry={selectedCountry}
              onCountryChange={setSelectedCountry}
            />
            <LanguageFilter
              languages={languages}
              selectedLanguage={selectedLanguage}
              onLanguageChange={setSelectedLanguage}
            />
            <OfferTypeFilter
              offerTypes={offerTypes}
              selectedOfferType={selectedOfferType}
              onOfferTypeChange={setSelectedOfferType}
            />
          </div>
        </div>

        {/* Offers Grid */}
        {filteredOffers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">No offers found matching your criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOffers.map((offer) => (
              <OfferCard key={offer.offer_id} offer={offer} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}