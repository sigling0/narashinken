'use client';

import Link from 'next/link';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
}

export default function Pagination({ currentPage, totalPages, basePath }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = [];
  const maxVisible = 5;
  
  let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let endPage = Math.min(totalPages, startPage + maxVisible - 1);
  
  if (endPage - startPage < maxVisible - 1) {
    startPage = Math.max(1, endPage - maxVisible + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <nav className="flex justify-center items-center gap-2 mt-12">
      {/* 前へボタン */}
      {currentPage > 1 && (
        <Link
          href={`${basePath}?page=${currentPage - 1}`}
          className="px-4 py-2 text-sm font-medium rounded transition-all duration-300 hover:shadow-md hover:-translate-x-1"
          style={{
            backgroundColor: 'white',
            color: 'var(--color-text-primary)',
            border: '1px solid var(--color-dojo-tag)'
          }}
        >
          ← 前へ
        </Link>
      )}

      {/* 最初のページ */}
      {startPage > 1 && (
        <>
          <Link
            href={`${basePath}?page=1`}
            className="px-4 py-2 text-sm font-medium rounded transition-all duration-300 hover:shadow-md hover:scale-105"
            style={{
              backgroundColor: 'white',
              color: 'var(--color-text-primary)',
              border: '1px solid var(--color-dojo-tag)'
            }}
          >
            1
          </Link>
          {startPage > 2 && (
            <span style={{color: 'var(--color-text-tertiary)'}}>...</span>
          )}
        </>
      )}

      {/* ページ番号 */}
      {pages.map((page) => (
        <Link
          key={page}
          href={`${basePath}?page=${page}`}
          className={`px-4 py-2 text-sm font-medium rounded transition-all duration-300 hover:shadow-md hover:scale-105 ${
            page === currentPage ? 'font-extrabold' : ''
          }`}
          style={{
            backgroundColor: page === currentPage ? 'var(--color-dojo-title)' : 'white',
            color: page === currentPage ? 'white' : 'var(--color-text-primary)',
            border: `1px solid ${page === currentPage ? 'var(--color-dojo-title)' : 'var(--color-dojo-tag)'}`
          }}
        >
          {page}
        </Link>
      ))}

      {/* 最後のページ */}
      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && (
            <span style={{color: 'var(--color-text-tertiary)'}}>...</span>
          )}
          <Link
            href={`${basePath}?page=${totalPages}`}
            className="px-4 py-2 text-sm font-medium rounded transition-all duration-300 hover:shadow-md hover:scale-105"
            style={{
              backgroundColor: 'white',
              color: 'var(--color-text-primary)',
              border: '1px solid var(--color-dojo-tag)'
            }}
          >
            {totalPages}
          </Link>
        </>
      )}

      {/* 次へボタン */}
      {currentPage < totalPages && (
        <Link
          href={`${basePath}?page=${currentPage + 1}`}
          className="px-4 py-2 text-sm font-medium rounded transition-all duration-300 hover:shadow-md hover:translate-x-1"
          style={{
            backgroundColor: 'white',
            color: 'var(--color-text-primary)',
            border: '1px solid var(--color-dojo-tag)'
          }}
        >
          次へ →
        </Link>
      )}
    </nav>
  );
}

