import { useState, useEffect } from 'react';
import { useDeviceInfo } from './useDeviceInfo';
import { useVisitorCountry } from './useVisitorCountry';
import { useVisitorLanguage } from './useVisitorLanguage';
import { useIspType } from './useIspType';

// Define valid offer types
export const OFFER_TYPES = {
  REVSHARE: 'RevShare',
  HYBRID: 'Hybrid',
  CPA: 'CPA'
} as const;

export type OfferType = typeof OFFER_TYPES[keyof typeof OFFER_TYPES];

const SCORING_CONFIG = {
  scoring: {
    country: {
      weight: 5,
      values: {
        "United States": 10,
        "Sweden": 8,
        "Australia": 9,
        "United Kingdom": 8,
        "Canada": 7,
        "Germany": 7,
        "Finland": 6,
        "Norway": 6,
        "Mexico": 5,
        "Hungary": 4,
        "Spain": 5,
        "Portugal": 5,
        "Denmark": 6,
        "Chile": 4,
        "Ireland": 7,
        "Belgium": 6,
        "Brazil": 5,
        "Peru": 4,
        "New Zealand": 8,
        "Netherlands": 7,
        "Slovakia": 4,
        "Italy": 5,
        "Austria": 6,
        "Switzerland": 8,
        "France": 6,
        "South Africa": 5,
        "India": 3,
        "Russia Federation": 4,
        "Argentina": 4,
        "Czech Republic": 4,
        "Poland": 4,
        "Japan": 6,
        "Global": 3,
        "South Korea": 5,
        "Thailand": 3,
        "Slovenia": 4,
        "Romania": 3,
        "Nigeria": 2,
        "United Arab Emirates": 4,
        "Greece": 4,
        "Kazakhstan": 2,
        "Liechtenstein": 5,
        "Colombia": 3,
        "Bulgaria": 3,
        "Vietnam": 2,
        "Philippines": 2,
        "Malta": 6,
        "Malaysia": 3,
        "Taiwan": 4,
        "Hong Kong": 5,
        "Bolivia": 2,
        "Ecuador": 3,
        "Paraguay": 2,
        "Uruguay": 3,
        "Venezuela": 2,
        "Croatia": 3,
        "Estonia": 4,
        "Uganda": 1,
        "Kenya": 2,
        "Congo": 1,
        "Zambia": 1,
        "Turkey": 3,
        "Singapore": 5,
        "Indonesia": 3,
        "Côte d'Ivoire": 1,
        "Panama": 4,
        "Costa Rica": 4,
        "Mozambique": 1,
        "Cameroon": 1,
        "Pakistan": 2,
        "Burkina Faso": 1,
        "Central African Republic": 1,
        "China": 4,
        "Morocco": 3,
        "Latvia": 3
      }
    },
    language: {
      weight: 4,
      values: {
        "English": 10,
        "Swedish": 9,
        "French": 8,
        "German": 9,
        "Finnish": 7,
        "Norwegian": 7,
        "Spanish": 8,
        "Hungarian": 5,
        "Catalan": 4,
        "Portuguese": 6,
        "Danish": 7,
        "Slovak": 4,
        "Czech": 4,
        "Thai": 3,
        "Vietnamese": 3,
        "Dutch": 8,
        "Italian": 7,
        "Hindi": 3,
        "Russian": 5,
        "Polish": 5,
        "Japanese": 6,
        "Korean": 5,
        "Slovenian": 4,
        "Arabic": 4,
        "Greek": 4,
        "Kazakh": 2,
        "Bulgarian": 3,
        "Filipino": 3,
        "Malay": 3,
        "Mandarin": 6,
        "Cantonese": 6,
        "Croatian": 4,
        "Estonian": 4,
        "Romanian": 3,
        "Turkish": 4,
        "Indonesian": 3,
        "Urdu": 2,
        "Chinese": 6,
        "Latvian": 3
      }
    },
    device: {
      weight: 3,
      values: {
        "Desktop": 10,
        "Mobile": 7,
        "Tablet": 5,
        "Smart TV": 4,
        "Game Console": 4,
        "Wristwatches": 2,
        "Ebook Readers": 3,
        "Smart Glasses": 2,
        "Home Appliances": 1,
        "Cars": 1,
        "Digital Cameras": 1
      }
    },
    browser: {
      weight: 2,
      values: {
        "Chrome": 10,
        "Firefox": 8,
        "Safari": 9,
        "Edge": 7,
        "Opera": 6,
        "Other": 5
      }
    },
    os: {
      weight: 3,
      values: {
        "Windows": 10,
        "macOS": 9,
        "Linux": 8,
        "iOS": 7,
        "Android": 7,
        "Chrome OS": 6,
        "Other": 5
      }
    },
    ispType: {
      weight: 3,
      values: {
        "Residential": 10,
        "Mobile": 8,
        "Business/Corporate": 7,
        "University/Institutional": 6,
        "VPN/Proxy": 5,
        "Data Center": 4,
        "Satellite": 3,
        "Public Wi-Fi": 3
      }
    }
  }
};

