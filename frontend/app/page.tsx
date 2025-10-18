import { getPostsByCategorySlug, getCategories, getTags, getInstagramFeed } from '@/lib/wordpress';
import PostCard from '@/components/PostCard';
import Slideshow from '@/components/Slideshow';
import InstagramFeed from '@/components/InstagramFeed';
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
  // 各カテゴリーの記事を並行して取得（タイムアウト付き）
  const fetchWithTimeout = async <T,>(promise: Promise<T>, timeoutMs: number = 8000): Promise<T> => {
    const timeoutPromise = new Promise<never>((_, reject) => 
      setTimeout(() => reject(new Error('Fetch timeout')), timeoutMs)
    );
    return Promise.race([promise, timeoutPromise]);
  };

  const [announcementPosts, resultPosts, blogPosts, categories, tags, instagramFeed] = await Promise.all([
    fetchWithTimeout(getPostsByCategorySlug('announcement', 1)).catch(() => []),
    fetchWithTimeout(getPostsByCategorySlug('result', 6)).catch(() => []),
    fetchWithTimeout(getPostsByCategorySlug('blog', 6)).catch(() => []),
    fetchWithTimeout(getCategories()).catch(() => []),
    fetchWithTimeout(getTags()).catch(() => []),
    fetchWithTimeout(getInstagramFeed(6)).catch(() => ({ count: 0, posts: [] })),
  ]);

  return (
    <div style={{backgroundColor: 'var(--color-dojo-beige)'}}>
      {/* スライドショー */}
      <Slideshow />
      
      <div className="container mx-auto px-4 md:px-6 py-8">
        {/* 3カラムレイアウト */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* 左カラム */}
          <aside className="hidden lg:block lg:col-span-3 space-y-8">
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
                (() => {
                  const post = announcementPosts[0];
                  const tags = post._embedded?.['wp:term']?.[1] || [];
                  const formatDate = (dateString: string) => {
                    return new Date(dateString).toLocaleDateString('ja-JP', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                    }).replace(/\//g, '年').replace(/年(\d+)月/, '年$1月') + '日';
                  };
                  
                  return (
                    <Link 
                      href={`/posts/${post.slug}`}
                      className="block rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group"
                      style={{
                        boxShadow: 'rgba(0,0,0,0.16) 1px 1px 4px 2px',
                        backgroundColor: 'white'
                      }}
                    >
                      <div className="p-4">
                        <h5 
                          className="text-lg font-extrabold mb-3 transition-colors duration-300 group-hover:text-opacity-80"
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
                        
                        {/* タグ・日付 */}
                        <div>
                          {/* タグ */}
                          {tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-2">
                              {tags.slice(0, 3).map((tag: any) => (
                                <span 
                                  key={tag.id}
                                  className="inline-block px-1.5 py-0.5 rounded text-xs"
                                  style={{
                                    backgroundColor: 'var(--color-dojo-tag)',
                                    color: 'var(--color-text-tertiary)'
                                  }}
                                >
                                  {tag.name}
                                </span>
                              ))}
                            </div>
                          )}
                          
                          {/* 投稿日・更新日 */}
                          <div className="flex items-center gap-4 text-xs" style={{color: 'var(--color-text-tertiary)'}}>
                            <div className="flex items-center gap-1">
                              <svg xmlns="http://www.w3.org/2000/svg" width="14px" height="14px" viewBox="0 0 512 512" fill="currentColor">
                                <path d="M224 32H64C46.3 32 32 46.3 32 64v64c0 17.7 14.3 32 32 32H441.4c4.2 0 8.3-1.7 11.3-4.7l48-48c6.2-6.2 6.2-16.4 0-22.6l-48-48c-3-3-7.1-4.7-11.3-4.7H288c0-17.7-14.3-32-32-32s-32 14.3-32 32zM480 256c0-17.7-14.3-32-32-32H288V192H224v32H70.6c-4.2 0-8.3 1.7-11.3 4.7l-48 48c-6.2 6.2-6.2 16.4 0 22.6l48 48c3 3 7.1 4.7 11.3 4.7H448c17.7 0 32-14.3 32-32V256zM288 480V384H224v96c0 17.7 14.3 32 32 32s32-14.3 32-32z"/>
                              </svg>
                              <time>{formatDate(post.date)}</time>
                            </div>
                            {post.modified && post.modified !== post.date && (
                              <div className="flex items-center gap-1">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14px" height="14px" viewBox="0 0 512 512" fill="currentColor">
                                  <path d="M105.1 202.6c7.7-21.8 20.2-42.3 37.8-59.8c62.5-62.5 163.8-62.5 226.3 0L386.3 160H352c-17.7 0-32 14.3-32 32s14.3 32 32 32H463.5c0 0 0 0 0 0h.4c17.7 0 32-14.3 32-32V80c0-17.7-14.3-32-32-32s-32 14.3-32 32v35.2L414.4 97.6c-87.5-87.5-229.3-87.5-316.8 0C73.2 122 55.6 150.7 44.8 181.4c-5.9 16.7 2.9 34.9 19.5 40.8s34.9-2.9 40.8-19.5zM39 289.3c-5 1.5-9.8 4.2-13.7 8.2c-4 4-6.7 8.8-8.1 14c-.3 1.2-.6 2.5-.8 3.8c-.3 1.7-.4 3.4-.4 5.1V432c0 17.7 14.3 32 32 32s32-14.3 32-32V396.9l17.6 17.5 0 0c87.5 87.4 229.3 87.4 316.7 0c24.4-24.4 42.1-53.1 52.9-83.7c5.9-16.7-2.9-34.9-19.5-40.8s-34.9 2.9-40.8 19.5c-7.7 21.8-20.2 42.3-37.8 59.8c-62.5 62.5-163.8 62.5-226.3 0l-.1-.1L125.6 352H160c17.7 0 32-14.3 32-32s-14.3-32-32-32H48.4c-1.6 0-3.2 .1-4.8 .3s-3.1 .5-4.6 1z"/>
                                </svg>
                                <time>{formatDate(post.modified)}</time>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })()
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
          <aside className="hidden lg:block lg:col-span-3 space-y-8">
            {/* インスタグラムセクション */}
            <section>
              <SmallSectionHeader title="Instagram" />
              <InstagramFeed posts={instagramFeed.posts} message={instagramFeed.message} />
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
                    {tags.slice(0, 15).map((tag: any) => (
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
        </div>
      </div>
    </div>
  );
}
