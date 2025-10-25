'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface SearchSectionProps {
  categories: any[];
  tags: any[];
}

// 小セクションヘッダーコンポーネント
function SmallSectionHeader({ title }: { title: string }) {
  return (
    <header 
      className="flex items-end mb-4.5 pb-0.5 relative border-b-2"
      style={{borderColor: 'var(--color-dojoprimary-key)'}}
    >
      <div 
        className="absolute left-0 top-0 w-2 h-full"
        style={{backgroundColor: 'var(--color-dojoprimary-key)'}}
      />
      <h5 
        className="text-lg font-extrabold pl-4.5 py-0.5"
        style={{color: 'var(--color-text-title)'}}
      >
        {title}
      </h5>
    </header>
  );
}

export default function SearchSection({ categories, tags }: SearchSectionProps) {
  const router = useRouter();
  const [keyword, setKeyword] = useState('');
  
  // キーワード検索の実行
  const handleKeywordSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (keyword.trim()) {
      router.push(`/posts?search=${encodeURIComponent(keyword.trim())}`);
    }
  };
  
  return (
    <section>
      <SmallSectionHeader title="記事検索" />
      <div className="space-y-4">
        {/* キーワード検索 */}
        <div>
          <label 
            htmlFor="keyword-search-home"
            className="block text-sm font-semibold mb-2"
            style={{color: 'var(--color-text-primary)'}}
          >
            キーワード検索
          </label>
          <form onSubmit={handleKeywordSearch} className="flex gap-2">
            <input 
              type="search"
              id="keyword-search-home"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
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
            {categories
              .filter((cat: any) => cat.count > 0)
              .sort((a: any, b: any) => b.count - a.count)
              .slice(0, 10)
              .map((category: any) => (
                <div key={category.id}>
                  <Link
                    href={`/category/${category.slug}`}
                    className="inline-block text-sm underline transition-all duration-200 hover:font-bold hover:translate-x-1"
                    style={{color: 'var(--color-text-tertiary)'}}
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
            {tags
              .filter((tag: any) => tag.count > 0)
              .sort((a: any, b: any) => b.count - a.count)
              .slice(0, 15)
              .map((tag: any) => (
                <Link
                  key={tag.id}
                  href={`/tag/${tag.slug}`}
                  className="inline-block px-2 py-1 text-xs rounded border transition-all duration-200 hover:scale-110 hover:shadow-md"
                  style={{
                    backgroundColor: 'var(--color-dojo-bg-accent)',
                    borderColor: 'var(--color-dojo-tertiary-accent)',
                    color: 'var(--color-text-tertiary)'
                  }}
                >
                  {tag.name}
                </Link>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
}