export interface ScoringDetails {
  categoryScores: {
    [key: string]: {
      value: string;
      rawScore: number;
      weight: number;
      weightedScore: number;
    };
  };
  totalScore: number;
  normalizedScore: number;
  maxPossibleScore: number;
  detectedCategories: string[];
}

// Helper function to normalize offer type
export const normalizeOfferType = (type: string | null | undefined): OfferType | '' => {
  if (!type) return '';
  
  const normalized = type.toLowerCase().replace(/\s+/g, '');
  
  switch (normalized) {
    case 'revshare':
      return OFFER_TYPES.REVSHARE;
    case 'hybrid':
      return OFFER_TYPES.HYBRID;
    case 'cpa':
      return OFFER_TYPES.CPA;
    default:
      return '';
  }
};

export function useOfferTypeScoring() {
  const [recommendedOfferType, setRecommendedOfferType] = useState<OfferType | ''>('');
  const [scoringDetails, setScoringDetails] = useState<ScoringDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const { deviceType, browser, os } = useDeviceInfo();
  const { visitorCountry } = useVisitorCountry();
  const { visitorLanguage } = useVisitorLanguage();
  const { ispType } = useIspType();

  useEffect(() => {
    const calculateScore = () => {
      try {
        const categoryScores: ScoringDetails['categoryScores'] = {};
        const detectedCategories: string[] = [];

        const getScoreValue = (
          values: Record<string, number>,
          key: string,
          defaultValue: number = 5
        ): number => {
          const score = values[key];
          return typeof score === 'number' ? score : defaultValue;
        };

        const addCategoryIfDetected = (
          category: string,
          value: string | null | undefined,
          configSection: any
        ) => {
          if (value && typeof value === 'string') {
            const rawScore = getScoreValue(configSection.values, value, 5);
            categoryScores[category] = {
              value,
              rawScore,
              weight: configSection.weight,
              weightedScore: rawScore * configSection.weight
            };
            detectedCategories.push(category);
          }
        };

        // Add all detected categories
        if (visitorCountry) {
          addCategoryIfDetected('country', visitorCountry, SCORING_CONFIG.scoring.country);
        }
        if (visitorLanguage) {
          addCategoryIfDetected('language', visitorLanguage, SCORING_CONFIG.scoring.language);
        }
        if (deviceType) {
          addCategoryIfDetected('device', deviceType, SCORING_CONFIG.scoring.device);
        }
        if (browser) {
          addCategoryIfDetected('browser', browser, SCORING_CONFIG.scoring.browser);
        }
        if (os) {
          addCategoryIfDetected('os', os, SCORING_CONFIG.scoring.os);
        }
        if (ispType) {
          addCategoryIfDetected('ispType', ispType, SCORING_CONFIG.scoring.ispType);
        }

        if (Object.keys(categoryScores).length > 0) {
          const totalWeightedScore = Object.values(categoryScores)
            .reduce((sum, { weightedScore }) => sum + weightedScore, 0);

          const maxPossibleScore = Object.values(categoryScores)
            .reduce((sum, { weight }) => sum + (weight * 10), 0);

          const normalizedScore = Math.min(100, Math.max(0, 
            (totalWeightedScore / maxPossibleScore) * 100
          ));

          setScoringDetails({
            categoryScores,
            totalScore: totalWeightedScore,
            normalizedScore,
            maxPossibleScore,
            detectedCategories
          });

          // Apply thresholds:
          // CPA: 0-40 (bottom 40%)
          // Hybrid: 41-80 (middle 40%)
          // RevShare: 81-100 (top 20%)
          if (normalizedScore <= 40) {
            setRecommendedOfferType(OFFER_TYPES.CPA);
          } else if (normalizedScore <= 80) {
            setRecommendedOfferType(OFFER_TYPES.HYBRID);
          } else {
            setRecommendedOfferType(OFFER_TYPES.REVSHARE);
          }
        }
      } catch (error) {
        console.warn('Error calculating offer type score:', error);
        setRecommendedOfferType(OFFER_TYPES.HYBRID);
        setScoringDetails(null);
      } finally {
        setLoading(false);
      }
    };

    calculateScore();
  }, [deviceType, browser, os, visitorCountry, visitorLanguage, ispType]);

  return { 
    recommendedOfferType, 
    scoringDetails, 
    loading, 
    normalizeOfferType 
  };
}