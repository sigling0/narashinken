'use client';

import Image from 'next/image';
import Link from 'next/link';
import { InstagramPost } from '@/lib/wordpress';

interface InstagramFeedProps {
  posts: InstagramPost[];
  message?: string;
}

export default function InstagramFeed({ posts, message }: InstagramFeedProps) {
  // データがない場合はプレースホルダーを表示
  if (!posts || posts.length === 0) {
    return (
      <div 
        className="rounded-lg p-8 text-center border-2 border-dashed"
        style={{
          borderColor: 'var(--color-dojo-tag)',
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

  return (
    <div className="grid grid-cols-2 gap-2">
      {posts.slice(0, 6).map((post) => (
        <Link
          key={post.id}
          href={post.permalink}
          target="_blank"
          rel="noopener noreferrer"
          className="relative aspect-square overflow-hidden rounded-lg group bg-gray-100"
        >
          <Image
            src={post.media_url}
            alt={post.caption ? post.caption.substring(0, 100) : 'Instagram post'}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 25vw, 15vw"
          />
          {/* ホバー時のオーバーレイ */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
            <svg 
              className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              viewBox="0 0 999.9899 999.9966" 
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
            >
              <path d="M292.9208,3.4969c-53.2,2.51-89.53,11-121.29,23.48-32.87,12.81-60.73,30-88.45,57.82-27.72,27.82-44.79,55.7-57.51,88.62-12.31,31.83-20.65,68.19-23,121.42C.3208,348.0669-.1992,365.1769.0608,500.9569s.86,152.8,3.44,206.14c2.54,53.19,11,89.51,23.48,121.28,12.83,32.87,30,60.72,57.83,88.45,27.83,27.73,55.69,44.76,88.69,57.5,31.8,12.29,68.17,20.67,121.39,23,53.22,2.33,70.35,2.87,206.09,2.61,135.74-.26,152.83-.86,206.16-3.39s89.46-11.05,121.24-23.47c32.87-12.86,60.74-30,88.45-57.84s44.77-55.74,57.48-88.68c12.32-31.8,20.69-68.17,23-121.35,2.33-53.37,2.88-70.41,2.62-206.17s-.87-152.78-3.4-206.1-11-89.53-23.47-121.32c-12.85-32.87-30-60.7-57.82-88.45s-55.74-44.8-88.67-57.48c-31.82-12.31-68.17-20.7-121.39-23S634.8308-.2031,499.0408.0569s-152.79.84-206.12,3.44"/>
            </svg>
          </div>
        </Link>
      ))}
    </div>
  );
}

