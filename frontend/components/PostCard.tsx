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
    modified?: string;
    _embedded?: {
      'wp:featuredmedia'?: Array<{
        source_url: string;
        alt_text: string;
      }>;
      'wp:term'?: Array<Array<{
        id: number;
        name: string;
        slug: string;
      }>>;
    };
  };
}

export default function PostCard({ post }: PostCardProps) {
  const featuredImage = post._embedded?.['wp:featuredmedia']?.[0];
  const tags = post._embedded?.['wp:term']?.[1] || [];
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).replace(/\//g, '年').replace(/年(\d+)月/, '年$1月') + '日';
  };

  // HTMLタグを除去してテキストのみを取得
  const stripHtml = (html: string) => {
    return html.replace(/<[^>]*>/g, '').trim().substring(0, 80) + '...';
  };

  return (
    <Link href={`/posts/${post.slug}`}>
      <article 
        className="block rounded-lg overflow-hidden transition-shadow duration-200"
        style={{
          boxShadow: 'rgba(0,0,0,0.16) 1px 1px 4px 2px'
        }}
      >
        {/* アイキャッチ画像 */}
        <div className="relative w-full h-44">
          {featuredImage ? (
            <Image
              src={featuredImage.source_url}
              alt={featuredImage.alt_text || post.title.rendered}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div 
              className="w-full h-full flex items-center justify-center"
              style={{backgroundColor: 'var(--color-dojo-beige-active)'}}
            >
              <span className="text-sm" style={{color: 'var(--color-text-tertiary)'}}>No Image</span>
            </div>
          )}
        </div>

        {/* コンテンツ */}
        <div className="px-4 py-3">
          <h5 
            className="text-lg font-extrabold leading-normal mb-2 mr-4"
            style={{color: 'var(--color-text-primary)'}}
            dangerouslySetInnerHTML={{ __html: post.title.rendered }}
          />
          
          {/* 抜粋 */}
          <div 
            className="text-sm mb-3 leading-relaxed"
            style={{color: 'var(--color-text-secondary)'}}
          >
            {stripHtml(post.excerpt.rendered)}
          </div>
          
          {/* タグ・投稿日付 */}
          <div>
            {/* タグ */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {tags.slice(0, 3).map((tag) => (
                  <span 
                    key={tag.id}
                    className="inline-block px-1.5 py-0.5 rounded text-xs"
                    style={{
                      backgroundColor: 'var(--color-dojo-tag)',
                      color: 'var(--color-text-tertiary)'
                    }}
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            )}
            
            {/* 投稿日時 */}
            <div className="flex items-center gap-1 text-xs" style={{color: 'var(--color-text-tertiary)'}}>
              <svg xmlns="http://www.w3.org/2000/svg" width="14px" height="14px" viewBox="0 0 512 512" fill="currentColor">
                <path d="M224 32H64C46.3 32 32 46.3 32 64v64c0 17.7 14.3 32 32 32H441.4c4.2 0 8.3-1.7 11.3-4.7l48-48c6.2-6.2 6.2-16.4 0-22.6l-48-48c-3-3-7.1-4.7-11.3-4.7H288c0-17.7-14.3-32-32-32s-32 14.3-32 32zM480 256c0-17.7-14.3-32-32-32H288V192H224v32H70.6c-4.2 0-8.3 1.7-11.3 4.7l-48 48c-6.2 6.2-6.2 16.4 0 22.6l48 48c3 3 7.1 4.7 11.3 4.7H448c17.7 0 32-14.3 32-32V256zM288 480V384H224v96c0 17.7 14.3 32 32 32s32-14.3 32-32z"/>
              </svg>
              <time>{formatDate(post.date)}</time>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}

