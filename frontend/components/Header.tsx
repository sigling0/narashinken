'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { MenuItem } from '@/lib/wordpress';

interface HeaderProps {
  menuItems?: MenuItem[];
}

export default function Header({ menuItems = [] }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md" style={{backgroundColor: 'var(--color-header-bg)'}}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16 md:h-24">
          {/* ロゴ */}
          <Link href="/" className="flex items-center">
            <div className="w-48 md:w-72">
              <Image 
                src="/logo_header.png" 
                alt="奈良心剣道場" 
                width={288}
                height={80}
                className="w-full h-auto"
                priority
              />
            </div>
          </Link>

          {/* デスクトップメニュー */}
          <nav className="hidden md:flex items-center space-x-4 lg:space-x-6">
            <Link
              href="/"
              className="px-4 py-1.5 text-base font-medium transition-all hover:font-extrabold"
              style={{color: 'var(--color-text-primary)'}}
            >
              ホーム
            </Link>
            <Link
              href="/about"
              className="px-4 py-1.5 text-base font-medium transition-all hover:font-extrabold"
              style={{color: 'var(--color-text-primary)'}}
            >
              道場紹介
            </Link>
            <Link
              href="/recruit"
              className="px-4 py-1.5 text-base font-medium transition-all hover:font-extrabold"
              style={{color: 'var(--color-text-primary)'}}
            >
              道場生募集
            </Link>
            <Link
              href="/album"
              className="px-4 py-1.5 text-base font-medium transition-all hover:font-extrabold"
              style={{color: 'var(--color-text-primary)'}}
            >
              稽古風景
            </Link>
            <Link
              href="/category/result"
              className="px-4 py-1.5 text-base font-medium transition-all hover:font-extrabold"
              style={{color: 'var(--color-text-primary)'}}
            >
              大会記録
            </Link>
            <Link
              href="/posts"
              className="px-4 py-1.5 text-base font-medium transition-all hover:font-extrabold"
              style={{color: 'var(--color-text-primary)'}}
            >
              記事一覧
            </Link>
          </nav>

          {/* モバイルハンバーガーボタン */}
          <button
            className="md:hidden relative w-7 h-5.5"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? 'メニューを閉じる' : 'メニューを開く'}
          >
            <span 
              className={`absolute block w-full h-0.5 bg-current transition-all duration-200 ${
                isMenuOpen ? 'top-1/2 rotate-45' : 'top-0'
              }`}
              style={{backgroundColor: 'var(--color-text-primary)'}}
            />
            <span 
              className={`absolute block w-full h-0.5 bg-current transition-all duration-200 top-1/2 -translate-y-1/2 ${
                isMenuOpen ? 'opacity-0' : 'opacity-100'
              }`}
              style={{backgroundColor: 'var(--color-text-primary)'}}
            />
            <span 
              className={`absolute block w-full h-0.5 bg-current transition-all duration-200 ${
                isMenuOpen ? 'top-1/2 -rotate-45' : 'bottom-0'
              }`}
              style={{backgroundColor: 'var(--color-text-primary)'}}
            />
          </button>
        </div>

        {/* モバイルメニュー */}
        <nav 
          className={`md:hidden backdrop-blur-md transition-all duration-200 origin-top ${
            isMenuOpen ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0 h-0'
          }`}
          style={{backgroundColor: 'var(--color-header-bg)'}}
        >
          <div className="py-6 space-y-2.5">
            <Link
              href="/about"
              className="block py-2 text-base font-medium"
              style={{color: 'var(--color-text-primary)'}}
              onClick={() => setIsMenuOpen(false)}
            >
              道場紹介
            </Link>
            <Link
              href="/member"
              className="block py-2 text-base font-medium"
              style={{color: 'var(--color-text-primary)'}}
              onClick={() => setIsMenuOpen(false)}
            >
              指導者紹介
            </Link>
            <Link
              href="/album"
              className="block py-2 text-base font-medium"
              style={{color: 'var(--color-text-primary)'}}
              onClick={() => setIsMenuOpen(false)}
            >
              稽古風景
            </Link>
            <Link
              href="/category/result"
              className="block py-2 text-base font-medium"
              style={{color: 'var(--color-text-primary)'}}
              onClick={() => setIsMenuOpen(false)}
            >
              大会記録
            </Link>
            <Link
              href="/posts"
              className="block py-2 text-base font-medium"
              style={{color: 'var(--color-text-primary)'}}
              onClick={() => setIsMenuOpen(false)}
            >
              記事一覧
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}

