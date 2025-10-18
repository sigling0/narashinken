import type { Metadata } from "next";
import { Shippori_Mincho_B1 } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getMenuByLocation } from "@/lib/wordpress";

const shipporiMincho = Shippori_Mincho_B1({ 
  subsets: ["latin"],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "奈良心剣道場 - Headless WordPress",
  description: "奈良心剣道場のホームページ。剣道を学び心と身体を鍛えよう",
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
    <html lang="ja" style={{scrollBehavior: 'smooth'}}>
      <head>
        <link rel="icon" href="/favicon.png" />
      </head>
      <body className={shipporiMincho.className} style={{backgroundColor: 'var(--color-dojo-beige)'}}>
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
