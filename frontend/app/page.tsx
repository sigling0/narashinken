import { getPosts } from '@/lib/wordpress';
import PostCard from '@/components/PostCard';
import Link from 'next/link';

export const revalidate = 3600; // 1時間ごとに再生成

export default async function Home() {
  let posts = [];
  let error = null;

  try {
    const data = await getPosts(1, 12);
    posts = data.posts;
  } catch (e) {
    error = 'データの取得に失敗しました';
    console.error('Error fetching posts:', e);
  }

  return (
    <div style={{backgroundColor: 'var(--color-dojo-beige)'}}>
      <div className="container mx-auto px-4 md:px-6 py-8">
        {/* メインコンテンツ */}
        <section className="mb-14">
          {/* セクションヘッダー */}
          <header 
            className="flex items-end justify-between mb-6 pb-0.5 relative border-b-2"
            style={{borderColor: 'var(--color-dojo-title)'}}
          >
            <div 
              className="absolute left-0 top-0 w-2 h-full"
              style={{backgroundColor: 'var(--color-dojo-title)'}}
            />
            <h4 
              className="text-2xl font-bold pl-4.5 py-0.5"
              style={{color: 'var(--color-text-title)'}}
            >
              最新記事
            </h4>
            <Link 
              href="/posts" 
              className="text-sm relative pr-5 pb-0.5 transition-all hover:font-bold"
              style={{color: 'var(--color-text-tertiary)'}}
            >
              一覧を見る
              <span className="absolute right-0 bottom-2 w-2 h-2 border-t-2 border-l-2 rotate-135 transform" style={{borderColor: 'var(--color-text-tertiary)'}} />
            </Link>
          </header>

          {error ? (
            <div 
              className="rounded-lg p-6 border"
              style={{
                backgroundColor: '#fee',
                borderColor: '#fcc',
                color: '#c33'
              }}
            >
              <p className="font-medium">{error}</p>
              <p className="mt-2 text-sm">WordPress APIに接続できませんでした。設定を確認してください。</p>
            </div>
          ) : posts.length === 0 ? (
            <div 
              className="rounded-lg p-8 text-center border"
              style={{
                backgroundColor: 'var(--color-dojo-beige-active)',
                borderColor: 'var(--color-dojo-tag)',
                color: 'var(--color-text-secondary)'
              }}
            >
              <p>記事がまだ投稿されていません</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {posts.map((post: any) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </section>

        {/* 道場紹介セクション */}
        <section className="mb-14 md:max-w-3xl">
          <header 
            className="flex items-end justify-between mb-4.5 pb-0.5 relative border-b-2"
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
              奈良心剣道場
            </h5>
          </header>
          <div 
            className="text-sm leading-relaxed mb-4"
            style={{color: 'var(--color-text-secondary)'}}
          >
            <p className="mb-3">
              奈良心剣道場（旧香芝心剣道場）は鹿児島県出水市出身の初代道場長池田義満先生が当時の香芝町下田において小さな町道場として創設されてから半世紀を迎えました。
            </p>
            <p>
              池田先生が掲げられました「剣道を学び心と身体を鍛えよう」の教えに基づきこれまで活動してまいりました。
            </p>
          </div>
          <Link 
            href="/about" 
            className="text-sm underline transition-colors"
            style={{color: 'var(--color-text-link)'}}
          >
            詳しく見る
          </Link>
        </section>

        {/* 道場生募集セクション */}
        <section className="mb-14 md:max-w-3xl">
          <header 
            className="flex items-end justify-between mb-4.5 pb-0.5 relative border-b-2"
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
              道場生募集中
            </h5>
          </header>
          <div 
            className="text-sm leading-relaxed mb-4"
            style={{color: 'var(--color-text-secondary)'}}
          >
            <p className="mb-3">
              奈良心剣道場では元気な道場生を募集しています。いつでも気軽に稽古をのぞきに来てください！
            </p>
            <p className="mb-2"><strong>【対象年齢】</strong></p>
            <p className="mb-3">年長～中学生</p>
            <p className="mb-2"><strong>【稽古日時】</strong></p>
            <p>火曜日 19:30～ 香芝市総合体育館</p>
            <p>水曜日 19:00～ 香芝中学校剣道場</p>
            <p>金曜日 19:00～ 香芝東中学校体育館</p>
            <p className="mb-3">土曜日 18:30～ 旭ヶ丘小学校体育館</p>
            <p className="mb-2"><strong>【連絡先】</strong></p>
            <p>入会・見学希望の方はメールでご連絡ください。</p>
          </div>
          <Link 
            href="/recruit" 
            className="text-sm underline transition-colors"
            style={{color: 'var(--color-text-link)'}}
          >
            詳しく見る
          </Link>
        </section>
      </div>
    </div>
  );
}
