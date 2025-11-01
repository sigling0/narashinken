'use client';

import { useState } from 'react';
import Image from 'next/image';

interface PostImageGalleryProps {
  images: string[];
}

export default function PostImageGallery({ images }: PostImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // 画像がない場合は何も表示しない
  if (!images || images.length === 0) {
    return null;
  }

  // 前の画像へ
  const handlePrev = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  // 次の画像へ
  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  // サムネイルクリックで画像を切り替え
  const handleThumbnailClick = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="w-full my-8">
      {/* メインスライドショー */}
      <div className="relative w-full bg-gray-100 rounded-lg overflow-hidden">
        {/* 画像コンテナ - アスペクト比16:9 */}
        <div className="relative w-full aspect-video">
          {/* スライド画像 */}
          {images.map((image, index) => (
            <div
              key={image}
              className={`absolute inset-0 transition-opacity duration-500 ${
                index === currentIndex ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <Image
                src={image}
                alt={`ギャラリー画像 ${index + 1}`}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                quality={75}
              />
            </div>
          ))}

          {/* 左ボタン */}
          {images.length > 1 && (
            <button
              onClick={handlePrev}
              className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/75 text-white p-2 md:p-3 rounded-full transition-all z-10"
              aria-label="前の画像"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5 md:w-6 md:h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 19.5L8.25 12l7.5-7.5"
                />
              </svg>
            </button>
          )}

          {/* 右ボタン */}
          {images.length > 1 && (
            <button
              onClick={handleNext}
              className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/75 text-white p-2 md:p-3 rounded-full transition-all z-10"
              aria-label="次の画像"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5 md:w-6 md:h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 4.5l7.5 7.5-7.5 7.5"
                />
              </svg>
            </button>
          )}

          {/* 画像カウンター */}
          <div className="absolute top-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
            {currentIndex + 1} / {images.length}
          </div>
        </div>
      </div>

      {/* サムネイルナビゲーション */}
      {images.length > 1 && (
        <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => handleThumbnailClick(index)}
              className={`relative flex-shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden border-2 transition-all ${
                index === currentIndex
                  ? 'border-blue-500 ring-2 ring-blue-300 scale-105'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              aria-label={`画像 ${index + 1} を表示`}
            >
              <Image
                src={image}
                alt={`サムネイル ${index + 1}`}
                fill
                className="object-cover"
                sizes="96px"
                quality={60}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

