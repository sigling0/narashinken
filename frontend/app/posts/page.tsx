import { getPosts, getCategories, getTags } from '@/lib/wordpress';
import PostCard from '@/components/PostCard';
import Sidebar from '@/components/Sidebar';
import Pagination from '@/components/Pagination';
import Link from 'next/link';

export const revalidate = 3600; // 1時間ごとに再生成

export const metadata = {
  title: '記事一覧 - 奈良心剣道場',
  description: '奈良心剣道場の記事一覧ページです',
};

interface Props {
  searchParams: Promise<{ page?: string }>;
}

export default async function PostsPage({ searchParams }: Props) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const perPage = 12;
  
  let posts = [];
  let totalPages = 1;
  let total = 0;
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

    const [postsData, categoriesData, tagsData] = await Promise.all([
      fetchWithTimeout(getPosts(currentPage, perPage)).catch(() => ({ posts: [], totalPages: 1, total: 0 })),
      fetchWithTimeout(getCategories()).catch(() => []),
      fetchWithTimeout(getTags()).catch(() => []),
    ]);

    posts = postsData.posts;
    totalPages = postsData.totalPages;
    total = postsData.total;
    categories = categoriesData;
    tags = tagsData;
  } catch (e) {
    error = 'データの取得に失敗しました';
    console.error('Error fetching posts:', e);
  }

  return (
    <div style={{backgroundColor: 'var(--color-dojo-bg-key)'}}>
      <div className="container mx-auto px-4 md:px-6 py-8">
        {/* パンくずリスト */}
        <nav className="mb-6 text-sm" style={{color: 'var(--color-text-tertiary)'}}>
          <Link href="/" className="hover:underline">ホーム</Link>
          <span className="mx-2">/</span>
          <span style={{color: 'var(--color-text-primary)'}}>記事一覧</span>
        </nav>

        {/* ヘッダー */}
        <header 
          className="flex items-end justify-between mb-6 pb-0.5 relative border-b-2"
          style={{borderColor: 'var(--color-dojoprimary-key)'}}
        >
          <div 
            className="absolute left-0 top-0 w-2 h-full"
            style={{backgroundColor: 'var(--color-dojoprimary-key)'}}
          />
          <div className="pl-4.5 py-0.5">
            <h1 
              className="text-3xl font-bold"
              style={{color: 'var(--color-text-title)'}}
            >
              記事一覧
            </h1>
            <p 
              className="text-sm mt-2"
              style={{color: 'var(--color-text-tertiary)'}}
            >
              {total > 0 ? `全${total}件の記事` : '記事がありません'}
              {currentPage > 1 && ` (${currentPage}ページ目)`}
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
                  borderColor: 'var(--color-dojo-secondary-key)',
                  backgroundColor: 'rgba(255,255,255,0.5)',
                  color: 'var(--color-text-tertiary)'
                }}
              >
                <p>記事がまだ投稿されていません</p>
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
                  basePath="/posts"
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

