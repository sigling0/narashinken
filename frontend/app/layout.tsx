import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getMenuByLocation, getCategories, getTags } from "@/lib/wordpress";

// Google Fontsを削除してシステムフォントを使用（LCP改善のため）
// 25個のwoff2ファイル読み込み（~2,500ms）を完全に削除

export const metadata: Metadata = {
  title: "奈良心剣道場",
  description: "奈良心剣道場のホームページ。剣道を学び心と身体を鍛えよう",
  icons: {
    icon: '/favicon.png',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // メニューの取得（エラーハンドリング付き）
  let menuItems = [];
  try {
    const menu = await Promise.race([
      getMenuByLocation('primary'),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Menu timeout')), 5000))
    ]);
    menuItems = (menu as any).items || [];
  } catch (error) {
    console.error('Menu fetch error:', error);
    // メニューが取得できなくても続行
  }

  // カテゴリとタグの取得
  let categories: any[] = [];
  let tags: any[] = [];
  try {
    [categories, tags] = await Promise.all([
      getCategories(),
      getTags()
    ]);
  } catch (error) {
    console.error('Categories/Tags fetch error:', error);
  }

  return (
    <html lang="ja">
      <body style={{
        backgroundColor: 'var(--color-dojo-bg-key)',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Hiragino Sans", "Hiragino Kaku Gothic ProN", "Noto Sans JP", "Yu Gothic", YuGothic, Meiryo, sans-serif'
      }}>
        <div className="flex flex-col min-h-screen">
          <Header menuItems={menuItems} categories={categories} tags={tags} />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
