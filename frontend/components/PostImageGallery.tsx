'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';

interface PostImageGalleryProps {
  images: string[];
}

export default function PostImageGallery({ images }: PostImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const fullscreenRef = useRef<HTMLDivElement>(null);

  // スワイプの最小距離（px）
  const minSwipeDistance = 50;

  // 前の画像へ（useCallbackでメモ化）
  const handlePrev = useCallback(() => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  }, [images.length]);

  // 次の画像へ（useCallbackでメモ化）
  const handleNext = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  }, [images.length]);

  // フルスクリーンを閉じる（useCallbackでメモ化）
  const handleCloseFullscreen = useCallback(() => {
    setIsFullscreen(false);
  }, []);

  // キーボードナビゲーション（フルスクリーン時）
  useEffect(() => {
    if (!isFullscreen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'Escape') {
        handleCloseFullscreen();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, handlePrev, handleNext, handleCloseFullscreen]);

  // フルスクリーン時のbodyスクロール防止
  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isFullscreen]);

  // 画像がない場合は何も表示しない（useEffectの後に配置）
  if (!images || images.length === 0) {
    return null;
  }

  // サムネイルクリックで画像を切り替え
  const handleThumbnailClick = (index: number) => {
    setCurrentIndex(index);
  };

  // 画像クリックでフルスクリーン表示
  const handleImageClick = () => {
    setIsFullscreen(true);
  };

  // タッチ開始
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  // タッチ移動中
  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  // タッチ終了（スワイプ判定）
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }
  };

  return (
    <>
      {/* 通常表示のギャラリー */}
      <div className="w-full my-8">
        {/* メインスライドショー */}
        <div className="relative w-full bg-gray-900 rounded-lg overflow-hidden">
          {/* 画像コンテナ - アスペクト比16:9 */}
          <div 
            className="relative w-full aspect-video cursor-pointer"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            onClick={handleImageClick}
          >
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

            {/* 拡大アイコン */}
            <div className="absolute top-4 left-4 bg-black/60 text-white px-3 py-2 rounded-lg text-xs md:text-sm flex items-center gap-2 pointer-events-none">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                strokeWidth={2} 
                stroke="currentColor" 
                className="w-4 h-4"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
              </svg>
              <span className="hidden md:inline">クリックで拡大</span>
            </div>

            {/* 左ボタン */}
            {images.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
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
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
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

      {/* フルスクリーンモーダル */}
      {isFullscreen && (
        <div 
          ref={fullscreenRef}
          className="fixed inset-0 bg-black z-50 flex items-center justify-center"
          onClick={handleCloseFullscreen}
        >
          {/* フルスクリーン画像コンテナ */}
          <div 
            className="relative w-full h-full flex items-center justify-center"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            onClick={(e) => e.stopPropagation()}
          >
            {/* フルスクリーン画像 */}
            {images.map((image, index) => (
              <div
                key={image}
                className={`absolute inset-0 flex items-center justify-center transition-opacity duration-500 ${
                  index === currentIndex ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <div className="relative w-full h-full p-4 md:p-8">
                  <Image
                    src={image}
                    alt={`ギャラリー画像 ${index + 1}`}
                    fill
                    className="object-contain"
                    sizes="100vw"
                    quality={90}
                    priority
                  />
                </div>
              </div>
            ))}

            {/* 閉じるボタン */}
            <button
              onClick={handleCloseFullscreen}
              className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-all z-20 backdrop-blur-sm"
              aria-label="フルスクリーンを閉じる"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* 左ボタン（フルスクリーン） */}
            {images.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-4 rounded-full transition-all z-20 backdrop-blur-sm"
                aria-label="前の画像"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-8 h-8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 19.5L8.25 12l7.5-7.5"
                  />
                </svg>
              </button>
            )}

            {/* 右ボタン（フルスクリーン） */}
            {images.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-4 rounded-full transition-all z-20 backdrop-blur-sm"
                aria-label="次の画像"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-8 h-8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 4.5l7.5 7.5-7.5 7.5"
                  />
                </svg>
              </button>
            )}

            {/* 画像カウンター（フルスクリーン） */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/10 text-white px-4 py-2 rounded-full text-lg backdrop-blur-sm">
              {currentIndex + 1} / {images.length}
            </div>

            {/* サムネイルナビゲーション（フルスクリーン・デスクトップのみ） */}
            {images.length > 1 && (
              <div className="hidden md:flex absolute bottom-20 left-1/2 -translate-x-1/2 gap-2 max-w-3xl overflow-x-auto px-4">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleThumbnailClick(index);
                    }}
                    className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      index === currentIndex
                        ? 'border-white ring-2 ring-white/50 scale-110'
                        : 'border-white/30 hover:border-white/60'
                    }`}
                    aria-label={`画像 ${index + 1} を表示`}
                  >
                    <Image
                      src={image}
                      alt={`サムネイル ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="64px"
                      quality={50}
                    />
                  </button>
                ))}
              </div>
            )}

            {/* 操作ヒント（デスクトップのみ） */}
            <div className="hidden md:block absolute top-4 left-4 bg-white/10 text-white px-4 py-2 rounded-lg text-sm backdrop-blur-sm">
              <p>← → キーで切り替え　｜　Esc で閉じる</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
