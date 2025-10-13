import Link from 'next/link';
import Image from 'next/image';

interface PostCardProps {
  post: {
    id: number;
    title: {
      rendered: string;
    };
    excerpt: {
      rendered: string;
    };
    slug: string;
    date: string;
    _embedded?: {
      'wp:featuredmedia'?: Array<{
        source_url: string;
        alt_text: string;
      }>;
    };
  };
}

export default function PostCard({ post }: PostCardProps) {
  const featuredImage = post._embedded?.['wp:featuredmedia']?.[0];
  const formattedDate = new Date(post.date).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // HTMLタグを除去してテキストのみを取得
  const stripHtml = (html: string) => {
    return html.replace(/<[^>]*>/g, '').substring(0, 150) + '...';
  };

  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <Link href={`/posts/${post.slug}`}>
        {/* アイキャッチ画像 */}
        {featuredImage ? (
          <div className="relative h-48 w-full">
            <Image
              src={featuredImage.source_url}
              alt={featuredImage.alt_text || post.title.rendered}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        ) : (
          <div className="h-48 w-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
            <span className="text-white text-lg font-semibold">No Image</span>
          </div>
        )}

        {/* コンテンツ */}
        <div className="p-6">
          <time className="text-sm text-gray-500 mb-2 block">
            {formattedDate}
          </time>
          
          <h2 
            className="text-xl font-bold text-gray-800 mb-3 hover:text-blue-600 transition-colors"
            dangerouslySetInnerHTML={{ __html: post.title.rendered }}
          />
          
          <div className="text-gray-600 line-clamp-3">
            {stripHtml(post.excerpt.rendered)}
          </div>
          
          <div className="mt-4">
            <span className="text-blue-600 font-medium inline-flex items-center">
              続きを読む
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}

