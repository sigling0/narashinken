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
        hostname: 'sigling-pg.com',
      },
      {
        protocol: 'https',
        hostname: '**.sigling-pg.com',
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
};

export default nextConfig;
