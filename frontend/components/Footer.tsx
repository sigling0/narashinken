'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-20">
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* ロゴ */}
          <div className="w-56">
            <Image 
              src="/logo_footer.png" 
              alt="奈良心剣道場" 
              width={224}
              height={80}
              className="w-full h-auto"
            />
          </div>

          {/* ナビゲーション */}
          <nav className="flex-1 text-center">
            <ul className="flex flex-wrap justify-center gap-x-6 gap-y-3.5 text-sm">
              <li>
                <Link 
                  href="/about" 
                  className="underline transition-colors"
                  style={{color: 'var(--color-text-secondary)'}}
                >
                  道場について
                </Link>
              </li>
              <li>
                <Link 
                  href="/recruit" 
                  className="underline transition-colors"
                  style={{color: 'var(--color-text-secondary)'}}
                >
                  道場生募集
                </Link>
              </li>
              <li>
                <Link 
                  href="/tournament" 
                  className="underline transition-colors"
                  style={{color: 'var(--color-text-secondary)'}}
                >
                  大会予定
                </Link>
              </li>
              <li>
                <Link 
                  href="/notice" 
                  className="underline transition-colors"
                  style={{color: 'var(--color-text-secondary)'}}
                >
                  お知らせ
                </Link>
              </li>
              <li>
                <Link 
                  href="/contact" 
                  className="underline transition-colors"
                  style={{color: 'var(--color-text-secondary)'}}
                >
                  お問い合わせ
                </Link>
              </li>
            </ul>
          </nav>

          {/* SNSとコピーライト */}
          <div className="w-52 flex flex-col items-center gap-4">
            {/* SNSアイコン */}
            <div className="flex items-center gap-2 -mr-2">
              {/* X (Twitter) */}
              <a 
                href="https://twitter.com/narashinken" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 flex items-center justify-center rounded-[20%] bg-black transition-opacity hover:opacity-80"
                aria-label="X (Twitter)"
              >
                <svg width="65%" height="65%" viewBox="0 0 1200 1226.37" fill="#FFFFFF" xmlns="http://www.w3.org/2000/svg">
                  <path d="M714.163,519.284L1160.89,0h-105.86l-387.893,450.887L357.328,0H0l468.492,681.821L0,1226.37h105.866l409.625-476.152,327.181,476.152h357.328l-485.863-707.086h.026ZM569.165,687.828l-47.468-67.894L144.011,79.6944h162.604l304.797,435.9906,47.468,67.894,396.2,566.7211h-162.6039l-323.311-462.446v-.026Z"/>
                </svg>
              </a>
              {/* Instagram */}
              <a 
                href="https://www.instagram.com/narashinken/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 flex items-center justify-center rounded-[20%] transition-opacity hover:opacity-80"
                style={{background: 'linear-gradient(45deg, #FFD521 0%, #F50000 50%, #B900B4 100%)'}}
                aria-label="Instagram"
              >
                <svg width="75%" height="75%" viewBox="0 0 999.9899 999.9966" fill="#FFFFFF" xmlns="http://www.w3.org/2000/svg">
                  <path d="M292.9208,3.4969c-53.2,2.51-89.53,11-121.29,23.48-32.87,12.81-60.73,30-88.45,57.82-27.72,27.82-44.79,55.7-57.51,88.62-12.31,31.83-20.65,68.19-23,121.42C.3208,348.0669-.1992,365.1769.0608,500.9569s.86,152.8,3.44,206.14c2.54,53.19,11,89.51,23.48,121.28,12.83,32.87,30,60.72,57.83,88.45,27.83,27.73,55.69,44.76,88.69,57.5,31.8,12.29,68.17,20.67,121.39,23,53.22,2.33,70.35,2.87,206.09,2.61,135.74-.26,152.83-.86,206.16-3.39s89.46-11.05,121.24-23.47c32.87-12.86,60.74-30,88.45-57.84s44.77-55.74,57.48-88.68c12.32-31.8,20.69-68.17,23-121.35,2.33-53.37,2.88-70.41,2.62-206.17s-.87-152.78-3.4-206.1-11-89.53-23.47-121.32c-12.85-32.87-30-60.7-57.82-88.45s-55.74-44.8-88.67-57.48c-31.82-12.31-68.17-20.7-121.39-23S634.8308-.2031,499.0408.0569s-152.79.84-206.12,3.44M298.7608,907.3769c-48.75-2.12-75.22-10.22-92.86-17-23.36-9-40-19.88-57.58-37.29s-28.38-34.11-37.5-57.42c-6.85-17.64-15.1-44.08-17.38-92.83-2.48-52.69-3-68.51-3.29-202s.22-149.29,2.53-202c2.08-48.71,10.23-75.21,17-92.84,9-23.39,19.84-40,37.29-57.57s34.1-28.39,57.43-37.51c17.62-6.88,44.06-15.06,92.79-17.38,52.73-2.5,68.53-3,202-3.29,133.47-.29,149.31.21,202.06,2.53,48.71,2.12,75.22,10.19,92.83,17,23.37,9,40,19.81,57.57,37.29s28.4,34.07,37.52,57.45c6.89,17.57,15.07,44,17.37,92.76,2.51,52.73,3.08,68.54,3.32,202,.24,133.46-.23,149.31-2.54,202-2.13,48.75-10.21,75.23-17,92.89-9,23.35-19.85,40-37.31,57.56s-34.09,28.38-57.43,37.5c-17.6,6.87-44.07,15.07-92.76,17.39-52.73,2.48-68.53,3-202.05,3.29s-149.27-.25-202-2.53M706.3709,232.7669c.0553,33.137,26.963,59.9551,60.1,59.8998s59.9551-26.963,59.8998-60.1c-.0553-33.137-26.963-59.9551-60.1-59.8998-.0066,0-.0132,0-.0198,0-33.1293.0662-59.9353,26.9707-59.88,60.1M243.2708,500.4969c.28,141.8,115.44,256.49,257.21,256.22s256.54-115.42,256.27-257.22-115.46-256.52-257.25-256.24-256.5,115.46-256.23,257.24M333.3308,500.3169c-.1821-92.0491,74.2909-166.8173,166.34-166.9993,92.0491-.182,166.8173,74.2909,166.9993,166.34.1821,92.0489-74.2905,166.8169-166.3394,166.9993-92.0381.1935-166.8065-74.2613-166.9999-166.2993v-.0406"/>
                </svg>
              </a>
              {/* YouTube */}
              <a 
                href="https://youtube.com/@narashinken" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 flex items-center justify-center rounded-[20%] transition-opacity hover:opacity-80"
                aria-label="YouTube"
              >
                <svg width="100%" viewBox="0 0 192 192" xmlns="http://www.w3.org/2000/svg">
                  <path fill="#FF0000" d="M180.3223,53.3628c-2.024-7.622-7.987-13.624-15.561-15.661-13.724-3.702-68.761-3.702-68.761-3.702,0,0-55.037,0-68.762,3.702-7.573,2.037-13.537,8.039-15.561,15.661-3.677,13.814-3.677,42.637-3.677,42.637,0,0,0,28.822,3.677,42.638,2.024,7.621,7.988,13.623,15.561,15.661,13.725,3.701,68.762,3.701,68.762,3.701,0,0,55.037,0,68.761-3.701,7.574-2.038,13.537-8.04,15.561-15.661,3.678-13.816,3.678-42.638,3.678-42.638,0,0,0-28.823-3.678-42.637"/>
                  <polygon fill="#FFFFFF" points="78 122.17 124 96 78 69.83 78 122.17"/>
                </svg>
              </a>
              {/* Facebook */}
              <a 
                href="https://facebook.com/narashinken" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 flex items-center justify-center rounded-full transition-opacity hover:opacity-80"
                aria-label="Facebook"
              >
                <svg width="100%" height="100%" viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
                  <path fill="#1877F2" d="M500,250C500,111.9288,388.0712,0,250,0S0,111.9288,0,250c0,117.2446,80.7155,215.6222,189.6057,242.638v-166.2416h-51.5521v-76.3964h51.5521v-32.9188c0-85.0919,38.5087-124.5323,122.0479-124.5323,15.8382,0,43.1671,3.1055,54.347,6.2111v69.2537c-5.9005-.6211-16.1488-.9316-28.8816-.9316-40.9932,0-56.8315,15.5277-56.8315,55.8998v27.0182h81.659l-14.0289,76.3964h-67.6301v171.7726c123.7858-14.9512,219.7125-120.351,219.7125-248.169Z"/>
                  <path fill="#FFFFFF" d="M347.9175,326.3964l14.0289-76.3964h-81.659v-27.0182c0-40.3721,15.8383-55.8998,56.8315-55.8998,12.7328,0,22.9811.3105,28.8816.9316v-69.2537c-11.1799-3.1055-38.5088-6.2111-54.347-6.2111-83.5392,0-122.0479,39.4404-122.0479,124.5323v32.9188h-51.5521v76.3964h51.5521v166.2416c19.3425,4.7989,39.5678,7.362,60.3943,7.362,10.2532,0,20.3578-.6317,30.2875-1.831v-171.7726h67.6301Z"/>
                </svg>
              </a>
            </div>
            {/* コピーライト */}
            <p className="text-sm" style={{color: 'var(--color-text-secondary)'}}>
              © {currentYear} NaraShinkenDojo
            </p>
          </div>
        </div>
      </div>
      
      {/* グラデーションフッター */}
      <div 
        className="w-full h-20"
        style={{
          background: 'linear-gradient(var(--color-dojo-beige) 0%, var(--color-dojo-green-light) 60%, var(--color-dojo-green-dark) 100%)'
        }}
      />
    </footer>
  );
}

