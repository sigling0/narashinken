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
  const categories = post._embedded?.['wp:term']?.[0] || [];
  
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
          
          {/* カテゴリー・日付・矢印 */}
          <div className="flex items-center justify-between">
            <div className="flex-1">
              {/* カテゴリータグ */}
              {categories.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-1.5">
                  {categories.slice(0, 2).map((cat) => (
                    <span 
                      key={cat.id}
                      className="inline-block px-1.5 py-0.5 rounded text-xs"
                      style={{
                        backgroundColor: 'var(--color-dojo-tag)',
                        color: 'var(--color-text-tertiary)'
                      }}
                    >
                      {cat.name}
                    </span>
                  ))}
                </div>
              )}
              
              {/* 日付 */}
              <div className="flex items-center gap-4 text-xs" style={{color: 'var(--color-text-tertiary)'}}>
                <div className="flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14px" height="14px" viewBox="0 0 512 512" fill="currentColor">
                    <path d="M224 32H64C46.3 32 32 46.3 32 64v64c0 17.7 14.3 32 32 32H441.4c4.2 0 8.3-1.7 11.3-4.7l48-48c6.2-6.2 6.2-16.4 0-22.6l-48-48c-3-3-7.1-4.7-11.3-4.7H288c0-17.7-14.3-32-32-32s-32 14.3-32 32zM480 256c0-17.7-14.3-32-32-32H288V192H224v32H70.6c-4.2 0-8.3 1.7-11.3 4.7l-48 48c-6.2 6.2-6.2 16.4 0 22.6l48 48c3 3 7.1 4.7 11.3 4.7H448c17.7 0 32-14.3 32-32V256zM288 480V384H224v96c0 17.7 14.3 32 32 32s32-14.3 32-32z"/>
                  </svg>
                  <time>{formatDate(post.date)}</time>
                </div>
                {post.modified && post.modified !== post.date && (
                  <div className="flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14px" height="14px" viewBox="0 0 512 512" fill="currentColor">
                      <path d="M105.1 202.6c7.7-21.8 20.2-42.3 37.8-59.8c62.5-62.5 163.8-62.5 226.3 0L386.3 160H352c-17.7 0-32 14.3-32 32s14.3 32 32 32H463.5c0 0 0 0 0 0h.4c17.7 0 32-14.3 32-32V80c0-17.7-14.3-32-32-32s-32 14.3-32 32v35.2L414.4 97.6c-87.5-87.5-229.3-87.5-316.8 0C73.2 122 55.6 150.7 44.8 181.4c-5.9 16.7 2.9 34.9 19.5 40.8s34.9-2.9 40.8-19.5zM39 289.3c-5 1.5-9.8 4.2-13.7 8.2c-4 4-6.7 8.8-8.1 14c-.3 1.2-.6 2.5-.8 3.8c-.3 1.7-.4 3.4-.4 5.1V432c0 17.7 14.3 32 32 32s32-14.3 32-32V396.9l17.6 17.5 0 0c87.5 87.4 229.3 87.4 316.7 0c24.4-24.4 42.1-53.1 52.9-83.7c5.9-16.7-2.9-34.9-19.5-40.8s-34.9 2.9-40.8 19.5c-7.7 21.8-20.2 42.3-37.8 59.8c-62.5 62.5-163.8 62.5-226.3 0l-.1-.1L125.6 352H160c17.7 0 32-14.3 32-32s-14.3-32-32-32H48.4c-1.6 0-3.2 .1-4.8 .3s-3.1 .5-4.6 1z"/>
                    </svg>
                    <time>{formatDate(post.modified)}</time>
                  </div>
                )}
              </div>
            </div>
            
            {/* 矢印アイコン */}
            <div className="flex-shrink-0">
              <svg width="14px" height="16px" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg">
                <path fill="var(--color-text-secondary)" d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z"/>
              </svg>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}

