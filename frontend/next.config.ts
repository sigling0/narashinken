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
    ],
    formats: ['image/webp', 'image/avif'],
  },
  
  // 静的エクスポートを無効化（ISRを使用するため）
  // output: 'export',
  
  // 圧縮を有効化
  compress: true,
  
  // パワードバイヘッダーを無効化（セキュリティ）
  poweredByHeader: false,
  
  // 厳格モード
  reactStrictMode: true,
  
  // CSS最適化
  optimizeFonts: true, // フォントの最適化を有効化
  
  // パフォーマンス最適化
  swcMinify: true, // SWCによるJavaScript圧縮
  
  // コード分割最適化
  experimental: {
    optimizePackageImports: ['axios'], // axiosの最適化
  },
};

export default nextConfig;
