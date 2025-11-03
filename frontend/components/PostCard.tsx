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

  // HTMLタグを除去してテキストのみを取得し、HTMLエンティティをデコード
  const stripHtml = (html: string, maxLength: number = 80) => {
    // HTMLタグを除去
    let text = html.replace(/<[^>]*>/g, '');
    
    // HTMLエンティティをデコード（よく使われるものを置換）
    text = text
      .replace(/&hellip;/g, '…')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'")
      .replace(/&#8217;/g, '\u2019') // 右シングルクォート
      .replace(/&#8220;/g, '\u201C') // 左ダブルクォート
      .replace(/&#8221;/g, '\u201D') // 右ダブルクォート
      .replace(/&mdash;/g, '—')
      .replace(/&ndash;/g, '–')
      .replace(/\[…\]/g, ''); // WordPressの[…]を削除
    
    // Unicode正規化（結合文字を正規化して文字数を正しくカウント）
    text = text.normalize('NFC');
    
    // 改行を空白に変換し、複数の空白を1つに統一
    text = text.replace(/\s+/g, ' ').trim();
    
    // 文字数カウント時に絵文字や特殊文字を考慮
    // Array.from()を使うことで、サロゲートペアや結合文字を正しく扱う
    const chars = Array.from(text);
    if (chars.length > maxLength) {
      return Array.from(text).slice(0, maxLength).join('') + '…';
    }
    return text;
  };

  return (
    <Link href={`/posts/${post.id}`} className="group">
      <article 
        className="block rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
        style={{
          boxShadow: 'rgba(0,0,0,0.16) 1px 1px 4px 2px',
          backgroundColor: 'white'
        }}
      >
        {/* アイキャッチ画像 */}
        <div className="relative w-full h-44 overflow-hidden" style={{ minHeight: '176px' }}>
          {featuredImage ? (
            <Image
              src={featuredImage.source_url}
              alt={featuredImage.alt_text || post.title.rendered}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 380px"
              quality={50}
            />
          ) : (
            <div 
              className="w-full h-full flex items-center justify-center"
              style={{backgroundColor: 'var(--color-dojo-tertiary-key)'}}
            >
              <span className="text-sm" style={{color: 'var(--color-text-tertiary)'}}>No Image</span>
            </div>
          )}
        </div>

        {/* コンテンツ */}
        <div className="px-4 py-3">
          <h5 
            className="text-lg font-extrabold leading-normal mb-2 mr-4 transition-colors duration-300 group-hover:text-opacity-80"
            style={{color: 'var(--color-text-primary)'}}
            dangerouslySetInnerHTML={{ __html: post.title.rendered }}
          />
          
          {/* 抜粋 - スマートフォン用（短い） */}
          <div 
            className="md:hidden text-sm mb-3 leading-relaxed"
            style={{color: 'var(--color-text-secondary)'}}
          >
            {stripHtml(post.excerpt.rendered, 45)}
          </div>
          
          {/* 抜粋 - PC用（長い） */}
          <div 
            className="hidden md:block text-sm mb-3 leading-relaxed"
            style={{color: 'var(--color-text-secondary)'}}
          >
            {stripHtml(post.excerpt.rendered, 80)}
          </div>
          
          {/* タグ・投稿日付 */}
          <div>
            {/* タグ */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {tags.slice(0, 3).map((tag) => (
                  <span 
                    key={tag.id}
                    className="inline-block px-1.5 py-0.5 rounded text-xs border"
                    style={{
                      backgroundColor: 'var(--color-dojo-bg-accent)',
                      borderColor: 'var(--color-dojo-tertiary-accent)',
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

