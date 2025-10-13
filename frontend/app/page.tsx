import { getPosts } from '@/lib/wordpress';
import PostCard from '@/components/PostCard';
import Link from 'next/link';

export const revalidate = 3600; // 1時間ごとに再生成

export default async function Home() {
  let posts = [];
  let error = null;

  try {
    const data = await getPosts(1, 9);
    posts = data.posts;
  } catch (e) {
    error = 'データの取得に失敗しました';
    console.error('Error fetching posts:', e);
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* ヒーローセクション */}
      <section className="mb-16">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-12 text-white text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {process.env.NEXT_PUBLIC_SITE_NAME || '奈良新聞'}
          </h1>
          <p className="text-xl md:text-2xl opacity-90">
            奈良県の最新ニュースと情報をお届けします
          </p>
        </div>
      </section>

      {/* 最新記事セクション */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-800">最新記事</h2>
          <Link 
            href="/posts" 
            className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
          >
            すべて見る
            <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post: any) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </section>

      {/* カテゴリーセクション（オプション） */}
      <section className="mt-16">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">カテゴリー</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['ニュース', 'スポーツ', '文化', 'イベント'].map((category) => (
            <Link
              key={category}
              href={`/category/${category.toLowerCase()}`}
              className="bg-white rounded-lg p-6 text-center hover:shadow-lg transition-shadow border border-gray-200"
            >
              <h3 className="font-semibold text-gray-800">{category}</h3>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
