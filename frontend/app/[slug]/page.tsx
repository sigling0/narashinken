import { getPageBySlug, getAllPageSlugs } from '@/lib/wordpress';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export const revalidate = 3600;

interface Props {
  params: Promise<{ slug: string }>;
}

// 静的パスの生成
export async function generateStaticParams() {
  try {
    const slugs = await getAllPageSlugs();
    return slugs.map((slug) => ({
      slug: slug,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

// メタデータの生成
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  
  try {
    const page = await getPageBySlug(slug);
    
    if (!page) {
      return {
        title: 'ページが見つかりません',
      };
    }

    return {
      title: `${page.title.rendered} - 奈良新聞`,
      description: page.excerpt.rendered.replace(/<[^>]*>/g, '').substring(0, 160),
    };
  } catch (error) {
    return {
      title: 'エラー',
    };
  }
}

export default async function PageSlug({ params }: Props) {
  const { slug } = await params;
  
  let page = null;
  let error = null;

  try {
    page = await getPageBySlug(slug);
    
    if (!page) {
      notFound();
    }
  } catch (e) {
    error = 'データの取得に失敗しました';
    console.error('Error fetching page:', e);
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
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* パンくずリスト */}
      <nav className="mb-8 text-sm text-gray-600">
        <Link href="/" className="hover:text-blue-600">ホーム</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800">{page.title.rendered}</span>
      </nav>

      {/* アイキャッチ画像 */}
      {featuredImage && (
        <div className="relative h-96 w-full mb-8 rounded-xl overflow-hidden">
          <Image
            src={featuredImage.source_url}
            alt={featuredImage.alt_text || page.title.rendered}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 1200px) 100vw, 1200px"
          />
        </div>
      )}

      {/* タイトル */}
      <header className="mb-8">
        <h1 
          className="text-4xl md:text-5xl font-bold text-gray-900"
          dangerouslySetInnerHTML={{ __html: page.title.rendered }}
        />
      </header>

      {/* コンテンツ */}
      <div 
        className="prose prose-lg max-w-none mb-12"
        dangerouslySetInnerHTML={{ __html: page.content.rendered }}
      />

      {/* 戻るボタン */}
      <div className="mt-12 pt-8 border-t">
        <Link
          href="/"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          ホームに戻る
        </Link>
      </div>
    </div>
  );
}

