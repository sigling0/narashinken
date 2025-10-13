import { getPostsByCategory } from '@/lib/wordpress';
import PostCard from '@/components/PostCard';
import Link from 'next/link';

export const revalidate = 3600;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  
  return {
    title: `カテゴリー: ${slug} - 奈良新聞`,
    description: `${slug}カテゴリーの記事一覧`,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  
  let posts = [];
  let error = null;

  try {
    posts = await getPostsByCategory(slug);
  } catch (e) {
    error = 'データの取得に失敗しました';
    console.error('Error fetching posts by category:', e);
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* パンくずリスト */}
      <nav className="mb-8 text-sm text-gray-600">
        <Link href="/" className="hover:text-blue-600">ホーム</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800">カテゴリー: {slug}</span>
      </nav>

      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          カテゴリー: {slug}
        </h1>
        <p className="text-gray-600">
          {posts.length > 0 ? `${posts.length}件の記事` : '記事がありません'}
        </p>
      </div>

      {error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-red-800">
          <p className="font-medium">{error}</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center text-gray-600">
          <p>このカテゴリーの記事がまだ投稿されていません</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post: any) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}

