# ヘッドレスWordPress セットアップガイド

このガイドでは、既存のWordPressサイトをヘッドレス化し、Next.jsフロントエンドと連携させる手順を説明します。

## 📖 目次

1. [概要](#概要)
2. [WordPress側の設定](#wordpress側の設定)
3. [フロントエンド側の設定](#フロントエンド側の設定)
4. [動作確認](#動作確認)
5. [本番環境へのデプロイ](#本番環境へのデプロイ)

## 概要

### ヘッドレスWordPressとは？

ヘッドレスWordPressは、WordPressをバックエンド（コンテンツ管理システム）としてのみ使用し、フロントエンド（表示部分）を別の技術スタックで構築するアーキテクチャです。

### メリット

- **高速化**: 静的生成やISRにより、従来のWordPressよりも高速
- **セキュリティ向上**: フロントエンドとバックエンドが分離されているため、攻撃対象が減少
- **柔軟性**: モダンなフロントエンド技術を使用可能
- **スケーラビリティ**: CDNを活用した効率的な配信

### デメリット

- **複雑性の増加**: 2つのシステムを管理する必要がある
- **初期設定の手間**: セットアップに時間がかかる
- **ホスティングコスト**: 2つのホスティング環境が必要

## WordPress側の設定

### 1. プラグインのインストール

#### Headless API Configプラグインの有効化

1. WordPressの管理画面にログイン
2. 「プラグイン」→「インストール済みプラグイン」に移動
3. 「Headless WordPress API Configuration」を探して「有効化」をクリック

プラグインが見つからない場合は、以下のパスに配置されていることを確認：
```
wp-content/plugins/headless-api-config/headless-api-config.php
```

#### プラグインの設定

プラグインファイル（`headless-api-config.php`）を開き、`$this->allowed_origins`配列にフロントエンドのURLを追加：

```php
$this->allowed_origins = [
    'http://localhost:3000',           // ローカル開発環境
    'http://localhost:3001',           // ローカル開発環境（予備）
    'https://your-frontend-domain.com', // 本番環境
];
```

### 2. パーマリンク設定（重要！）

**⚠️ この設定は必須です。設定しないとREST APIが404エラーになります。**

1. 「設定」→「パーマリンク」に移動
2. 「投稿名」を選択（「基本」以外なら何でもOKですが、「投稿名」推奨）
3. 「変更を保存」をクリック

**理由：** WordPressのREST APIは、パーマリンク構造が「基本」の場合は正常に動作しません。必ず変更してください。

### 3. REST APIの確認

パーマリンク設定後、以下のURLにアクセスしてREST APIが正常に動作しているか確認：

```
https://your-wordpress-site.com/wp-json/wp/v2/posts
```

**正常な場合：** 投稿データがJSON形式で表示されます。

**404エラーが出る場合：**
- パーマリンク設定を確認（上記の手順2）
- SiteGuardプラグインの「REST APIアクセス制限」をOFFにする
- サーバーのnginx/Apache設定を確認（サーバー管理者に相談）

### 4. メニューの設定（オプション）

1. 「外観」→「メニュー」に移動
2. 新しいメニューを作成（例：「Primary Menu」）
3. メニュー項目を追加
4. 「メニューの位置」で「Primary」にチェック
5. 「メニューを保存」をクリック

### 5. カスタムエンドポイントの確認

以下のエンドポイントが正常に動作するか確認：

```bash
# サイト情報
curl https://your-wordpress-site.com/wp-json/headless/v1/site-info

# 最新投稿
curl https://your-wordpress-site.com/wp-json/headless/v1/recent-posts

# メニュー
curl https://your-wordpress-site.com/wp-json/headless/v1/menus
```

## フロントエンド側の設定

### 1. 環境変数の設定

`frontend/.env.local`ファイルを作成：

```bash
cd frontend
cp .env.local.example .env.local
```

`.env.local`を編集：

```env
# WordPress APIのURL（最後に/wp-jsonを含める）
NEXT_PUBLIC_WORDPRESS_API_URL=https://your-wordpress-site.com/wp-json

# サイト名
NEXT_PUBLIC_SITE_NAME=奈良心剣道場

# サイトURL（フロントエンドのURL）
NEXT_PUBLIC_SITE_URL=https://narashinken.com

# 再生成時間（秒単位）- 3600秒 = 1時間
REVALIDATE_TIME=3600
```

### 2. Next.jsの画像設定

`frontend/next.config.ts`を開き、WordPressサイトのドメインを追加：

```typescript
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'your-wordpress-site.com',
    },
  ],
},
```

### 3. 依存パッケージのインストール

```bash
cd frontend
npm install
```

### 4. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで `http://localhost:3000` を開きます。

## 動作確認

### チェックリスト

- [ ] ホームページが表示される
- [ ] 記事一覧ページが表示される
- [ ] 個別記事ページが表示される
- [ ] 固定ページが表示される
- [ ] ヘッダーメニューが表示される
- [ ] アイキャッチ画像が表示される
- [ ] カテゴリーページが動作する

### デバッグ方法

#### WordPressに接続できない場合

1. ブラウザの開発者ツールで「Network」タブを確認
2. CORSエラーの有無をチェック
3. WordPressプラグインの`allowed_origins`を確認

#### 画像が表示されない場合

1. `next.config.ts`の設定を確認
2. WordPressサイトの画像URLが正しいか確認
3. ブラウザのコンソールでエラーメッセージを確認

#### データが取得できない場合

```bash
# WordPress APIを直接テスト
curl https://your-wordpress-site.com/wp-json/wp/v2/posts

# カスタムエンドポイントをテスト
curl https://your-wordpress-site.com/wp-json/headless/v1/site-info
```

## 本番環境へのデプロイ

### 1. WordPressの本番環境設定

#### SSL/HTTPSの有効化

WordPress側でHTTPSが有効になっていることを確認：

```php
// wp-config.phpに追加（既に存在する場合がある）
if (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === "https") {
    $_SERVER['HTTPS'] = 'on';
}
```

#### プラグインの本番URL設定

`headless-api-config.php`の`allowed_origins`に本番URLを追加：

```php
$this->allowed_origins = [
    'https://your-production-frontend.com',
];
```

### 2. Next.jsの本番デプロイ

#### Vercelへのデプロイ

1. GitHubにコードをプッシュ

```bash
git add .
git commit -m "Headless WordPress setup"
git push origin main
```

2. [Vercel](https://vercel.com)にログイン
3. 「New Project」をクリック
4. GitHubリポジトリを選択
5. Root Directoryを`frontend`に設定
6. 環境変数を設定：
   - `NEXT_PUBLIC_WORDPRESS_API_URL`
   - `NEXT_PUBLIC_SITE_NAME`
   - `NEXT_PUBLIC_SITE_URL`
   - `REVALIDATE_TIME`
7. 「Deploy」をクリック

#### 独自サーバーへのデプロイ

```bash
cd frontend
npm run build
npm start
```

または、静的エクスポート：

```bash
# next.config.tsで output: 'export' を有効化
npm run build
```

生成された`out`ディレクトリをWebサーバーにアップロード

### 3. DNS設定

1. ドメインのDNS設定を更新
2. フロントエンドのドメインをVercelまたはホスティングサーバーにポイント
3. WordPressは既存のドメインまたはサブドメイン（例：`cms.narashinken.com`）で運用

### 4. パフォーマンス最適化

#### CDNの設定

- Vercelの場合、自動的にCDNが有効化されます
- その他の場合、CloudflareなどのCDNを設定

#### キャッシュの設定

ISR（Incremental Static Regeneration）が有効になっています：
- デフォルト：1時間ごとに再生成
- `.env.local`の`REVALIDATE_TIME`で調整可能

#### 画像最適化

Next.jsの画像最適化が自動的に適用されます：
- WebP/AVIF形式への自動変換
- レスポンシブ画像の生成
- 遅延読み込み

## 運用上の注意点

### WordPressでの記事投稿

1. WordPressで通常通り記事を投稿
2. フロントエンドは設定された時間（デフォルト1時間）後に自動更新
3. 即座に反映させたい場合は、Vercelのデプロイフックを使用

### Vercel Deploy Hook（即時更新）

1. Vercelプロジェクト設定で「Deploy Hooks」を作成
2. WordPressにプラグインを追加し、投稿時にフックを呼び出す

```php
// functions.phpに追加
function trigger_vercel_deploy($post_id) {
    if (wp_is_post_revision($post_id)) {
        return;
    }
    
    $deploy_hook = 'YOUR_VERCEL_DEPLOY_HOOK_URL';
    wp_remote_post($deploy_hook);
}
add_action('publish_post', 'trigger_vercel_deploy');
```

### バックアップ

- WordPress: 通常のバックアッププラグインを使用
- フロントエンド: GitHubにコードをコミット

### モニタリング

- Vercel Analytics（Vercel使用時）
- Google Analytics
- WordPress側の管理画面でコンテンツ管理

## まとめ

これで、ヘッドレスWordPressのセットアップが完了しました。

### 次のステップ

1. デザインのカスタマイズ
2. 追加ページの作成
3. SEO設定の最適化
4. ソーシャルメディア連携
5. アナリティクスの設定

質問や問題がある場合は、GitHubのissueを作成してください。

