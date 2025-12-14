
'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

const SESSION_STORAGE_KEY = 'browser_redirect_checked';

export default function BrowserRedirect() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Only run this logic on the client
    if (typeof window === 'undefined') {
      return;
    }

    // Don't run the redirect logic on the /ff page itself
    if (pathname === '/ff') {
      return;
    }

    // Check if we've already performed the check in this session
    const hasChecked = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (hasChecked) {
      return;
    }

    // Mark that we've checked, so it doesn't run again in this session
    sessionStorage.setItem(SESSION_STORAGE_KEY, 'true');

    // Check user agent for in-app browsers
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
    const isFacebook = /FBAN|FBAV/.test(userAgent);
    const isInstagram = /Instagram/.test(userAgent);

    if (isFacebook || isInstagram) {
      // If it's an in-app browser, redirect to the /ff page
      router.replace('/ff');
    }
  }, [pathname, router]);

  // This component renders nothing
  return null;
}
