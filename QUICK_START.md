# 🚀 クイックスタートガイド

このガイドでは、最速でヘッドレスWordPressフロントエンドを起動する手順を説明します。

## ⏱️ 所要時間: 約10分

## 📋 前提条件

- ✅ Node.js 18.x以上がインストール済み
- ✅ WordPress サイトが稼働中
- ✅ WordPress 管理画面にアクセス可能

## 🔧 セットアップ手順

### 1. WordPressプラグインを有効化（2分）

1. WordPress管理画面にログイン
2. 「プラグイン」→「インストール済みプラグイン」
3. **「Headless WordPress API Configuration」** を探して **「有効化」**

✅ プラグインが有効化されたことを確認

### 2. 環境変数を設定（2分）

```bash
# frontendディレクトリに移動
cd /Users/ksugimoto/Desktop/narashinken.com-23/frontend

# 環境変数ファイルを作成
cp .env.local.example .env.local
```

`.env.local` を開いて、WordPressのURLを設定：

```env
NEXT_PUBLIC_WORDPRESS_API_URL=http://localhost:8888/wp-json
```

💡 **ヒント:** WordPressサイトのURLに `/wp-json` を追加してください

### 3. 依存パッケージをインストール（3分）

```bash
npm install
```

### 4. 開発サーバーを起動（1分）

```bash
npm run dev
```

### 5. ブラウザで確認（1分）

ブラウザで以下にアクセス：

👉 **http://localhost:3000**

## ✨ 完了！

ヘッドレスWordPressフロントエンドが起動しました！

## 📝 次のステップ

### すぐに試せること

1. **記事を投稿する**
   - WordPressで新しい記事を投稿
   - 1時間後（またはサーバー再起動後）にフロントエンドで確認

2. **メニューを設定する**
   - WordPress管理画面 → 「外観」→「メニュー」
   - 新しいメニューを作成して「Primary」に設定

3. **固定ページを作成する**
   - WordPress管理画面 → 「固定ページ」→「新規追加」
   - 公開後、`http://localhost:3000/[スラッグ]` でアクセス

### カスタマイズ

- **デザイン変更**: `frontend/components/` 内のファイルを編集
- **スタイル調整**: `frontend/app/globals.css` を編集
- **ページ追加**: `frontend/app/` 内に新しいディレクトリを作成

## 🐛 トラブルシューティング

### 「データの取得に失敗しました」と表示される

**原因:** WordPress APIに接続できない

**解決策:**
1. `.env.local` の `NEXT_PUBLIC_WORDPRESS_API_URL` が正しいか確認
2. WordPressサイトが起動しているか確認
3. 以下のURLにアクセスして、JSONデータが表示されるか確認:
   ```
   http://localhost:8888/wp-json/wp/v2/posts
   ```

### 画像が表示されない

**原因:** 画像ドメインが許可されていない

**解決策:**
`frontend/next.config.ts` を開き、WordPressのドメインを追加：

```typescript
images: {
  remotePatterns: [
    {
      protocol: 'http',
      hostname: 'localhost',
    },
  ],
},
```

### メニューが表示されない

**原因:** WordPressでメニューが設定されていない

**解決策:**
1. WordPress管理画面 → 「外観」→「メニュー」
2. 新しいメニューを作成
3. 「メニューの位置」で **「Primary」** にチェック
4. 保存

## 📚 詳細ドキュメント

より詳しい情報は以下を参照：

- **[完全セットアップガイド](./HEADLESS_SETUP.md)** - 詳細な設定手順
- **[デプロイガイド](./frontend/DEPLOY.md)** - 本番環境へのデプロイ
- **[フロントエンドREADME](./frontend/README.md)** - 技術詳細

## 🎉 成功したら

1. デザインをカスタマイズ
2. コンテンツを追加
3. 本番環境にデプロイ

楽しんでください！🚀

