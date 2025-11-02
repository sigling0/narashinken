import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'http',
        hostname: 'narashinken.com',
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
        hostname: '**.cdninstagram.com',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    // 画質最適化（PageSpeed対策）
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30日キャッシュ
    // 使用する品質値を明示的に設定（Next.js 16対応）
    qualities: [50, 55, 60, 70, 75],
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
  
  // コード分割最適化
  experimental: {
    optimizePackageImports: ['axios'], // axiosの最適化
  },
};

export default nextConfig;
