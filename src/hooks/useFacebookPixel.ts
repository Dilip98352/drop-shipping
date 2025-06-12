import { useEffect } from 'react';
import { useFirebaseData } from './useFirebaseData';

declare global {
  interface Window {
    fbq: any;
  }
}

export function useFacebookPixel() {
  const { data: settings } = useFirebaseData<{facebookPixelId?: string}>('settings');

  useEffect(() => {
    if (settings?.facebookPixelId) {
      // Initialize Facebook Pixel
      const script = document.createElement('script');
      script.innerHTML = `
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '${settings.facebookPixelId}');
        fbq('track', 'PageView');
      `;
      document.head.appendChild(script);

      // Add noscript fallback
      const noscript = document.createElement('noscript');
      noscript.innerHTML = `
        <img height="1" width="1" style="display:none"
        src="https://www.facebook.com/tr?id=${settings.facebookPixelId}&ev=PageView&noscript=1"/>
      `;
      document.head.appendChild(noscript);
    }
  }, [settings?.facebookPixelId]);

  const trackEvent = (eventName: string, parameters?: any) => {
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', eventName, parameters);
    }
  };

  return { trackEvent };
}