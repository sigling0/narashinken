import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getMenuByLocation } from "@/lib/wordpress";

const notoSansJP = Noto_Sans_JP({ 
  subsets: ["latin"],
  weight: ['400', '500', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "奈良新聞 - Headless WordPress",
  description: "奈良県の最新ニュースと情報をお届けします",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // メニューの取得（エラーハンドリング付き）
  let menuItems = [];
  try {
    const menu = await getMenuByLocation('primary');
    menuItems = menu.items;
  } catch (error) {
    console.error('Menu fetch error:', error);
    // メニューが取得できなくても続行
  }

  return (
    <html lang="ja">
      <body className={notoSansJP.className}>
        <div className="flex flex-col min-h-screen">
          <Header menuItems={menuItems} />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
