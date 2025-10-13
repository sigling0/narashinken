#!/bin/bash

# ヘッドレスWordPress フロントエンド セットアップスクリプト
# このスクリプトは初回セットアップを簡単にします

echo "🚀 ヘッドレスWordPress フロントエンド セットアップ"
echo "================================================"
echo ""

# 環境変数ファイルの確認
if [ -f ".env.local" ]; then
    echo "✅ .env.local ファイルが既に存在します"
else
    echo "📝 .env.local ファイルを作成しています..."
    cp .env.local.example .env.local
    echo "✅ .env.local ファイルを作成しました"
    echo ""
    echo "⚠️  重要: .env.local を編集して、WordPress のURLを設定してください"
    echo ""
fi

# Node.jsバージョンの確認
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ エラー: Node.js 18以上が必要です（現在: v$NODE_VERSION）"
    exit 1
else
    echo "✅ Node.js バージョン確認: $(node -v)"
fi

# node_modulesの確認
if [ -d "node_modules" ]; then
    echo "✅ node_modules が既に存在します"
    echo ""
    read -p "再インストールしますか？ (y/N): " reinstall
    if [[ $reinstall == "y" || $reinstall == "Y" ]]; then
        echo "📦 依存パッケージを再インストールしています..."
        npm install
    fi
else
    echo "📦 依存パッケージをインストールしています..."
    npm install
fi

echo ""
echo "================================================"
echo "✨ セットアップ完了！"
echo ""
echo "次のステップ:"
echo "1. .env.local を編集してWordPress URLを設定"
echo "   例: NEXT_PUBLIC_WORDPRESS_API_URL=http://localhost:8888/wp-json"
echo ""
echo "2. WordPressで「Headless WordPress API Configuration」プラグインを有効化"
echo ""
echo "3. 開発サーバーを起動:"
echo "   npm run dev"
echo ""
echo "4. ブラウザで http://localhost:3000 を開く"
echo ""
echo "📚 詳細なドキュメント:"
echo "   - QUICK_START.md"
echo "   - HEADLESS_SETUP.md"
echo "   - README.md"
echo ""
echo "================================================"

