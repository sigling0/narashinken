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
    // ページ遷移時に即座にトップにスクロール
    window.scrollTo(0, 0);
    
    // DOMが完全に更新された後にも再度トップにスクロール（保険）
    const timer = setTimeout(() => {
      window.scrollTo(0, 0);
    }, 0);

    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
}



