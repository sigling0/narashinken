'use client';

import Image from 'next/image';
import Link from 'next/link';
import { InstagramPost } from '@/lib/wordpress';

interface InstagramFeedProps {
  posts: InstagramPost[];
  message?: string;
  accountName?: string;
  accountUrl?: string;
  username?: string;
  profilePictureUrl?: string;
}

export default function InstagramFeed({ posts, message, accountName = 'narashinken', accountUrl = 'https://www.instagram.com/narashinken', username: propUsername, profilePictureUrl }: InstagramFeedProps) {
  // データがない場合はプレースホルダーを表示
  if (!posts || posts.length === 0) {
    return (
      <div 
        className="rounded-lg p-8 text-center border-2 border-dashed"
        style={{
          borderColor: 'var(--color-dojo-secondary-key)',
          backgroundColor: 'rgba(255,255,255,0.5)'
        }}
      >
        <svg 
          className="w-16 h-16 mx-auto mb-4"
          viewBox="0 0 999.9899 999.9966" 
          xmlns="http://www.w3.org/2000/svg"
          style={{fill: 'var(--color-text-tertiary)'}}
        >
          <path d="M292.9208,3.4969c-53.2,2.51-89.53,11-121.29,23.48-32.87,12.81-60.73,30-88.45,57.82-27.72,27.82-44.79,55.7-57.51,88.62-12.31,31.83-20.65,68.19-23,121.42C.3208,348.0669-.1992,365.1769.0608,500.9569s.86,152.8,3.44,206.14c2.54,53.19,11,89.51,23.48,121.28,12.83,32.87,30,60.72,57.83,88.45,27.83,27.73,55.69,44.76,88.69,57.5,31.8,12.29,68.17,20.67,121.39,23,53.22,2.33,70.35,2.87,206.09,2.61,135.74-.26,152.83-.86,206.16-3.39s89.46-11.05,121.24-23.47c32.87-12.86,60.74-30,88.45-57.84s44.77-55.74,57.48-88.68c12.32-31.8,20.69-68.17,23-121.35,2.33-53.37,2.88-70.41,2.62-206.17s-.87-152.78-3.4-206.1-11-89.53-23.47-121.32c-12.85-32.87-30-60.7-57.82-88.45s-55.74-44.8-88.67-57.48c-31.82-12.31-68.17-20.7-121.39-23S634.8308-.2031,499.0408.0569s-152.79.84-206.12,3.44"/>
        </svg>
        <p 
          className="text-sm"
          style={{color: 'var(--color-text-tertiary)'}}
        >
          {message || 'Instagramフィード'}
          <br />
          <span className="text-xs">(準備中)</span>
        </p>
      </div>
    );
  }

  const username = propUsername || posts[0]?.username || accountName;

  return (
    <div>
      {/* アカウント情報 */}
      <Link
        href={accountUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 mb-4 p-3 rounded-lg transition-all duration-300 hover:bg-white/50"
      >
        {/* プロフィール写真 */}
        {profilePictureUrl ? (
          <div className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-gray-200">
            <Image
              src={profilePictureUrl}
              alt={`@${username}`}
              width={56}
              height={56}
              className="object-cover w-full h-full"
              loading="lazy"
            />
          </div>
        ) : (
          <div 
            className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0"
            style={{
              background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)'
            }}
          >
            <svg 
              className="w-8 h-8 text-white"
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
            >
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </div>
        )}
        <div className="flex-1">
          <p className="text-base font-bold" style={{color: 'var(--color-text-primary)'}}>
            @{username}
          </p>
        </div>
      </Link>

      {/* 投稿グリッド - 6行3列 */}
      <div className="grid grid-cols-3 gap-1 mb-4">
        {posts.slice(0, 18).map((post) => (
          <Link
            key={post.id}
            href={post.permalink}
            target="_blank"
            rel="noopener noreferrer"
            className="relative aspect-square overflow-hidden rounded group bg-gray-100"
          >
            <Image
              src={post.media_url}
              alt={post.caption ? post.caption.substring(0, 50) : 'Instagram post'}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
              sizes="(max-width: 1024px) 33vw, 20vw"
              loading="lazy"
            />
            {/* ホバー時のオーバーレイ */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300" />
          </Link>
        ))}
      </div>

      {/* フォローボタン */}
      <Link
        href={accountUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg font-medium text-sm transition-all duration-300 hover:opacity-90 hover:shadow-md"
        style={{
          backgroundColor: 'var(--color-dojo-primary-accent)',
          color: 'white'
        }}
      >
        <svg 
          className="w-5 h-5"
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
        >
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
        Instagramでフォロー
      </Link>
    </div>
  );
}

