import { getPostBySlug, getAllPostSlugs } from '@/lib/wordpress';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export const revalidate = 3600; // 1時間ごとに再生成

interface Props {
  params: Promise<{ slug: string }>;
}

// 静的パスの生成
export async function generateStaticParams() {
  try {
    const slugs = await getAllPostSlugs();
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
    const post = await getPostBySlug(slug);
    
    if (!post) {
      return {
        title: '記事が見つかりません',
      };
    }

    return {
      title: `${post.title.rendered} - 奈良新聞`,
      description: post.excerpt.rendered.replace(/<[^>]*>/g, '').substring(0, 160),
    };
  } catch (error) {
    return {
      title: 'エラー',
    };
  }
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  
  let post = null;
  let error = null;

  try {
    post = await getPostBySlug(slug);
    
    if (!post) {
      notFound();
    }
  } catch (e) {
    error = 'データの取得に失敗しました';
    console.error('Error fetching post:', e);
  }

  if (error || !post) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-red-800">
          <p className="font-medium">{error || '記事が見つかりませんでした'}</p>
        </div>
      </div>
    );
  }

  const featuredImage = post._embedded?.['wp:featuredmedia']?.[0];
  const formattedDate = new Date(post.date).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <article className="container mx-auto px-4 py-8 max-w-4xl">
      {/* パンくずリスト */}
      <nav className="mb-8 text-sm text-gray-600">
        <Link href="/" className="hover:text-blue-600">ホーム</Link>
        <span className="mx-2">/</span>
        <Link href="/posts" className="hover:text-blue-600">記事一覧</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800">{post.title.rendered}</span>
      </nav>

      {/* アイキャッチ画像 */}
      {featuredImage && (
        <div className="relative h-96 w-full mb-8 rounded-xl overflow-hidden">
          <Image
            src={featuredImage.source_url}
            alt={featuredImage.alt_text || post.title.rendered}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 1200px) 100vw, 1200px"
          />
        </div>
      )}

      {/* タイトルとメタ情報 */}
      <header className="mb-8">
        <h1 
          className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
          dangerouslySetInnerHTML={{ __html: post.title.rendered }}
        />
        
        <div className="flex items-center text-gray-600 space-x-4">
          <time>{formattedDate}</time>
          {post._embedded?.author?.[0] && (
            <>
              <span>•</span>
              <span>執筆: {post._embedded.author[0].name}</span>
            </>
          )}
        </div>

        {/* カテゴリー */}
        {post._embedded?.['wp:term']?.[0] && post._embedded['wp:term'][0].length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {post._embedded['wp:term'][0].map((category: any) => (
              <Link
                key={category.id}
                href={`/category/${category.slug}`}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm hover:bg-blue-200 transition-colors"
              >
                {category.name}
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* 記事本文 */}
      <div 
        className="prose prose-lg max-w-none mb-12"
        dangerouslySetInnerHTML={{ __html: post.content.rendered }}
      />

      {/* タグ */}
      {post._embedded?.['wp:term']?.[1] && post._embedded['wp:term'][1].length > 0 && (
        <div className="border-t pt-6">
          <h3 className="text-sm font-semibold text-gray-600 mb-3">タグ:</h3>
          <div className="flex flex-wrap gap-2">
            {post._embedded['wp:term'][1].map((tag: any) => (
              <Link
                key={tag.id}
                href={`/tag/${tag.slug}`}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
              >
                #{tag.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* 戻るボタン */}
      <div className="mt-12 pt-8 border-t">
        <Link
          href="/posts"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          記事一覧に戻る
        </Link>
      </div>
    </article>
  );
}

