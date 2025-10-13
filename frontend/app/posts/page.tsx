import { getPosts } from '@/lib/wordpress';
import PostCard from '@/components/PostCard';

export const revalidate = 3600; // 1時間ごとに再生成

export const metadata = {
  title: '記事一覧 - 奈良新聞',
  description: '奈良新聞の記事一覧ページです',
};

export default async function PostsPage() {
  let posts = [];
  let totalPages = 1;
  let error = null;

  try {
    const data = await getPosts(1, 12);
    posts = data.posts;
    totalPages = data.totalPages;
  } catch (e) {
    error = 'データの取得に失敗しました';
    console.error('Error fetching posts:', e);
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">記事一覧</h1>
        <p className="text-gray-600">
          {posts.length > 0 ? `全${posts.length}件の記事` : '記事がありません'}
        </p>
      </div>

      {error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-red-800">
          <p className="font-medium">{error}</p>
          <p className="mt-2 text-sm">WordPress APIに接続できませんでした。設定を確認してください。</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center text-gray-600">
          <p>記事がまだ投稿されていません</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post: any) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>

          {/* ページネーション（将来的に実装） */}
          {totalPages > 1 && (
            <div className="mt-12 flex justify-center">
              <div className="text-gray-600">
                ページ 1 / {totalPages}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

