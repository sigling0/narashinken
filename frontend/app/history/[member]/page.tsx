import { getChildPageBySlug } from '@/lib/wordpress';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import PostImageGallery from '@/components/PostImageGallery';
import { parseHistoryContent } from '@/lib/parseHistoryContent';

export const revalidate = 3600; // 1時間ごとに再生成

interface Props {
  params: Promise<{ member: string }>;
}

// メタデータの生成
export async function generateMetadata({ params }: Props) {
  const { member } = await params;
  
  try {
    const page = await getChildPageBySlug('history', member);
    
    if (!page) {
      return {
        title: 'ページが見つかりません',
      };
    }

    // 本文を解析して年度と主将名を取得
    const parsed = parseHistoryContent(page.content.rendered, page.title.rendered);
    const captainNameText = parsed.captainName.replace(/<[^>]*>/g, '').trim();

    return {
      title: `${parsed.year}年度 ${captainNameText} - 歴代主将 - 奈良心剣道場`,
      description: parsed.memberList.replace(/<[^>]*>/g, '').substring(0, 160),
    };
  } catch (error) {
    return {
      title: 'エラー',
    };
  }
}

export default async function MemberPage({ params }: Props) {
  const { member } = await params;
  
  let page = null;
  let error = null;

  try {
    page = await getChildPageBySlug('history', member);
    
    if (!page) {
      notFound();
    }
  } catch (e) {
    error = 'データの取得に失敗しました';
    console.error('Error fetching member page:', e);
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
  
  // 本文を解析
  const parsed = parseHistoryContent(page.content.rendered, page.title.rendered);
  const { year, captainName, memberList, battleRecords, images, errors } = parsed;

  return (
    <article className="container mx-auto px-4 py-8 max-w-4xl" style={{backgroundColor: 'var(--color-dojo-bg-key)'}}>
      {/* パンくずリスト */}
      <nav className="mb-8 text-sm" style={{color: 'var(--color-text-tertiary)'}}>
        <Link href="/" className="hover:underline">ホーム</Link>
        <span className="mx-2">/</span>
        <Link href="/history" className="hover:underline">道場の歴史</Link>
        <span className="mx-2">/</span>
        <span style={{color: 'var(--color-text-primary)'}}>
          {year ? `${year}年度` : page.title.rendered}
        </span>
      </nav>

      {/* アイキャッチ画像 - スマホ: 元の縦横比保持、PC: 固定高さ */}
      {featuredImage && (
        <>
          {/* モバイル表示: 元の縦横比を保持（ネイティブimg使用） */}
          <div className="md:hidden w-full mb-8">
            <img
              src={featuredImage.source_url}
              alt={featuredImage.alt_text || `${year}年度`}
              className="w-full h-auto rounded-lg shadow-sm"
              loading="eager"
            />
          </div>
          
          {/* デスクトップ表示: 固定高さ（Next.js Image使用） */}
          <div className="hidden md:block relative w-full h-96 mb-8 rounded-xl overflow-hidden">
            <Image
              src={featuredImage.source_url}
              alt={featuredImage.alt_text || `${year}年度`}
              fill
              className="object-cover"
              priority
              sizes="1200px"
            />
          </div>
        </>
      )}

      {/* タイトルとメタ情報 */}
      <header className="mb-8">
        <h1 
          className="text-4xl md:text-5xl font-bold mb-4"
          style={{color: 'var(--color-text-primary)'}}
        >
          {year ? `${year}年度` : page.title.rendered}
        </h1>

        {/* 主将名とエラー表示を統合 */}
        <div className="flex items-center space-x-4 mb-4" style={{color: 'var(--color-text-tertiary)'}}>
          {captainName && (
            <>
              <span className="text-sm">主将:</span>
              <span 
                className="text-lg font-semibold"
                style={{color: 'var(--color-dojoprimary-key)'}}
                dangerouslySetInnerHTML={{ __html: captainName }}
              />
            </>
          )}
          {errors.length > 0 && (
            <span className="text-xs px-2 py-1 rounded" style={{backgroundColor: '#fee2e2', color: '#991b1b'}}>
              データ構造エラーあり
            </span>
          )}
        </div>
      </header>

      {/* メンバー */}
      {memberList && (
        <section className="mb-8">
          <h2 
            className="text-xl font-bold mb-3"
            style={{color: 'var(--color-text-secondary)'}}
          >
            メンバー
          </h2>
          <div 
            className="prose prose-lg max-w-none"
            style={{color: 'var(--color-text-primary)'}}
            dangerouslySetInnerHTML={{ __html: memberList }}
          />
        </section>
      )}

      {/* 大会成績 */}
      {battleRecords && (
        <section className="mb-12">
          <h2 
            className="text-xl font-bold mb-3"
            style={{color: 'var(--color-text-secondary)'}}
          >
            大会成績
          </h2>
          <div 
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: battleRecords }}
          />
        </section>
      )}

      {/* 画像ギャラリー */}
      <PostImageGallery images={images} />

      {/* 戻るボタン */}
      <div className="mt-12 pt-8 border-t" style={{borderColor: 'var(--color-dojo-secondary-key)'}}>
        <Link
          href="/history"
          className="inline-flex items-center font-medium hover:underline transition-colors"
          style={{color: 'var(--color-dojoprimary-key)'}}
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          歴代主将一覧に戻る
        </Link>
      </div>
    </article>
  );
}



