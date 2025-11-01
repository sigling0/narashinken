import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getMenuByLocation, getCategories, getTags } from "@/lib/wordpress";

// Google Fontsを削除してシステムフォント（明朝体）を使用（LCP改善のため）
// 25個のwoff2ファイル読み込み（~2,500ms）を完全に削除
// 明朝体スタック: macOS(Hiragino Mincho) → Windows(Yu Mincho, MS PMincho) → Android(Noto Serif JP)

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
        fontFamily: '"Hiragino Mincho ProN", "HiraMinProN-W3", "Yu Mincho", YuMincho, "MS PMincho", "Noto Serif JP", "Noto Serif CJK JP", serif'
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
