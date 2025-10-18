'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

const images = [
  '/slick1.jpg',
  '/slick2.jpg',
  '/slick3.jpg',
  '/slick4.jpg',
  '/slick5.jpg',
];

export default function Slideshow() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // 自動スライド（5秒間隔）
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

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

  return (
    <div className="relative w-full overflow-hidden" style={{backgroundColor: 'var(--color-dojo-beige)'}}>
      {/* スライドコンテナ - 画像の元のアスペクト比（7:3）を保持 */}
      <div className="relative w-full aspect-[7/3] max-h-[800px]">
        {/* スライド画像 */}
        {images.map((image, index) => (
          <div
            key={image}
            className={`absolute inset-0 transition-opacity duration-700 ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Image
              src={image}
              alt={`スライド ${index + 1}`}
              fill
              className="object-contain"
              priority={index === 0}
            />
          </div>
        ))}

      {/* 左ボタン */}
      <button
        onClick={handlePrev}
        className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-20 md:bg-opacity-50 hover:bg-opacity-75 text-white p-1.5 md:p-3 rounded-full transition-all z-10"
        aria-label="前の画像"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-4 h-4 md:w-6 md:h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 19.5L8.25 12l7.5-7.5"
          />
        </svg>
      </button>

      {/* 右ボタン */}
      <button
        onClick={handleNext}
        className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-20 md:bg-opacity-50 hover:bg-opacity-75 text-white p-1.5 md:p-3 rounded-full transition-all z-10"
        aria-label="次の画像"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-4 h-4 md:w-6 md:h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.25 4.5l7.5 7.5-7.5 7.5"
          />
        </svg>
      </button>

        {/* インジケーター */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentIndex
                  ? 'bg-white scale-110'
                  : 'bg-white bg-opacity-50 hover:bg-opacity-75'
              }`}
              aria-label={`画像 ${index + 1} に移動`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

