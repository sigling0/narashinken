import { getPageBySlug, getChildPages } from '@/lib/wordpress';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import HistoryAccordion from './HistoryAccordion';

export const revalidate = 3600; // 1時間ごとに再生成

// メタデータの生成
export async function generateMetadata() {
  try {
    const page = await getPageBySlug('history');
    
    if (!page) {
      return {
        title: 'ページが見つかりません',
      };
    }

    return {
      title: `${page.title.rendered} - 奈良心剣道場`,
      description: page.excerpt.rendered.replace(/<[^>]*>/g, '').substring(0, 160),
    };
  } catch (error) {
    return {
      title: 'エラー',
    };
  }
}

export default async function HistoryPage() {
  let page = null;
  let childPages: any[] = [];
  let error = null;

  try {
    // 親ページを取得
    page = await getPageBySlug('history');
    console.log('=== History Page Debug ===');
    console.log('Parent page found:', !!page);
    
    if (!page) {
      console.log('Parent page not found, returning 404');
      notFound();
    }

    // 子ページ（歴代主将）を取得
    childPages = await getChildPages('history');
    console.log('Child pages count:', childPages.length);
    console.log('Child pages:', childPages.map((p: any) => ({ slug: p.slug, title: p.title.rendered })));
  } catch (e) {
    error = 'データの取得に失敗しました';
    console.error('Error fetching history page:', e);
  }

  if (error || !page) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-red-800">
          <p className="font-medium">{error || 'ページが見つかりませんでした'}</p>
        </div>
      </div>
    );
  }

  const featuredImage = page._embedded?.['wp:featuredmedia']?.[0];

  return (
    <article className="container mx-auto px-4 py-8 max-w-4xl" style={{backgroundColor: 'var(--color-dojo-bg-key)'}}>
      {/* パンくずリスト */}
      <nav className="mb-8 text-sm" style={{color: 'var(--color-text-tertiary)'}}>
        <Link href="/" className="hover:underline">ホーム</Link>
        <span className="mx-2">/</span>
        <span style={{color: 'var(--color-text-primary)'}}>{page.title.rendered}</span>
      </nav>

      {/* アイキャッチ画像 - スマホ: 元の縦横比保持、PC: 固定高さ */}
      {featuredImage && (
        <>
          {/* モバイル表示: 元の縦横比を保持（ネイティブimg使用） */}
          <div className="md:hidden w-full mb-8">
            <img
              src={featuredImage.source_url}
              alt={featuredImage.alt_text || page.title.rendered}
              className="w-full h-auto rounded-lg shadow-sm"
              loading="eager"
            />
          </div>
          
          {/* デスクトップ表示: 固定高さ（Next.js Image使用） */}
          <div className="hidden md:block relative w-full h-96 mb-8 rounded-xl overflow-hidden">
            <Image
              src={featuredImage.source_url}
              alt={featuredImage.alt_text || page.title.rendered}
              fill
              className="object-cover"
              priority
              sizes="1200px"
            />
          </div>
        </>
      )}

      {/* タイトル */}
      <header className="mb-8">
        <h1 
          className="text-4xl md:text-5xl font-bold mb-4"
          style={{color: 'var(--color-text-primary)'}}
          dangerouslySetInnerHTML={{ __html: page.title.rendered }}
        />
      </header>

      {/* ページ本文 */}
      <div 
        className="prose prose-lg max-w-none mb-12"
        dangerouslySetInnerHTML={{ __html: page.content.rendered }}
      />

      {/* 歴代主将一覧（アコーディオン形式） */}
      {childPages.length > 0 && (
        <section className="mt-16">
          <h2 
            className="text-3xl font-bold mb-8 pb-4 border-b-2"
            style={{
              color: 'var(--color-text-primary)',
              borderColor: 'var(--color-dojo-secondary-key)'
            }}
          >
            歴代主将一覧
          </h2>

          <HistoryAccordion childPages={childPages} />
        </section>
      )}

      {/* 戻るボタン */}
      <div className="mt-12 pt-8 border-t" style={{borderColor: 'var(--color-dojo-secondary-key)'}}>
        <Link
          href="/"
          className="inline-flex items-center font-medium hover:underline transition-colors"
          style={{color: 'var(--color-dojoprimary-key)'}}
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          ホームに戻る
        </Link>
      </div>
    </article>
  );
}
