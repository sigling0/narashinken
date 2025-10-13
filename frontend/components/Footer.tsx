'use client';

import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* サイト情報 */}
          <div>
            <h3 className="text-xl font-bold mb-4">
              {process.env.NEXT_PUBLIC_SITE_NAME || '奈良新聞'}
            </h3>
            <p className="text-gray-400">
              奈良県の最新ニュースと情報をお届けします。
            </p>
          </div>

          {/* リンク */}
          <div>
            <h4 className="text-lg font-semibold mb-4">リンク</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                  ホーム
                </Link>
              </li>
              <li>
                <Link href="/posts" className="text-gray-400 hover:text-white transition-colors">
                  記事一覧
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
                  私たちについて
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                  お問い合わせ
                </Link>
              </li>
            </ul>
          </div>

          {/* SNS・その他 */}
          <div>
            <h4 className="text-lg font-semibold mb-4">フォロー</h4>
            <div className="flex space-x-4">
              {/* SNSアイコンは必要に応じて追加 */}
              <p className="text-gray-400">
                ソーシャルメディアでフォローしてください
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {currentYear} {process.env.NEXT_PUBLIC_SITE_NAME || '奈良新聞'}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

