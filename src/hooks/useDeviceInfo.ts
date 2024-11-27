import { useState, useEffect } from 'react';

interface DeviceInfo {
  deviceType: string;
  browser: string;
  os: string;
}

export function useDeviceInfo(): DeviceInfo {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    deviceType: 'Desktop',
    browser: 'Unknown',
    os: 'Unknown'
  });

  useEffect(() => {
    const ua = navigator.userAgent;
    
    // Detect device type
    const deviceType = /Mobi|Android|iPhone|iPad|Windows Phone/i.test(ua) 
      ? (/iPad/i.test(ua) ? 'Tablet' : 'Mobile')
      : 'Desktop';

    // Detect browser
    const getBrowser = () => {
      if (ua.includes('Firefox/')) return 'Firefox';
      if (ua.includes('Edg/')) return 'Edge';
      if (ua.includes('Chrome/')) return 'Chrome';
      if (ua.includes('Safari/')) return 'Safari';
      if (ua.includes('OPR/') || ua.includes('Opera/')) return 'Opera';
      return 'Unknown';
    };

    // Detect OS
    const getOS = () => {
      if (ua.includes('Windows')) return 'Windows';
      if (ua.includes('Mac OS')) return 'macOS';
      if (ua.includes('Linux')) return 'Linux';
      if (ua.includes('Android')) return 'Android';
      if (ua.includes('iOS')) return 'iOS';
      return 'Unknown';
    };

    setDeviceInfo({
      deviceType,
      browser: getBrowser(),
      os: getOS()
    });
  }, []);

  return deviceInfo;
}