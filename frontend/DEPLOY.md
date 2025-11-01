# デプロイガイド

このドキュメントでは、ヘッドレスWordPressフロントエンドを本番環境にデプロイする手順を説明します。

## 📋 デプロイ前のチェックリスト

- [ ] WordPress REST APIが正常に動作している
- [ ] `.env.local`に正しい環境変数が設定されている
- [ ] ローカル環境で動作確認済み
- [ ] `npm run build`でエラーが出ない
- [ ] WordPressプラグイン「Headless API Config」が有効化されている

## 🚀 Vercelへのデプロイ

### 1. GitHubリポジトリの準備

```bash
# Gitリポジトリの初期化（まだの場合）
cd /Users/ksugimoto/Desktop/narashinken.com-23
git init

# frontendディレクトリをコミット
git add frontend/
git commit -m "Add Next.js headless frontend"

# GitHubにプッシュ
git remote add origin https://github.com/your-username/your-repo.git
git push -u origin main
```

### 2. Vercelプロジェクトの作成

1. [Vercel](https://vercel.com)にログイン
2. 「Add New Project」をクリック
3. GitHubリポジトリを選択
4. 以下の設定を行う：

**プロジェクト設定:**
- Framework Preset: `Next.js`
- Root Directory: `frontend`
- Build Command: `npm run build`（デフォルト）
- Output Directory: `.next`（デフォルト）

**環境変数の設定:**

以下の環境変数を追加：

| キー | 値（例） |
|------|---------|
| `NEXT_PUBLIC_WORDPRESS_API_URL` | `https://your-wordpress-site.com/wp-json` |
| `NEXT_PUBLIC_SITE_NAME` | `奈良心剣道場` |
| `NEXT_PUBLIC_SITE_URL` | `https://narashinken.com` |
| `REVALIDATE_TIME` | `3600` |

5. 「Deploy」をクリック

### 3. カスタムドメインの設定

1. Vercelダッシュボードでプロジェクトを開く
2. 「Settings」→「Domains」に移動
3. カスタムドメインを追加（例：`narashinken.com`）
4. DNS設定に従って、ドメインのDNSレコードを更新

**DNS設定例:**
```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### 4. WordPress側の設定更新

`wp-content/plugins/headless-api-config/headless-api-config.php`を編集し、本番URLを追加：

```php
$this->allowed_origins = [
    'http://localhost:3000',
    'https://narashinken.com',          // 本番URL
    'https://www.narashinken.com',      // wwwサブドメイン
];
```

## 🔄 継続的デプロイ

### 自動デプロイの設定

GitHubリポジトリにプッシュすると、自動的にVercelがデプロイします：

```bash
git add .
git commit -m "Update content"
git push origin main
```

### Deploy Hookの設定（WordPressから手動デプロイ）

1. Vercelプロジェクト設定で「Deploy Hooks」を作成
2. フック名を設定（例：`WordPress Update`）
3. URLをコピー

4. WordPressの`functions.php`に以下を追加：

```php
function trigger_vercel_deploy($post_id) {
    if (wp_is_post_revision($post_id)) {
        return;
    }
    
    $deploy_hook = 'https://api.vercel.com/v1/integrations/deploy/xxx/yyy';
    wp_remote_post($deploy_hook);
}
add_action('publish_post', 'trigger_vercel_deploy');
add_action('publish_page', 'trigger_vercel_deploy');
```

これで、WordPressで記事を公開すると自動的にフロントエンドが再デプロイされます。

## 🌐 その他のホスティングサービス

### Netlify

1. [Netlify](https://netlify.com)にログイン
2. 「Add new site」→「Import an existing project」
3. GitHubリポジトリを選択
4. ビルド設定：
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `frontend/.next`
5. 環境変数を設定
6. 「Deploy site」をクリック

### AWS Amplify

1. [AWS Amplify Console](https://console.aws.amazon.com/amplify)にアクセス
2. 「New app」→「Host web app」
3. GitHubリポジトリを接続
4. ビルド設定：
```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - cd frontend
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: frontend/.next
    files:
      - '**/*'
  cache:
    paths:
      - frontend/node_modules/**/*
```
5. 環境変数を設定
6. デプロイ

### 独自サーバー（Node.js）

#### 要件
- Node.js 18.x以上
- PM2（プロセス管理）
- Nginx（リバースプロキシ）

#### セットアップ手順

1. サーバーにコードをクローン：
```bash
git clone https://github.com/your-username/your-repo.git
cd your-repo/frontend
npm install
```

2. `.env.local`を作成：
```bash
cp .env.local.example .env.local
# 環境変数を編集
nano .env.local
```

3. ビルド：
```bash
npm run build
```

4. PM2でアプリケーションを起動：
```bash
npm install -g pm2
pm2 start npm --name "narashinken-frontend" -- start
pm2 save
pm2 startup
```

5. Nginxの設定（`/etc/nginx/sites-available/narashinken`）：
```nginx
server {
    listen 80;
    server_name narashinken.com www.narashinken.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

6. SSL設定（Let's Encrypt）：
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d narashinken.com -d www.narashinken.com
```

7. Nginxを再起動：
```bash
sudo systemctl restart nginx
```

## 🔧 パフォーマンス最適化

### CDNの設定

#### Cloudflare
1. [Cloudflare](https://cloudflare.com)にドメインを追加
2. DNSレコードをCloudflareに移行
3. 「Speed」→「Optimization」で設定：
   - Auto Minify: ON
   - Brotli: ON
   - Rocket Loader: ON

### キャッシュの最適化

#### ISRの調整
`.env.local`の`REVALIDATE_TIME`を調整：
- 頻繁に更新される場合: `600`（10分）
- 通常: `3600`（1時間）
- あまり更新されない場合: `86400`（24時間）

### 画像最適化

Next.jsの画像最適化は自動的に適用されます。WordPressで大きな画像をアップロードしても、自動的に最適なサイズに変換されます。

## 📊 モニタリングとアナリティクス

### Vercel Analytics（Vercel使用時）

1. Vercelダッシュボードで「Analytics」を有効化
2. Web Vitalsの確認が可能

### Google Analytics

1. `frontend/app/layout.tsx`にGoogle Analyticsを追加：

```tsx
import Script from 'next/script';

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XXXXXXXXXX');
          `}
        </Script>
      </head>
      <body>{children}</body>
    </html>
  );
}
```

## 🐛 トラブルシューティング

### ビルドエラー

```bash
# ローカルでビルドテスト
npm run build

# 型チェック
npm run type-check

# Lintエラーの修正
npm run lint -- --fix
```

### 環境変数が反映されない

1. Vercelの場合、環境変数を更新後に再デプロイが必要
2. 環境変数名が`NEXT_PUBLIC_`で始まっているか確認

### 画像が表示されない

1. `next.config.ts`の`remotePatterns`を確認
2. WordPressサイトがHTTPSを使用しているか確認
3. CORSエラーがないか確認

### パフォーマンスが遅い

1. ISRが正しく動作しているか確認
2. 画像がNext.js Imageコンポーネントを使用しているか確認
3. Vercel Analyticsでボトルネックを特定

## 📝 本番環境チェックリスト

デプロイ後、以下を確認してください：

- [ ] すべてのページが正常に表示される
- [ ] 画像が正しく読み込まれる
- [ ] メニューが動作する
- [ ] WordPressで記事を投稿し、フロントエンドに反映されるか確認
- [ ] SSL証明書が有効
- [ ] サイトマップが生成されている（`/sitemap.xml`）
- [ ] robots.txtが正しい（`/robots.txt`）
- [ ] Google Search Consoleにサイトマップを登録
- [ ] パフォーマンステスト（Lighthouse）で90点以上

## 🔄 更新手順

### コンテンツの更新
1. WordPressで記事を投稿・編集
2. 設定した時間（デフォルト1時間）後に自動反映
3. 即座に反映させたい場合は、Deploy Hookを使用

### コードの更新
```bash
# 変更をコミット
git add .
git commit -m "Update feature"
git push origin main

# 自動的にデプロイされる
```

## 📞 サポート

問題が発生した場合：
1. [Vercelのドキュメント](https://vercel.com/docs)を確認
2. [Next.jsのドキュメント](https://nextjs.org/docs)を確認
3. GitHubのissueを作成

デプロイが完了したら、お知らせください！🎉

