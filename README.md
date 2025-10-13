# 奈良心剣 - ヘッドレスWordPressプロジェクト

このプロジェクトは、WordPress をヘッドレスCMSとして使用し、Next.js 15 でフロントエンドを構築した高速なWebサイトです。

## 🎯 プロジェクト概要

### アーキテクチャ

```
┌─────────────────────┐
│   Next.js Frontend  │
│   (React + TS)      │  ← ユーザーが閲覧
│   Port: 3000        │
└──────────┬──────────┘
           │ REST API
           ↓
┌─────────────────────┐
│   WordPress CMS     │
│   (管理画面)        │  ← コンテンツ管理
│   Port: 8888        │
└─────────────────────┘
```

### 技術スタック

**フロントエンド:**
- ⚡ **Next.js 15** - React フレームワーク（App Router）
- 🎨 **Tailwind CSS 4** - ユーティリティファーストCSS
- 📘 **TypeScript** - 型安全性
- 🖼️ **Next/Image** - 画像最適化
- 🔄 **SWR** - データフェッチング
- 📡 **Axios** - HTTP クライアント

**バックエンド:**
- 📝 **WordPress** - ヘッドレスCMS
- 🔌 **WordPress REST API** - データ提供
- 🔧 **カスタムプラグイン** - API拡張とCORS設定

### 主な機能

✅ **パフォーマンス**
- ISR（Incremental Static Regeneration）による高速ページ表示
- 自動画像最適化（WebP/AVIF対応）
- コード分割とプリフェッチ

✅ **SEO最適化**
- 動的メタデータ生成
- サイトマップ自動生成
- robots.txt
- セマンティックHTML

✅ **開発者体験**
- TypeScript による型安全性
- ホットリロード
- ESLint による品質管理
- 包括的なドキュメント

✅ **セキュリティ**
- CORS設定
- セキュリティヘッダー
- XSS保護
- 環境変数による秘密情報の管理

## 📁 プロジェクト構造

```
narashinken.com-23/
├── wp-content/
│   ├── plugins/
│   │   └── headless-api-config/      # カスタムWordPressプラグイン
│   │       └── headless-api-config.php
│   └── themes/
│       └── shinken/                   # 既存テーマ（管理画面用）
│
├── frontend/                          # Next.jsフロントエンド
│   ├── app/                           # App Router
│   │   ├── layout.tsx                 # ルートレイアウト
│   │   ├── page.tsx                   # ホームページ
│   │   ├── posts/                     # 記事ページ
│   │   ├── category/                  # カテゴリーページ
│   │   ├── [slug]/                    # 動的固定ページ
│   │   ├── sitemap.ts                 # サイトマップ
│   │   └── robots.ts                  # robots.txt
│   ├── components/                    # Reactコンポーネント
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── PostCard.tsx
│   │   └── Loading.tsx
│   ├── lib/                           # ユーティリティ
│   │   └── wordpress.ts               # WordPress API Client
│   ├── .env.local.example             # 環境変数テンプレート
│   ├── next.config.ts                 # Next.js設定
│   └── package.json
│
├── QUICK_START.md                     # クイックスタートガイド
├── HEADLESS_SETUP.md                  # 詳細セットアップガイド
└── README.md                          # このファイル
```

## 🚀 クイックスタート

### 1. 必要要件

- Node.js 18.x 以上
- npm または yarn
- 稼働中の WordPress サイト

### 2. セットアップ（10分で完了）

```bash
# 1. フロントエンドディレクトリに移動
cd frontend

# 2. 環境変数を設定
cp .env.local.example .env.local
# .env.local を編集してWordPress URLを設定

# 3. 依存パッケージをインストール
npm install

# 4. WordPress プラグインを有効化
# WordPress管理画面で「Headless WordPress API Configuration」を有効化

# 5. 開発サーバーを起動
npm run dev
```

ブラウザで http://localhost:3000 を開く

👉 **詳細な手順**: [QUICK_START.md](./QUICK_START.md)

## 📚 ドキュメント

| ドキュメント | 説明 |
|------------|------|
| [QUICK_START.md](./QUICK_START.md) | 最速でプロジェクトを起動 |
| [HEADLESS_SETUP.md](./HEADLESS_SETUP.md) | 詳細なセットアップガイド |
| [frontend/README.md](./frontend/README.md) | フロントエンド技術詳細 |
| [frontend/DEPLOY.md](./frontend/DEPLOY.md) | デプロイガイド |

