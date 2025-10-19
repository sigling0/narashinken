import Link from 'next/link';

interface SidebarProps {
  categories: any[];
  tags: any[];
}

// 小セクションヘッダーコンポーネント
function SmallSectionHeader({ title }: { title: string }) {
  return (
    <header 
      className="flex items-end mb-4.5 pb-0.5 relative border-b-2"
      style={{borderColor: 'var(--color-dojo-title)'}}
    >
      <div 
        className="absolute left-0 top-0 w-2 h-full"
        style={{backgroundColor: 'var(--color-dojo-title)'}}
      />
      <h5 
        className="text-lg font-extrabold pl-4.5 py-0.5"
        style={{color: 'var(--color-text-title)'}}
      >
        {title}
      </h5>
    </header>
  );
}

export default function Sidebar({ categories, tags }: SidebarProps) {
  // 使用されているカテゴリーのみをフィルタし、記事数の多い順にソート
  const activeCategories = categories
    .filter((cat: any) => cat.count > 0)
    .sort((a: any, b: any) => b.count - a.count)
    .slice(0, 10);
  
  // 使用されているタグのみをフィルタし、記事数の多い順にソート
  const activeTags = tags
    .filter((tag: any) => tag.count > 0)
    .sort((a: any, b: any) => b.count - a.count)
    .slice(0, 15);
  
  return (
    <aside className="space-y-8">
      {/* 記事検索セクション */}
      <section>
        <SmallSectionHeader title="記事検索" />
        <div className="space-y-4">
          {/* キーワード検索 */}
          <div>
            <label 
              htmlFor="keyword-search"
              className="block text-sm font-semibold mb-2"
              style={{color: 'var(--color-text-primary)'}}
            >
              キーワード検索
            </label>
            <div className="flex gap-2">
              <input 
                type="search"
                id="keyword-search"
                placeholder="キーワードを入力"
                className="flex-1 px-3 py-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-offset-0"
                style={{
                  borderColor: 'var(--color-dojo-tag)',
                  color: 'var(--color-text-primary)',
                  '--tw-ring-color': 'var(--color-dojo-title)'
                } as React.CSSProperties}
              />
              <button 
                className="px-4 py-2 text-sm font-medium rounded transition-colors hover:opacity-90"
                style={{
                  backgroundColor: 'var(--color-dojo-title)',
                  color: 'white'
                }}
              >
                検索
              </button>
            </div>
          </div>

          {/* カテゴリー検索 */}
          <div>
            <label 
              htmlFor="category-search"
              className="block text-sm font-semibold mb-2"
              style={{color: 'var(--color-text-primary)'}}
            >
              カテゴリー
            </label>
            <div className="space-y-1.5">
              {activeCategories.map((category: any) => (
                <Link
                  key={category.id}
                  href={`/category/${category.slug}`}
                  className="block text-sm underline transition-all duration-200 hover:font-bold hover:translate-x-1"
                  style={{color: 'var(--color-text-tertiary)'}}
                >
                  {category.name} ({category.count})
                </Link>
              ))}
            </div>
          </div>

          {/* タグ検索 */}
          <div>
            <label 
              className="block text-sm font-semibold mb-2"
              style={{color: 'var(--color-text-primary)'}}
            >
              タグ
            </label>
            <div className="flex flex-wrap gap-2">
              {activeTags.map((tag: any) => (
                <Link
                  key={tag.id}
                  href={`/tag/${tag.slug}`}
                  className="inline-block px-2 py-1 text-xs rounded transition-all duration-200 hover:scale-110 hover:shadow-md"
                  style={{
                    backgroundColor: 'var(--color-dojo-tag)',
                    color: 'var(--color-text-tertiary)'
                  }}
                >
                  {tag.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </aside>
  );
}

