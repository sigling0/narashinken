import { getPostsByCategorySlug, getCategoryBySlug, getCategories, getTags } from '@/lib/wordpress';
import PostCard from '@/components/PostCard';
import Sidebar from '@/components/Sidebar';
import Pagination from '@/components/Pagination';
import Link from 'next/link';

export const revalidate = 3600;

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  
  return {
    title: `カテゴリー: ${category?.name || slug} - 奈良心剣道場`,
    description: `${category?.name || slug}カテゴリーの記事一覧`,
  };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const search = await searchParams;
  const currentPage = Number(search.page) || 1;
  const perPage = 12;
  
  let allPosts = [];
  let category = null;
  let categories = [];
  let tags = [];
  let error = null;

  try {
    const fetchWithTimeout = async <T,>(promise: Promise<T>, timeoutMs: number = 8000): Promise<T> => {
      const timeoutPromise = new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('Fetch timeout')), timeoutMs)
      );
      return Promise.race([promise, timeoutPromise]);
    };

    [allPosts, category, categories, tags] = await Promise.all([
      fetchWithTimeout(getPostsByCategorySlug(slug, 100)).catch(() => []),
      fetchWithTimeout(getCategoryBySlug(slug)).catch(() => null),
      fetchWithTimeout(getCategories()).catch(() => []),
      fetchWithTimeout(getTags()).catch(() => []),
    ]);
  } catch (e) {
    error = 'データの取得に失敗しました';
    console.error('Error fetching posts by category:', e);
  }

  const categoryName = category?.name || slug;
  
  // ページネーション用の計算
  const totalPosts = allPosts.length;
  const totalPages = Math.ceil(totalPosts / perPage);
  const startIndex = (currentPage - 1) * perPage;
  const endIndex = startIndex + perPage;
  const posts = allPosts.slice(startIndex, endIndex);

  return (
    <div style={{backgroundColor: 'var(--color-dojo-beige)'}}>
      <div className="container mx-auto px-4 md:px-6 py-8">
        {/* パンくずリスト */}
        <nav className="mb-6 text-sm" style={{color: 'var(--color-text-tertiary)'}}>
          <Link href="/" className="hover:underline">ホーム</Link>
          <span className="mx-2">/</span>
          <span style={{color: 'var(--color-text-primary)'}}>カテゴリー: {categoryName}</span>
        </nav>

        {/* ヘッダー */}
        <header 
          className="flex items-end justify-between mb-6 pb-0.5 relative border-b-2"
          style={{borderColor: 'var(--color-dojo-title)'}}
        >
          <div 
            className="absolute left-0 top-0 w-2 h-full"
            style={{backgroundColor: 'var(--color-dojo-title)'}}
          />
          <div className="pl-4.5 py-0.5">
            <h1 
              className="text-3xl font-bold"
              style={{color: 'var(--color-text-title)'}}
            >
              カテゴリー: {categoryName}
            </h1>
            {category?.description && (
              <p 
                className="text-sm mt-2"
                style={{color: 'var(--color-text-secondary)'}}
              >
                {category.description}
              </p>
            )}
            <p 
              className="text-sm mt-2"
              style={{color: 'var(--color-text-tertiary)'}}
            >
              {posts.length > 0 ? `${posts.length}件の記事` : '記事がありません'}
            </p>
          </div>
        </header>

        {/* メインコンテンツ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* 記事一覧 */}
          <main className="lg:col-span-9">
            {error ? (
              <div 
                className="rounded-lg border-2 p-6"
                style={{
                  borderColor: '#ef4444',
                  backgroundColor: '#fef2f2',
                  color: '#991b1b'
                }}
              >
                <p className="font-medium">{error}</p>
              </div>
            ) : posts.length === 0 ? (
              <div 
                className="rounded-lg border-2 p-8 text-center"
                style={{
                  borderColor: 'var(--color-dojo-tag)',
                  backgroundColor: 'rgba(255,255,255,0.5)',
                  color: 'var(--color-text-tertiary)'
                }}
              >
                <p>このカテゴリーの記事がまだ投稿されていません</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {posts.map((post: any) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>

                {/* ページネーション */}
                <Pagination 
                  currentPage={currentPage}
                  totalPages={totalPages}
                  basePath={`/category/${slug}`}
                />
              </>
            )}
          </main>

          {/* サイドバー */}
          <div className="lg:col-span-3">
            <Sidebar categories={categories} tags={tags} />
          </div>
        </div>
      </div>
    </div>
  );
}

