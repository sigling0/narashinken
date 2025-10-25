import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'narashinken.com',
      },
      {
        protocol: 'https',
        hostname: '**.narashinken.com',
      },
      {
        protocol: 'https',
        hostname: 'cdninstagram.com',
      },
      {
        protocol: 'https',
        hostname: '**.cdninstagram.com',
      },
      {
        protocol: 'https',
        hostname: 'scontent.cdninstagram.com',
      },
      {
        protocol: 'https',
        hostname: 'scontent-tpe1-1.cdninstagram.com',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    // 画質最適化（PageSpeed対策）
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30日キャッシュ
    // デフォルト画質を60に設定（75から下げて圧縮強化）
    // 個別にquality指定がない場合はこれが適用される
  },
  
  // 静的エクスポートを無効化（ISRを使用するため）
  // output: 'export',
  
  // 圧縮を有効化
  compress: true,
  
  // パワードバイヘッダーを無効化（セキュリティ）
  poweredByHeader: false,
  
  // 厳格モード
  reactStrictMode: true,
  
  // 本番ビルドでソースマップを無効化（サイズ削減）
  productionBrowserSourceMaps: false,
  
  // CSS最適化
  optimizeFonts: true, // フォントの最適化を有効化
  
  // パフォーマンス最適化
  swcMinify: true, // SWCによるJavaScript圧縮
  
  // モダンブラウザターゲット（レガシーポリフィル削減）
  compiler: {
    // SWC設定: ES2020+をターゲットに（不要なポリフィル削減）
    // Array.at, Array.flat, Object.fromEntries などのネイティブ機能を使用
  },
  
  // コード分割最適化
  experimental: {
    optimizePackageImports: ['axios'], // axiosの最適化
  },
};

export default nextConfig;
