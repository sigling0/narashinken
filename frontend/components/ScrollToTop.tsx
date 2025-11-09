'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * ページ遷移時に常にトップにスクロールするコンポーネント
 * Next.js App Routerのデフォルトのスクロール位置復元を無効化
 */
export default function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const { hash } = window.location;

    if (hash) {
      const targetId = hash.replace(/^#/, '');

      let frameId: number | null = null;
      let attempts = 0;
      const maxAttempts = 24; // 約400ms (24 * ~16ms)

      const tryScroll = () => {
        attempts += 1;
        const element = document.getElementById(targetId);

        if (element) {
          element.scrollIntoView({ behavior: 'auto', block: 'start' });
          return;
        }

        if (attempts < maxAttempts) {
          frameId = window.requestAnimationFrame(tryScroll);
        }
      };

      tryScroll();

      return () => {
        if (frameId !== null) {
          window.cancelAnimationFrame(frameId);
        }
      };
      return;
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname]);

  return null;
}



