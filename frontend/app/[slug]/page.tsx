import { getPageBySlug, getAllPageSlugs } from '@/lib/wordpress';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import PostImageGallery from '@/components/PostImageGallery';

export const revalidate = 3600;

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

// 指導者紹介ページ用にコンテンツを再構成（h2 + 画像 + 本文のブロックを横並び用マークアップに変換）
function enhanceMemberContentLayout(html: string): string {
  if (!html) return html;

  // h2で分割し、各ブロックをセクション化する
  const segments = html.split(/(?=<h2\b[^>]*>)/i);

  const processed = segments.map((segment) => {
    const trimmed = segment.trim();
    if (!trimmed) {
      return '';
    }

    const headingMatch = trimmed.match(/^(<h2[^>]*>[\s\S]*?<\/h2>)([\s\S]*)$/i);
    if (!headingMatch) {
      return segment;
    }

    const heading = headingMatch[1];
    let remainder = headingMatch[2].trim();

    if (!remainder) {
      return segment;
    }

    const mediaMatch = remainder.match(
      /^(\s*(?:<figure[\s\S]*?<\/figure>|<p[^>]*>\s*<img[^>]*>\s*<\/p>))([\s\S]*)$/i
    );

    if (!mediaMatch) {
      return segment;
    }

    const media = mediaMatch[1];
    const detail = mediaMatch[2].trim();

    if (!detail) {
      return segment;
    }

    return `
      <section class="member-entry">
        ${heading}
        <div class="member-entry__body">
          <div class="member-entry__media">
            ${media}
          </div>
          <div class="member-entry__detail">
            ${detail}
          </div>
        </div>
      </section>
    `;
  });

  return processed.join('');
}

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
      title: `${page.title.rendered} - 奈良心剣道場`,
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
  
  // 画像ギャラリーを無効にするページのslugリスト
  const DISABLE_GALLERY_PAGES = [
    'dojo-introduction', 'introduction', 'about', 'dojo',
    'member', 'instructor-introduction', 'instructors', 'coaches', 'teachers', 'shidosha'
  ];
  
  // 画像ギャラリーを使うかどうかを判定
  const shouldUseGallery = !DISABLE_GALLERY_PAGES.includes(slug);
  
  // 画像ギャラリーを使う場合のみ本文から画像を抽出
  const { images, contentWithoutImages } = shouldUseGallery
    ? extractImagesFromContent(page.content.rendered)
    : { images: [], contentWithoutImages: page.content.rendered };

  const renderedContent =
    slug === 'member'
      ? enhanceMemberContentLayout(contentWithoutImages)
      : contentWithoutImages;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl" style={{backgroundColor: 'var(--color-dojo-bg-key)'}}>
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
          className="text-4xl md:text-5xl font-bold"
          style={{color: 'var(--color-text-primary)'}}
          dangerouslySetInnerHTML={{ __html: page.title.rendered }}
        />
      </header>

      {/* コンテンツ */}
      <div 
        className={`prose prose-lg max-w-none mb-12${slug === 'member' ? ' member-content' : ''}`}
        dangerouslySetInnerHTML={{ __html: renderedContent }}
      />

      {/* 画像ギャラリー（画像がある場合のみ表示） */}
      {images.length > 0 && <PostImageGallery images={images} />}

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
    </div>
  );
}

