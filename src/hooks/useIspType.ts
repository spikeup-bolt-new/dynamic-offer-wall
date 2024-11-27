import { useState, useEffect } from 'react';

export function useIspType() {
  const [ispType, setIspType] = useState<string>('');

  useEffect(() => {
    const detectIspType = async () => {
      try {
        // Try multiple IP info services for reliability
        const services = [
          'https://ipapi.co/json/',
          'https://api.db-ip.com/v2/free/self',
          'https://ipinfo.io/json'
        ];

        for (const service of services) {
          try {
            const response = await fetch(service);
            if (response.ok) {
              const data = await response.json();
              
              // Normalize organization/ASN info
              const orgInfo = (
                data.org || 
                data.asn || 
                data.organization || 
                data.connection || 
                ''
              ).toLowerCase();

              // Detect ISP type based on keywords and connection info
              if (orgInfo.includes('vpn') || 
                  orgInfo.includes('proxy') || 
                  orgInfo.includes('tor') || 
                  orgInfo.includes('exit node')) {
                setIspType('VPN/Proxy');
                break;
              } else if (orgInfo.includes('university') || 
                        orgInfo.includes('college') || 
                        orgInfo.includes('edu') || 
                        orgInfo.includes('school') || 
                        orgInfo.includes('institute')) {
                setIspType('University/Institutional');
                break;
              } else if (orgInfo.includes('business') || 
                        orgInfo.includes('corporate') || 
                        orgInfo.includes('enterprise') || 
                        orgInfo.includes('office')) {
                setIspType('Business/Corporate');
                break;
              } else if (orgInfo.includes('mobile') || 
                        orgInfo.includes('wireless') || 
                        orgInfo.includes('cellular') || 
                        data.mobile === true) {
                setIspType('Mobile');
                break;
              } else if (orgInfo.includes('satellite') || 
                        orgInfo.includes('starlink')) {
                setIspType('Satellite');
                break;
              } else if ((data.connection_type === 'wifi' && orgInfo.includes('public')) || 
                        orgInfo.includes('hotspot')) {
                setIspType('Public Wi-Fi');
                break;
              } else if (orgInfo.includes('datacenter') || 
                        orgInfo.includes('hosting') || 
                        orgInfo.includes('cloud')) {
                setIspType('Data Center');
                break;
              } else if (orgInfo.includes('residential') || 
                        orgInfo.includes('cable') || 
                        orgInfo.includes('broadband') || 
                        orgInfo.includes('fiber') || 
                        orgInfo.includes('dsl')) {
                setIspType('Residential');
                break;
              }

              // If we got a response but couldn't categorize, try the next service
              continue;
            }
          } catch (error) {
            // If one service fails, try the next one
            continue;
          }
        }

        // If we couldn't determine the type after trying all services, default to Residential
        if (!ispType) {
          setIspType('Residential');
        }
      } catch (error) {
        console.warn('Error detecting ISP type:', error);
        setIspType('Residential'); // Default fallback
      }
    };

    detectIspType();
  }, []);

  return { ispType };
}