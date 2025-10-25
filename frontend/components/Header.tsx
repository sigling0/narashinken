'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { MenuItem } from '@/lib/wordpress';

interface HeaderProps {
  menuItems?: MenuItem[];
  categories?: any[];
  tags?: any[];
}

export default function Header({ menuItems = [], categories = [], tags = [] }: HeaderProps) {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAboutDropdownOpen, setIsAboutDropdownOpen] = useState(false);
  const [mobileKeyword, setMobileKeyword] = useState('');
  
  // カテゴリとタグをフィルタリング・ソート
  const activeCategories = categories
    .filter((cat: any) => cat.count > 0)
    .sort((a: any, b: any) => b.count - a.count)
    .slice(0, 10);
  
  const activeTags = tags
    .filter((tag: any) => tag.count > 0)
    .sort((a: any, b: any) => b.count - a.count)
    .slice(0, 15);
  
  // モバイルメニューからのキーワード検索
  const handleMobileKeywordSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (mobileKeyword.trim()) {
      router.push(`/posts?search=${encodeURIComponent(mobileKeyword.trim())}`);
      setIsMenuOpen(false);
      setMobileKeyword('');
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50" style={{backgroundColor: 'var(--color-dojo-bg-key)'}}>
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
            
            {/* 道場について - ドロップダウンメニュー */}
            <div 
              className="relative"
              onMouseEnter={() => setIsAboutDropdownOpen(true)}
              onMouseLeave={() => setIsAboutDropdownOpen(false)}
            >
              <button
                className="px-4 py-1.5 text-base font-medium transition-all hover:font-extrabold flex items-center gap-1"
                style={{color: 'var(--color-text-primary)'}}
              >
                道場について
                <svg 
                  className={`w-4 h-4 transition-transform duration-200 ${isAboutDropdownOpen ? 'rotate-180' : ''}`}
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {/* ドロップダウンメニュー */}
              <div 
                className={`absolute top-full left-0 mt-1 w-48 rounded-lg shadow-lg overflow-hidden transition-all duration-200 origin-top ${
                  isAboutDropdownOpen ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0 pointer-events-none'
                }`}
                style={{backgroundColor: 'var(--color-dojo-bg-key)'}}
              >
                <Link
                  href="/about"
                  className="block px-5 py-3 text-base font-medium transition-all hover:font-extrabold"
                  style={{
                    color: 'var(--color-text-primary)',
                    backgroundColor: isAboutDropdownOpen ? 'rgba(255,255,255,0.5)' : 'transparent'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.8)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.5)'}
                >
                  道場紹介
                </Link>
                <Link
                  href="/history"
                  className="block px-5 py-3 text-base font-medium transition-all hover:font-extrabold"
                  style={{
                    color: 'var(--color-text-primary)',
                    backgroundColor: isAboutDropdownOpen ? 'rgba(255,255,255,0.5)' : 'transparent'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.8)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.5)'}
                >
                  道場の歴史
                </Link>
                <Link
                  href="/member"
                  className="block px-5 py-3 text-base font-medium transition-all hover:font-extrabold"
                  style={{
                    color: 'var(--color-text-primary)',
                    backgroundColor: isAboutDropdownOpen ? 'rgba(255,255,255,0.5)' : 'transparent'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.8)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.5)'}
                >
                  指導者紹介
                </Link>
              </div>
            </div>
            
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
        </div>
      </header>
      
      {/* モバイルメニュー - 全画面オーバーレイ */}
      {isMenuOpen && (
        <>
          <div 
            className="md:hidden fixed top-16 left-0 right-0 bottom-0 z-[60]"
            style={{backgroundColor: 'var(--color-dojo-bg-key)'}}
            onClick={() => setIsMenuOpen(false)}
          />
          <nav 
            className="md:hidden fixed top-16 left-0 right-0 bottom-0 z-[70] overflow-y-auto"
            style={{backgroundColor: 'var(--color-dojo-bg-key)'}}
          >
        <div className="container mx-auto px-4 py-6 space-y-6">
          {/* ナビゲーションメニュー */}
          <div className="space-y-2.5 pb-6 border-b" style={{borderColor: 'var(--color-dojoprimary-key)'}}>
            <div>
              <Link
                href="/about"
                className="inline-block py-2 text-base font-medium"
                style={{color: 'var(--color-text-primary)'}}
                onClick={() => setIsMenuOpen(false)}
              >
                道場紹介
              </Link>
            </div>
            <div>
              <Link
                href="/member"
                className="inline-block py-2 text-base font-medium"
                style={{color: 'var(--color-text-primary)'}}
                onClick={() => setIsMenuOpen(false)}
              >
                指導者紹介
              </Link>
            </div>
            <div>
              <Link
                href="/album"
                className="inline-block py-2 text-base font-medium"
                style={{color: 'var(--color-text-primary)'}}
                onClick={() => setIsMenuOpen(false)}
              >
                稽古風景
              </Link>
            </div>
            <div>
              <Link
                href="/category/result"
                className="inline-block py-2 text-base font-medium"
                style={{color: 'var(--color-text-primary)'}}
                onClick={() => setIsMenuOpen(false)}
              >
                大会記録
              </Link>
            </div>
            <div>
              <Link
                href="/posts"
                className="inline-block py-2 text-base font-medium"
                style={{color: 'var(--color-text-primary)'}}
                onClick={() => setIsMenuOpen(false)}
              >
                記事一覧
              </Link>
            </div>
          </div>

          {/* 記事検索セクション */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold" style={{color: 'var(--color-text-primary)'}}>
              記事検索
            </h3>
            
            {/* キーワード検索 */}
            <div>
              <label 
                htmlFor="keyword-search-mobile"
                className="block text-sm font-semibold mb-2"
                style={{color: 'var(--color-text-primary)'}}
              >
                キーワード検索
              </label>
              <form onSubmit={handleMobileKeywordSearch} className="flex gap-2">
                <input 
                  type="search"
                  id="keyword-search-mobile"
                  value={mobileKeyword}
                  onChange={(e) => setMobileKeyword(e.target.value)}
                  placeholder="キーワードを入力"
                  className="flex-1 px-3 py-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-offset-0"
                  style={{
                    borderColor: 'var(--color-dojo-secondary-key)',
                    color: 'var(--color-text-primary)',
                    '--tw-ring-color': 'var(--color-dojoprimary-key)'
                  } as React.CSSProperties}
                />
                <button 
                  type="submit"
                  className="px-4 py-2 text-sm font-medium rounded transition-colors hover:opacity-90"
                  style={{
                    backgroundColor: 'var(--color-dojoprimary-key)',
                    color: 'white'
                  }}
                >
                  検索
                </button>
              </form>
            </div>

            {/* カテゴリー検索 */}
            <div>
              <div 
                className="block text-sm font-semibold mb-2"
                style={{color: 'var(--color-text-primary)'}}
              >
                カテゴリー
              </div>
              <div className="space-y-1.5">
                {activeCategories.map((category: any) => (
                  <div key={category.id}>
                    <Link
                      href={`/category/${category.slug}`}
                      className="inline-block text-sm underline transition-all duration-200 hover:font-bold"
                      style={{color: 'var(--color-text-tertiary)'}}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {category.name} ({category.count})
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* タグ検索 */}
            <div>
              <div 
                className="block text-sm font-semibold mb-2"
                style={{color: 'var(--color-text-primary)'}}
              >
                タグ
              </div>
              <div className="flex flex-wrap gap-2">
                {activeTags.map((tag: any) => (
                  <Link
                    key={tag.id}
                    href={`/tag/${tag.slug}`}
                    className="inline-block px-2 py-1 text-xs rounded border transition-all duration-200 hover:scale-110 hover:shadow-md"
                    style={{
                      backgroundColor: 'var(--color-dojo-bg-accent)',
                      borderColor: 'var(--color-dojo-tertiary-accent)',
                      color: 'var(--color-text-tertiary)'
                    }}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {tag.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
          </nav>
        </>
      )}
    </>
  );
}

