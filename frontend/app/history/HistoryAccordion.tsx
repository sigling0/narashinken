'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import PostImageGallery from '@/components/PostImageGallery';
import { parseHistoryContent } from '@/lib/parseHistoryContent';

interface HistoryAccordionProps {
  childPages: any[];
}

export default function HistoryAccordion({ childPages }: HistoryAccordionProps) {
  const [expandedYear, setExpandedYear] = useState<string | null>(null);

  const toggleYear = (slug: string) => {
    setExpandedYear(expandedYear === slug ? null : slug);
  };

  return (
    <div className="space-y-4">
      {childPages.map((childPage) => {
        const featuredImg = childPage._embedded?.['wp:featuredmedia']?.[0];
        const isExpanded = expandedYear === childPage.slug;
        
        // 本文を解析
        const parsed = parseHistoryContent(
          childPage.content.rendered,
          childPage.title.rendered
        );
        
        const { year, captainName, memberList, battleRecords, images, errors } = parsed;

        return (
          <div 
            key={childPage.id}
            className="rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg"
            style={{
              backgroundColor: 'white',
              boxShadow: errors.length > 0 
                ? 'rgba(239, 68, 68, 0.3) 0px 2px 8px 2px' // エラー時は赤い影
                : isExpanded 
                  ? 'rgba(0,0,0,0.25) 0px 4px 12px 2px' // 展開時は濃い影
                  : 'rgba(0,0,0,0.16) 1px 1px 4px 2px' // 通常時はPostCardと同じ影
            }}
          >
            {/* エラー表示 */}
            {errors.length > 0 && (
              <div className="bg-red-50 border-b border-red-200 p-4">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-red-800 mb-1">データ構造エラー</h4>
                    <ul className="text-sm text-red-700 space-y-1">
                      {errors.map((error, idx) => (
                        <li key={idx}>• {error}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* ヘッダー（クリック可能） */}
            <button
              onClick={() => toggleYear(childPage.slug)}
              className="w-full px-6 py-5 text-left hover:bg-gray-50 transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 
                    className="text-xl font-extrabold mb-2.5"
                    style={{color: 'var(--color-text-primary)'}}
                  >
                    {year ? `${year}年度` : childPage.title.rendered}
                  </h3>

                  <div className="mb-1.5">
                    <span className="text-sm font-medium" style={{color: 'var(--color-text-secondary)'}}>
                      主将:
                    </span>
                    <span 
                      className="ml-2 text-base font-bold"
                      style={{color: 'var(--color-text-primary)'}}
                    >
                      {captainName ? (
                        <span dangerouslySetInnerHTML={{ __html: captainName.replace(/<p[^>]*>(.*?)<\/p>/i, '$1') }} />
                      ) : (
                        <span className="text-red-500">データなし</span>
                      )}
                    </span>
                  </div>

                  {memberList && !isExpanded && (
                    <div className="text-sm" style={{color: 'var(--color-text-secondary)'}}>
                      <span className="font-medium">メンバー: </span>
                      <span dangerouslySetInnerHTML={{ 
                        __html: memberList.replace(/<[^>]*>/g, ' ').substring(0, 45)
                      }} />
                      {memberList.length > 45 && '...'}
                    </div>
                  )}
                </div>

                <div className="ml-4">
                  <svg 
                    className={`w-6 h-6 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                    style={{color: 'var(--color-dojoprimary-key)'}}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </button>

            {/* 展開部分 */}
            <div 
              className={`overflow-hidden transition-all duration-300 ${
                isExpanded ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="px-6 pb-6 pt-4 bg-gray-50" style={{borderTop: '1px solid rgba(0,0,0,0.05)'}}>
                {featuredImg && (
                  <div className="relative w-full h-64 mb-6 mt-2 rounded-lg overflow-hidden shadow-md">
                    <Image
                      src={featuredImg.source_url}
                      alt={featuredImg.alt_text || `${year}年度`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 768px"
                    />
                  </div>
                )}

                {/* 主将 */}
                {captainName && (
                  <div className="mb-5">
                    <h4 className="text-base font-extrabold mb-3 pb-2 border-b" style={{color: 'var(--color-text-primary)', borderColor: 'rgba(0,0,0,0.08)'}}>
                      主将
                    </h4>
                    <div 
                      className="prose max-w-none text-sm"
                      style={{color: 'var(--color-text-secondary)'}}
                      dangerouslySetInnerHTML={{ __html: captainName }}
                    />
                  </div>
                )}

                {/* メンバー */}
                {memberList && (
                  <div className="mb-5">
                    <h4 className="text-base font-extrabold mb-3 pb-2 border-b" style={{color: 'var(--color-text-primary)', borderColor: 'rgba(0,0,0,0.08)'}}>
                      メンバー
                    </h4>
                    <div 
                      className="prose max-w-none text-sm"
                      style={{color: 'var(--color-text-secondary)'}}
                      dangerouslySetInnerHTML={{ __html: memberList }}
                    />
                  </div>
                )}

                {/* 大会成績 */}
                {battleRecords && (
                  <div className="mb-5">
                    <h4 className="text-base font-extrabold mb-3 pb-2 border-b" style={{color: 'var(--color-text-primary)', borderColor: 'rgba(0,0,0,0.08)'}}>
                      大会成績
                    </h4>
                    <div 
                      className="prose max-w-none text-sm"
                      dangerouslySetInnerHTML={{ __html: battleRecords }}
                    />
                  </div>
                )}

                {/* 画像ギャラリー */}
                {images.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-base font-extrabold mb-3 pb-2 border-b" style={{color: 'var(--color-text-primary)', borderColor: 'rgba(0,0,0,0.08)'}}>
                      ギャラリー
                    </h4>
                    <PostImageGallery images={images} />
                  </div>
                )}

                {/* 詳細ページリンク */}
                <Link
                  href={`/history/${childPage.slug}`}
                  className="inline-flex items-center px-6 py-2.5 rounded-lg text-white font-medium transition-all duration-300 hover:opacity-90 hover:shadow-lg hover:-translate-y-0.5"
                  style={{backgroundColor: 'var(--color-dojoprimary-key)'}}
                >
                  詳細ページを見る
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}



