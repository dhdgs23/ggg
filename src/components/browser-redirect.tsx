
'use client';

import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { RotateCw } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export default function BrowserRedirect() {
  const [isInAppBrowser, setIsInAppBrowser] = useState(false);

  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
    const isFacebook = /FBAN|FBAV/.test(userAgent);
    const isInstagram = /Instagram/.test(userAgent);
    const isAndroid = /android/i.test(userAgent);

    if (isFacebook || isInstagram) {
      setIsInAppBrowser(true);
      if (isAndroid) {
        // For Android, we use a more aggressive interval to keep prompting the user.
        const currentUrl = window.location.href;
        const intentUrl = `intent:${currentUrl.replace(/^https?:\/\//, '')}#Intent;scheme=https;package=com.android.chrome;end`;
        
        const intervalId = setInterval(() => {
          try {
            window.location.href = intentUrl;
          } catch (e) {
            // This may fail if the user is in a non-standard browser.
            console.error("Intent redirection failed:", e);
          }
        }, 1500); // Try to redirect every 1.5 seconds

        return () => clearInterval(intervalId); // Cleanup on component unmount
      }
    }
  }, []);

  if (!isInAppBrowser) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-black text-white p-8">
      <div className="text-center">
        <Image src="/img/garena.png" alt="Garena Logo" width={80} height={80} className="mx-auto mb-6" />
        <h1 className="text-2xl font-bold mb-4">Browser Not Supported</h1>
        <p className="mb-6 text-neutral-300">
          For the best experience, please open this website in your phone's default browser (like Chrome or Safari).
        </p>
        <Button 
          variant="outline" 
          className={cn(
            "relative overflow-hidden",
            "bg-transparent text-white border-white hover:bg-white hover:text-black animate-glowing-ray"
          )}
          onClick={() => window.location.reload()}
        >
          <RotateCw className="mr-2 h-4 w-4" />
          Reload Page
        </Button>
      </div>
    </div>
  );
}
