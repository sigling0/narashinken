import { getPostById, getAllPostIds } from '@/lib/wordpress';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import PostImageGallery from '@/components/PostImageGallery';

export const revalidate = 3600; // 1時間ごとに再生成

interface Props {
  params: Promise<{ id: string }>;
}

// 本文HTMLから画像URLを抽出し、画像を削除した本文を返す
function extractImagesFromContent(html: string): { images: string[], contentWithoutImages: string } {
  const images: string[] = [];
  
  // <img>タグからsrc属性を抽出
  const imgRegex = /<img[^>]+src="([^">]+)"/g;
  let match;
  
  while ((match = imgRegex.exec(html)) !== null) {
    images.push(match[1]);
  }
  
  // 本文から画像タグを削除（画像を含む<figure>や<p>タグごと削除）
  let contentWithoutImages = html;
  
  // <figure class="wp-block-image">...</figure> を削除
  contentWithoutImages = contentWithoutImages.replace(/<figure[^>]*class="[^"]*wp-block-image[^"]*"[^>]*>[\s\S]*?<\/figure>/gi, '');
  
  // 残った<img>タグも削除（<p>タグで囲まれている場合は<p>タグも削除）
  contentWithoutImages = contentWithoutImages.replace(/<p[^>]*>\s*<img[^>]*>\s*<\/p>/gi, '');
  contentWithoutImages = contentWithoutImages.replace(/<img[^>]*>/gi, '');
  
  // 連続する空の<p>タグを削除
  contentWithoutImages = contentWithoutImages.replace(/(<p[^>]*>\s*<\/p>\s*)+/gi, '');
  
  return { images, contentWithoutImages };
}

// 静的パスの生成
export async function generateStaticParams() {
  try {
    const ids = await getAllPostIds();
    return ids.map((id) => ({
      id: id.toString(),
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

// メタデータの生成
export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  
  try {
    const post = await getPostById(parseInt(id));
    
    if (!post) {
      return {
        title: '記事が見つかりません',
      };
    }

    return {
      title: `${post.title.rendered} - 奈良心剣道場`,
      description: post.excerpt.rendered.replace(/<[^>]*>/g, '').substring(0, 160),
    };
  } catch (error) {
    return {
      title: 'エラー',
    };
  }
}

export default async function PostPage({ params }: Props) {
  const { id } = await params;
  
  let post = null;
  let error = null;

  try {
    post = await getPostById(parseInt(id));
    
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

  // 本文から画像を抽出
  const { images, contentWithoutImages } = extractImagesFromContent(post.content.rendered);

  return (
    <article className="container mx-auto px-4 py-8 max-w-4xl" style={{backgroundColor: 'var(--color-dojo-bg-key)'}}>
      {/* パンくずリスト */}
      <nav className="mb-8 text-sm" style={{color: 'var(--color-text-tertiary)'}}>
        <Link href="/" className="hover:underline">ホーム</Link>
        <span className="mx-2">/</span>
        <Link href="/posts" className="hover:underline">記事一覧</Link>
        <span className="mx-2">/</span>
        <span style={{color: 'var(--color-text-primary)'}}>{post.title.rendered}</span>
      </nav>

      {/* アイキャッチ画像 */}
      {featuredImage && (
        <div 
          className="relative w-full mb-8 rounded-xl overflow-hidden h-64 md:h-96"
          style={{ backgroundColor: '#f3f4f6' }}
        >
          <Image
            src={featuredImage.source_url}
            alt={featuredImage.alt_text || post.title.rendered}
            fill
            className="object-contain"
            priority
            sizes="(max-width: 768px) 100vw, 1200px"
          />
        </div>
      )}

      {/* タイトルとメタ情報 */}
      <header className="mb-8">
        <h1 
          className="text-4xl md:text-5xl font-bold mb-4"
          style={{color: 'var(--color-text-primary)'}}
          dangerouslySetInnerHTML={{ __html: post.title.rendered }}
        />
        
        <div className="flex items-center space-x-4" style={{color: 'var(--color-text-tertiary)'}}>
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
                className="px-3 py-1 rounded-full text-sm border transition-all duration-300 hover:scale-110 hover:shadow-md"
                style={{
                  backgroundColor: 'var(--color-dojo-bg-accent)',
                  borderColor: 'var(--color-dojo-tertiary-accent)',
                  color: 'var(--color-text-primary)'
                }}
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
        dangerouslySetInnerHTML={{ __html: contentWithoutImages }}
      />

      {/* 画像ギャラリー */}
      <PostImageGallery images={images} />

      {/* タグ */}
      {post._embedded?.['wp:term']?.[1] && post._embedded['wp:term'][1].length > 0 && (
        <div className="border-t pt-6" style={{borderColor: 'var(--color-dojo-tertiary-accent)'}}>
          <h3 className="text-sm font-semibold mb-3" style={{color: 'var(--color-text-secondary)'}}>タグ:</h3>
          <div className="flex flex-wrap gap-2">
            {post._embedded['wp:term'][1].map((tag: any) => (
              <Link
                key={tag.id}
                href={`/tag/${tag.slug}`}
                className="px-3 py-1 rounded-full text-sm border transition-all duration-300 hover:scale-110 hover:shadow-md"
                style={{
                  backgroundColor: 'var(--color-dojo-bg-accent)',
                  borderColor: 'var(--color-dojo-tertiary-accent)',
                  color: 'var(--color-text-tertiary)'
                }}
              >
                #{tag.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* 戻るボタン */}
      <div className="mt-12 pt-8 border-t" style={{borderColor: 'var(--color-dojo-secondary-key)'}}>
        <Link
          href="/posts"
          className="inline-flex items-center font-medium hover:underline transition-colors"
          style={{color: 'var(--color-dojoprimary-key)'}}
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

