import { getPostsByCategorySlug, getCategories, getTags } from '@/lib/wordpress';
import PostCard from '@/components/PostCard';
import Link from 'next/link';

export const revalidate = 3600; // 1時間ごとに再生成

// セクションヘッダーコンポーネント
function SectionHeader({ title, link }: { title: string; link?: string }) {
  return (
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
        {title}
      </h4>
      {link && (
        <Link 
          href={link} 
          className="text-sm relative pr-5 pb-0.5 transition-all hover:font-bold"
          style={{color: 'var(--color-text-tertiary)'}}
        >
          一覧を見る
          <span className="absolute right-0 bottom-2 w-2 h-2 border-t-2 border-l-2 rotate-135 transform" style={{borderColor: 'var(--color-text-tertiary)'}} />
        </Link>
      )}
    </header>
  );
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

export default async function Home() {
  // 各カテゴリーの記事を並行して取得
  const [announcementPosts, resultPosts, blogPosts, categories, tags] = await Promise.all([
    getPostsByCategorySlug('announcement', 3),
    getPostsByCategorySlug('result', 6),
    getPostsByCategorySlug('blog', 6),
    getCategories(),
    getTags(),
  ]);

  return (
    <div style={{backgroundColor: 'var(--color-dojo-beige)'}}>
      <div className="container mx-auto px-4 md:px-6 py-8">
        {/* 3カラムレイアウト */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* 左カラム */}
          <aside className="lg:col-span-3 space-y-8">
            {/* 道場紹介セクション */}
            <section className="lg:mb-6">
              <SmallSectionHeader title="奈良心剣道場" />
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
            <section className="lg:mb-6">
              <SmallSectionHeader title="道場生募集中" />
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

            {/* 歴代主将一覧セクション */}
            <section>
              <SmallSectionHeader title="歴代主将一覧" />
              <div 
                className="text-sm leading-relaxed"
                style={{color: 'var(--color-text-secondary)'}}
              >
                {[
                  {year: 2024, name: '新田もも'},
                  {year: 2023, name: '清谷恭史郎'},
                  {year: 2022, name: '森本結咲'},
                  {year: 2021, name: '橋本芽生'},
                  {year: 2020, name: '柏木奏佑'},
                  {year: 2019, name: '橋本青空'},
                  {year: 2018, name: '吉田晃貴'},
                  {year: 2017, name: '西田楓太'},
                  {year: 2016, name: '内海遥太・吉田結生'},
                  {year: 2015, name: '岡田悠希'},
                ].map(({year, name}) => (
                  <Link 
                    key={year}
                    href={`/history#member_${year}`}
                    className="block mb-1.5 underline hover:font-bold transition-all"
                  >
                    {year}年度 {name}
                  </Link>
                ))}
              </div>
              <Link 
                href="/history#member_past" 
                className="text-sm underline transition-colors mt-4 inline-block"
                style={{color: 'var(--color-text-link)'}}
              >
                詳しく見る
              </Link>
            </section>
          </aside>

          {/* 中央カラム */}
          <main className="lg:col-span-6 space-y-14">
            {/* 重要なお知らせセクション */}
            <section>
              <SectionHeader title="重要なお知らせ" link="/category/announcement" />
              {announcementPosts.length > 0 ? (
                <div className="space-y-4">
                  {announcementPosts.map((post: any) => (
                    <Link 
                      key={post.id}
                      href={`/posts/${post.slug}`}
                      className="block rounded-lg overflow-hidden"
                      style={{
                        boxShadow: 'rgba(0,0,0,0.16) 1px 1px 4px 2px',
                        backgroundColor: 'white'
                      }}
                    >
                      <div className="p-4">
                        <h5 
                          className="text-lg font-extrabold mb-3"
                          style={{color: 'var(--color-text-primary)'}}
                          dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                        />
                        <div 
                          className="text-sm mb-3"
                          style={{color: 'var(--color-text-secondary)'}}
                          dangerouslySetInnerHTML={{ 
                            __html: post.excerpt?.rendered?.replace(/<[^>]*>/g, '').substring(0, 100) + '...' 
                          }}
                        />
                        <div className="flex items-center justify-between text-xs" style={{color: 'var(--color-text-tertiary)'}}>
                          <time>{new Date(post.date).toLocaleDateString('ja-JP')}</time>
                          <svg width="14px" height="16px" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg">
                            <path fill="var(--color-text-secondary)" d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z"/>
                          </svg>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-sm" style={{color: 'var(--color-text-secondary)'}}>お知らせはまだありません</p>
              )}
            </section>

            {/* 大会結果セクション */}
            <section>
              <SectionHeader title="大会結果" link="/category/result" />
              {resultPosts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {resultPosts.map((post: any) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>
              ) : (
                <p className="text-sm" style={{color: 'var(--color-text-secondary)'}}>大会結果はまだありません</p>
              )}
            </section>

            {/* ブログセクション */}
            <section>
              <SectionHeader title="ブログ" link="/category/blog" />
              {blogPosts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {blogPosts.map((post: any) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>
              ) : (
                <p className="text-sm" style={{color: 'var(--color-text-secondary)'}}>ブログ記事はまだありません</p>
              )}
            </section>
          </main>

          {/* 右カラム */}
          <aside className="lg:col-span-3 space-y-8">
            {/* インスタグラムセクション */}
            <section>
              <SmallSectionHeader title="Instagram" />
              <div 
                className="rounded-lg p-8 text-center border-2 border-dashed"
                style={{
                  borderColor: 'var(--color-dojo-tag)',
                  backgroundColor: 'rgba(255,255,255,0.5)'
                }}
              >
                <svg 
                  className="w-16 h-16 mx-auto mb-4"
                  viewBox="0 0 999.9899 999.9966" 
                  xmlns="http://www.w3.org/2000/svg"
                  style={{fill: 'var(--color-text-tertiary)'}}
                >
                  <path d="M292.9208,3.4969c-53.2,2.51-89.53,11-121.29,23.48-32.87,12.81-60.73,30-88.45,57.82-27.72,27.82-44.79,55.7-57.51,88.62-12.31,31.83-20.65,68.19-23,121.42C.3208,348.0669-.1992,365.1769.0608,500.9569s.86,152.8,3.44,206.14c2.54,53.19,11,89.51,23.48,121.28,12.83,32.87,30,60.72,57.83,88.45,27.83,27.73,55.69,44.76,88.69,57.5,31.8,12.29,68.17,20.67,121.39,23,53.22,2.33,70.35,2.87,206.09,2.61,135.74-.26,152.83-.86,206.16-3.39s89.46-11.05,121.24-23.47c32.87-12.86,60.74-30,88.45-57.84s44.77-55.74,57.48-88.68c12.32-31.8,20.69-68.17,23-121.35,2.33-53.37,2.88-70.41,2.62-206.17s-.87-152.78-3.4-206.1-11-89.53-23.47-121.32c-12.85-32.87-30-60.7-57.82-88.45s-55.74-44.8-88.67-57.48c-31.82-12.31-68.17-20.7-121.39-23S634.8308-.2031,499.0408.0569s-152.79.84-206.12,3.44"/>
                </svg>
                <p 
                  className="text-sm"
                  style={{color: 'var(--color-text-tertiary)'}}
                >
                  Instagramフィード
                  <br />
                  <span className="text-xs">(後日実装予定)</span>
                </p>
              </div>
            </section>

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
        </div>
      </div>
    </div>
  );
}
