# 奈良新聞 - Headless WordPress フロントエンド

このプロジェクトは、WordPressをヘッドレスCMSとして使用し、Next.js 15でフロントエンドを構築したモダンなWebサイトです。

## 🚀 主な機能

- **高速なページ表示**: Next.js App RouterとISR（Incremental Static Regeneration）による最適化
- **WordPress統合**: WordPress REST APIを使用したシームレスなコンテンツ取得
- **SEO最適化**: メタデータ、サイトマップ、robots.txtの自動生成
- **レスポンシブデザイン**: Tailwind CSSによるモバイルファースト設計
- **画像最適化**: Next.js Image Componentによる自動最適化（WebP/AVIF対応）
- **型安全**: TypeScriptによる完全な型サポート

## 📋 必要要件

- Node.js 18.x以上
- npm または yarn
- 稼働中のWordPressサイト（REST API有効化済み）

## 🛠️ セットアップ

### 1. 環境変数の設定

`.env.local.example`をコピーして`.env.local`を作成：

```bash
cp .env.local.example .env.local
```

`.env.local`を編集し、WordPressサイトのURLを設定：

```env
NEXT_PUBLIC_WORDPRESS_API_URL=https://your-wordpress-site.com/wp-json
NEXT_PUBLIC_SITE_NAME=奈良新聞
NEXT_PUBLIC_SITE_URL=https://narashinken.com
REVALIDATE_TIME=3600
```

### 2. 依存パッケージのインストール

```bash
npm install
```

### 3. WordPressプラグインの有効化

WordPress管理画面で以下のプラグインを有効化してください：

`wp-content/plugins/headless-api-config/headless-api-config.php`

このプラグインは以下の機能を提供します：
- CORS設定
- カスタムREST APIエンドポイント
- メニュー取得API
- 最適化されたデータフォーマット

### 4. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてください。

## 📁 プロジェクト構成

```
frontend/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # ルートレイアウト
│   ├── page.tsx           # ホームページ
│   ├── posts/             # 記事ページ
│   ├── category/          # カテゴリーページ
│   ├── [slug]/            # 固定ページ
│   ├── sitemap.ts         # サイトマップ生成
│   └── robots.ts          # robots.txt生成
├── components/            # Reactコンポーネント
│   ├── Header.tsx         # ヘッダー
│   ├── Footer.tsx         # フッター
│   ├── PostCard.tsx       # 記事カード
│   └── Loading.tsx        # ローディング
├── lib/                   # ユーティリティ
│   └── wordpress.ts       # WordPress API client
└── public/               # 静的ファイル
```

## 🔧 WordPress側の設定

### 必須プラグイン

1. **Headless API Config**（同梱）
   - カスタムエンドポイントとCORS設定を提供

### メニューの設定

1. WordPress管理画面で「外観」→「メニュー」に移動
2. 新しいメニューを作成
3. メニューの位置を「Primary」に設定

### パーマリンク設定

「設定」→「パーマリンク」で「投稿名」を選択してください。

## 🚢 デプロイ

### Vercelへのデプロイ

1. GitHubにリポジトリをプッシュ
2. [Vercel](https://vercel.com)でプロジェクトをインポート
3. 環境変数を設定：
   - `NEXT_PUBLIC_WORDPRESS_API_URL`
   - `NEXT_PUBLIC_SITE_NAME`
   - `NEXT_PUBLIC_SITE_URL`
   - `REVALIDATE_TIME`
4. デプロイ

### その他のホスティング

Next.jsをサポートする任意のホスティングサービスにデプロイできます：
- Netlify
- AWS Amplify
- Cloudflare Pages
- 独自サーバー（Node.js環境）

## ⚡ パフォーマンス最適化

このプロジェクトには以下の最適化が実装されています：

- **ISR（Incremental Static Regeneration）**: 1時間ごとに自動再生成
- **画像最適化**: Next.js Image Componentによる自動最適化
- **コード分割**: 自動的なJavaScriptバンドルの分割
- **プリフェッチ**: リンクの事前読み込み
- **圧縮**: Gzip/Brotli圧縮の有効化

## 🔒 セキュリティ

- CORS設定による適切なアクセス制御
- XSSフィルタリング
- CSPヘッダー（必要に応じて設定可能）
- 環境変数による機密情報の保護

## 🛡️ トラブルシューティング

### WordPressに接続できない

1. `.env.local`のURLが正しいか確認
2. WordPressサイトでREST APIが有効化されているか確認
3. CORSエラーの場合、Headless API Configプラグインの許可オリジンを確認

### 画像が表示されない

1. `next.config.ts`の`remotePatterns`にWordPressドメインが追加されているか確認
2. WordPressサイトの画像URLが正しいか確認

### ビルドエラー

```bash
npm run build
```

でエラーメッセージを確認し、TypeScriptエラーや依存関係の問題を解決してください。

## 📝 ライセンス

このプロジェクトは MIT ライセンスの下で公開されています。

## 🤝 貢献

プルリクエストを歓迎します！大きな変更の場合は、まずissueを開いて変更内容を議論してください。

## 📧 サポート

質問や問題がある場合は、GitHubのissueを作成してください。
