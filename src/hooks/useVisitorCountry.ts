import { useState, useEffect } from 'react';

// Map of country codes to full names matching the offers data
const countryCodeMap: Record<string, string> = {
  'SE': 'Sweden',
  'US': 'United States',
  'GB': 'United Kingdom',
  'UK': 'United Kingdom',
  'DE': 'Germany',
  'CA': 'Canada',
  'AU': 'Australia',
  'FR': 'France',
  'ES': 'Spain',
  'IT': 'Italy',
  'NL': 'Netherlands',
  'BE': 'Belgium',
  'CH': 'Switzerland',
  'AT': 'Austria',
  'DK': 'Denmark',
  'NO': 'Norway',
  'FI': 'Finland',
  'IE': 'Ireland',
  'NZ': 'New Zealand',
  'PL': 'Poland',
  'PT': 'Portugal',
  'BR': 'Brazil',
  'JP': 'Japan',
  'IN': 'India',
  'RU': 'Russia Federation',
  'ZA': 'South Africa',
  'MX': 'Mexico',
  'AR': 'Argentina',
  'CL': 'Chile',
  'CO': 'Colombia',
  'PE': 'Peru',
  'VE': 'Venezuela',
  'MY': 'Malaysia',
  'SG': 'Singapore',
  'ID': 'Indonesia',
  'TH': 'Thailand',
  'PH': 'Philippines',
  'VN': 'Vietnam',
  'TR': 'Turkey',
  'SA': 'Saudi Arabia',
  'AE': 'United Arab Emirates',
  'EG': 'Egypt',
  'ZA': 'South Africa',
  'NG': 'Nigeria',
  'KE': 'Kenya',
  'IL': 'Israel',
  'HK': 'Hong Kong',
  'TW': 'Taiwan',
  'KR': 'South Korea',
  'UA': 'Ukraine',
  'CZ': 'Czech Republic',
  'HU': 'Hungary',
  'RO': 'Romania',
  'SK': 'Slovakia',
  'HR': 'Croatia',
  'RS': 'Serbia',
  'SI': 'Slovenia',
  'BG': 'Bulgaria',
  'GR': 'Greece',
  'IS': 'Iceland',
  'EE': 'Estonia',
  'LV': 'Latvia',
  'LT': 'Lithuania'
};

export function useVisitorCountry() {
  const [visitorCountry, setVisitorCountry] = useState<string>('');
  const [visitorCountryName, setVisitorCountryName] = useState<string>('Unknown');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCountry = async () => {
      try {
        // Try cloudflare first as it's most reliable with VPNs
        const cfResponse = await fetch('https://cloudflare.com/cdn-cgi/trace');
        if (cfResponse.ok) {
          const data = await cfResponse.text();
          const lines = data.split('\n');
          const locLine = lines.find(line => line.startsWith('loc='));
          if (locLine) {
            const countryCode = locLine.split('=')[1].trim().toUpperCase();
            if (countryCode && countryCodeMap[countryCode]) {
              setVisitorCountry(countryCodeMap[countryCode]);
              setVisitorCountryName(countryCodeMap[countryCode]);
              setLoading(false);
              return;
            }
          }
        }

        // Fallback to ipapi.co
        const ipapiResponse = await fetch('https://ipapi.co/json/');
        if (ipapiResponse.ok) {
          const data = await ipapiResponse.json();
          if (data.country_code) {
            const countryCode = data.country_code.toUpperCase();
            const mappedCountry = countryCodeMap[countryCode];
            if (mappedCountry) {
              setVisitorCountry(mappedCountry);
              setVisitorCountryName(mappedCountry);
              setLoading(false);
              return;
            }
            // If we have a country name but no mapping, use the API's country name
            if (data.country_name) {
              setVisitorCountry(data.country_name);
              setVisitorCountryName(data.country_name);
              setLoading(false);
              return;
            }
          }
        }

        // Final fallback to db-ip
        const dbipResponse = await fetch('https://api.db-ip.com/v2/free/self');
        if (dbipResponse.ok) {
          const data = await dbipResponse.json();
          if (data.countryCode) {
            const countryCode = data.countryCode.toUpperCase();
            const mappedCountry = countryCodeMap[countryCode];
            if (mappedCountry) {
              setVisitorCountry(mappedCountry);
              setVisitorCountryName(mappedCountry);
              setLoading(false);
              return;
            }
            // If we have a country name but no mapping, use the API's country name
            if (data.countryName) {
              setVisitorCountry(data.countryName);
              setVisitorCountryName(data.countryName);
              setLoading(false);
              return;
            }
          }
        }

        // If all APIs fail, set to Unknown
        setVisitorCountry('');
        setVisitorCountryName('Unknown');
      } catch (error) {
        console.warn('Error detecting country:', error);
        setVisitorCountry('');
        setVisitorCountryName('Unknown');
      } finally {
        setLoading(false);
      }
    };

    fetchCountry();
  }, []);

  return { visitorCountry, visitorCountryName, loading };
}