## 🔧 WordPress設定

### 必須プラグイン

**Headless WordPress API Configuration**（同梱）
- カスタム REST API エンドポイント
- CORS 設定
- メニュー API
- 最適化されたデータフォーマット

場所: `wp-content/plugins/headless-api-config/headless-api-config.php`

### カスタムエンドポイント

| エンドポイント | 説明 |
|--------------|------|
| `/wp-json/headless/v1/site-info` | サイト情報 |
| `/wp-json/headless/v1/recent-posts` | 最新投稿 |
| `/wp-json/headless/v1/posts-by-category/{slug}` | カテゴリー別投稿 |
| `/wp-json/headless/v1/menus` | 全メニュー |
| `/wp-json/headless/v1/menus/{location}` | 場所別メニュー |

## 🚢 デプロイ

### Vercelへのデプロイ（推奨）

```bash
# 1. GitHubにプッシュ
git add .
git commit -m "Initial commit"
git push origin main

# 2. Vercelでインポート
# - Root Directory: frontend
# - 環境変数を設定

# 3. デプロイ
```

👉 **詳細な手順**: [frontend/DEPLOY.md](./frontend/DEPLOY.md)

### その他のホスティング

- **Netlify** - 静的サイト最適化
- **AWS Amplify** - AWS環境
- **独自サーバー** - Node.js + PM2 + Nginx

## 📊 パフォーマンス

### 最適化機能

- ✅ **ISR** - 1時間ごとの自動再生成（設定可能）
- ✅ **画像最適化** - 自動WebP/AVIF変換
- ✅ **コード分割** - 自動バンドル最適化
- ✅ **プリフェッチ** - リンクの事前読み込み
- ✅ **圧縮** - Gzip/Brotli圧縮

### 期待されるスコア

| 指標 | スコア |
|------|--------|
| Lighthouse Performance | 90+ |
| First Contentful Paint | < 1.5s |
| Largest Contentful Paint | < 2.5s |
| Cumulative Layout Shift | < 0.1 |

## 🔒 セキュリティ

- ✅ CORS 設定による適切なアクセス制御
- ✅ セキュリティヘッダー（CSP, HSTS, X-Frame-Options等）
- ✅ XSS フィルタリング
- ✅ 環境変数による秘密情報の保護
- ✅ WordPress と フロントエンドの分離

## 🛠️ 開発

### 利用可能なコマンド

```bash
# 開発サーバー起動
npm run dev

# 本番ビルド
npm run build

# 本番サーバー起動
npm start

# Lint実行
npm run lint

# 型チェック
npm run type-check
```

### 環境変数

```env
NEXT_PUBLIC_WORDPRESS_API_URL=https://your-wordpress.com/wp-json
NEXT_PUBLIC_SITE_NAME=奈良新聞
NEXT_PUBLIC_SITE_URL=https://narashinken.com
REVALIDATE_TIME=3600
```

## 🐛 トラブルシューティング

### よくある問題

**Q: WordPressに接続できない**
- A: `.env.local` のURLが正しいか確認
- A: WordPressでREST APIが有効か確認

**Q: 画像が表示されない**
- A: `next.config.ts` の `remotePatterns` を確認
- A: WordPressサイトがHTTPSを使用しているか確認

**Q: メニューが表示されない**
- A: WordPress管理画面でメニューを作成
- A: メニューの位置を「Primary」に設定

👉 **詳細**: [HEADLESS_SETUP.md](./HEADLESS_SETUP.md)

## 📈 今後の拡張

- [ ] 検索機能の実装
- [ ] コメント機能の追加
- [ ] PWA対応
- [ ] 多言語対応（i18n）
- [ ] ダークモード
- [ ] アナリティクス統合

## 🤝 貢献

プルリクエストを歓迎します！

1. フォークする
2. フィーチャーブランチを作成 (`git checkout -b feature/amazing-feature`)
3. コミット (`git commit -m 'Add amazing feature'`)
4. プッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを開く

## 📝 ライセンス

このプロジェクトは MIT ライセンスの下で公開されています。

## 📧 サポート

質問や問題がある場合は、GitHubのissueを作成してください。

---

**Built with ❤️ using Next.js and WordPress**
