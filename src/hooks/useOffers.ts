import { useState, useEffect } from 'react';
import type { Offer, OfferWallResponse } from '../types/offers';

export function useOffers() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await fetch('https://publisher.deals/api/offer-wall/0e5056a7-e1f4-4c9e-bcbb-7ff9a16c265e?return=json');
        if (!response.ok) throw new Error('Failed to fetch offers');
        
        const data: OfferWallResponse = await response.json();
        if (!data?.offers) throw new Error('No offers found');
        
        setOffers(data.offers);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, []);

  return { offers, loading, error };
}