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

      {/* エラー表示 */}
      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
          <div className="flex items-start">
            <svg className="w-6 h-6 text-red-500 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-red-800 mb-2">データ構造エラー</h3>
              <p className="text-sm text-red-700 mb-3">
                このページの本文が正しい形式で入力されていません。以下のエラーを修正してください：
              </p>
              <ul className="text-sm text-red-700 space-y-1 list-disc pl-5">
                {errors.map((error, idx) => (
                  <li key={idx}>{error}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

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

      {/* タイトル・基本情報 */}
      <header className="mb-8">
        <h1 
          className="text-4xl md:text-5xl font-bold mb-6"
          style={{color: 'var(--color-text-primary)'}}
        >
          {year ? `${year}年度` : page.title.rendered}
        </h1>

        {/* 主将名 */}
        {captainName && (
          <div 
            className="mb-4 p-4 rounded-lg"
            style={{backgroundColor: 'var(--color-dojo-bg-accent)'}}
          >
            <span className="text-sm font-semibold" style={{color: 'var(--color-text-secondary)'}}>
              主将:
            </span>
            <span 
              className="ml-2 text-2xl font-bold"
              style={{color: 'var(--color-dojoprimary-key)'}}
              dangerouslySetInnerHTML={{ __html: captainName }}
            />
          </div>
        )}

        {/* メンバー */}
        {memberList && (
          <div 
            className="mb-4 p-4 rounded-lg"
            style={{backgroundColor: 'white', border: '1px solid var(--color-dojo-tertiary-accent)'}}
          >
            <h2 className="text-lg font-semibold mb-2" style={{color: 'var(--color-text-secondary)'}}>
              メンバー
            </h2>
            <div 
              className="prose max-w-none"
              style={{color: 'var(--color-text-primary)'}}
              dangerouslySetInnerHTML={{ __html: memberList }}
            />
          </div>
        )}
      </header>

      {/* 大会成績 */}
      {battleRecords && (
        <section className="mb-12">
          <h2 
            className="text-2xl font-bold mb-4 pb-2 border-b-2"
            style={{
              color: 'var(--color-text-primary)',
              borderColor: 'var(--color-dojo-secondary-key)'
            }}
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
      {images.length > 0 && (
        <section className="mb-12">
          <h2 
            className="text-2xl font-bold mb-4 pb-2 border-b-2"
            style={{
              color: 'var(--color-text-primary)',
              borderColor: 'var(--color-dojo-secondary-key)'
            }}
          >
            ギャラリー
          </h2>
          <PostImageGallery images={images} />
        </section>
      )}

      {/* ナビゲーション */}
      <div className="mt-12 pt-8 border-t flex justify-between" style={{borderColor: 'var(--color-dojo-secondary-key)'}}>
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
        
        <Link
          href="/"
          className="inline-flex items-center font-medium hover:underline transition-colors"
          style={{color: 'var(--color-text-secondary)'}}
        >
          ホームに戻る
        </Link>
      </div>
    </article>
  );
}



