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
                className="flex-1 px-3 py-2 text-sm border rounded"
                style={{
                  borderColor: 'var(--color-dojo-tag)',
                  color: 'var(--color-text-primary)'
                }}
              />
              <button 
                className="px-4 py-2 text-sm font-medium rounded"
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
              {categories.slice(0, 10).map((category: any) => (
                <Link
                  key={category.id}
                  href={`/category/${category.slug}`}
                  className="block text-sm underline transition-colors"
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
              {tags.slice(0, 15).map((tag: any) => (
                <Link
                  key={tag.id}
                  href={`/tag/${tag.slug}`}
                  className="inline-block px-2 py-1 text-xs rounded transition-colors"
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

