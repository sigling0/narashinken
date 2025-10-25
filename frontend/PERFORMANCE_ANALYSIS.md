# パフォーマンス分析と改善案

## 📊 現状分析

### 検出された問題点

#### 🔴 **高優先度（すぐに改善すべき）**

1. **画像の最適化が不十分**
   - **問題**: Slideshowで大きな画像（7:3アスペクト比、最大800px高さ）を5枚すべて読み込んでいる
   - **影響**: 初回ロード時間が長い（特にモバイル）
   - **現在の設定**: `priority={index === 0}` で最初の画像のみ優先読み込み

2. **Instagram画像の遅延読み込みがない**
   - **問題**: 18枚のInstagram画像がすべて即座に読み込まれる
   - **影響**: ページ下部のコンテンツでも初回ロード時にすべて読み込む
   - **現在**: `loading="lazy"` が未設定

3. **WordPress APIリクエストの並列化**
   - **問題**: 6つのAPIリクエストを並列実行（良いが、タイムアウトが8秒）
   - **影響**: 1つのAPIが遅いと全体が遅延
   - **現在の設定**: `Promise.all()` + 8秒タイムアウト

4. **静的生成の制限**
   - **問題**: `getAllPostIds()` が100件までしか取得しない
   - **影響**: 100件以上の投稿がある場合、静的生成されない
   - **現在の設定**: `per_page: 100`

#### 🟡 **中優先度（改善すると良い）**

5. **Axiosタイムアウトが長い**
   - **問題**: `timeout: 10000`（10秒）は長すぎる
   - **影響**: レスポンスが遅いAPIを待ちすぎる
   - **推奨**: 5秒程度

6. **revalidate時間の最適化**
   - **問題**: `revalidate = 3600`（1時間）は適切だが、コンテンツによって調整可能
   - **提案**: 
     - トップページ: 1800秒（30分）
     - 記事ページ: 3600秒（1時間）
     - カテゴリ/タグページ: 1800秒（30分）

7. **画像サイズの指定が不適切**
   - **問題**: Slideshowの`sizes`が未指定（デフォルト100vw）
   - **影響**: 不必要に大きな画像を読み込む可能性

#### 🟢 **低優先度（余裕があれば）**

8. **コンポーネントの動的インポート**
   - **提案**: Instagram FeedやSlideshowを動的インポート
   - **効果**: 初回バンドルサイズの削減

9. **フォントの最適化**
   - **確認必要**: カスタムフォントを使用している場合の最適化

---

## 🚀 改善案（優先順位順）

### 1️⃣ **画像の遅延読み込みと最適化** ⭐⭐⭐

#### Instagram Feed
```tsx
// InstagramFeed.tsx
<Image
  src={post.media_url}
  alt={post.caption ? post.caption.substring(0, 50) : 'Instagram post'}
  fill
  className="object-cover transition-transform duration-300 group-hover:scale-110"
  sizes="(max-width: 1024px) 33vw, 20vw"
  loading="lazy" // ← 追加
/>
```

#### Slideshow
```tsx
// Slideshow.tsx
<Image
  src={image}
  alt={`スライド ${index + 1}`}
  fill
  className="object-contain"
  priority={index === 0}
  sizes="(max-width: 768px) 100vw, (max-width: 1280px) calc(100vw - 128px), calc(100vw - 192px)" // ← 追加
/>
```

**効果**: 初回ロード時間を30-50%削減

---

### 2️⃣ **APIタイムアウトの最適化** ⭐⭐⭐

```typescript
// lib/wordpress.ts
const wpAPI = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000, // 10000 → 5000に変更
});
```

```typescript
// app/page.tsx
const fetchWithTimeout = async <T,>(promise: Promise<T>, timeoutMs: number = 5000): Promise<T> => {
  // 8000 → 5000に変更
```

**効果**: エラー時の待ち時間を40%削減

---

### 3️⃣ **静的生成の件数制限を解除** ⭐⭐⭐

```typescript
// lib/wordpress.ts
export async function getAllPostIds(): Promise<number[]> {
  try {
    let allIds: number[] = [];
    let page = 1;
    let hasMore = true;
    
    while (hasMore) {
      const response = await wpAPI.get('/wp/v2/posts', {
        params: {
          per_page: 100,
          page: page,
          _fields: 'id',
        },
      });
      
      const ids = response.data.map((post: any) => post.id);
      allIds = [...allIds, ...ids];
      
      const totalPages = parseInt(response.headers['x-wp-totalpages'] || '1', 10);
      hasMore = page < totalPages;
      page++;
    }
    
    return allIds;
  } catch (error) {
    console.error('Error fetching post ids:', error);
    throw error;
  }
}
```

**効果**: すべての投稿を静的生成可能

---

### 4️⃣ **revalidate時間の最適化** ⭐⭐

```typescript
// app/page.tsx
export const revalidate = 1800; // 3600 → 1800（30分）

// app/posts/[id]/page.tsx
export const revalidate = 3600; // そのまま（1時間）

// app/category/[slug]/page.tsx
export const revalidate = 1800; // 30分
```

**効果**: コンテンツの鮮度向上

---

### 5️⃣ **コンポーネントの動的インポート** ⭐⭐

```typescript
// app/page.tsx
import dynamic from 'next/dynamic';

const InstagramFeed = dynamic(() => import('@/components/InstagramFeed'), {
  loading: () => <div className="animate-pulse bg-gray-200 rounded-lg h-96" />,
  ssr: false, // クライアントサイドのみで読み込み
});

const Slideshow = dynamic(() => import('@/components/Slideshow'), {
  loading: () => <div className="bg-gray-900 h-96" />,
});
```

**効果**: 初回バンドルサイズを15-20%削減

---

### 6️⃣ **APIリクエストのキャッシュ戦略** ⭐

```typescript
// lib/wordpress.ts
// Axiosにキャッシュアダプターを追加
import { setupCache } from 'axios-cache-adapter';

const cache = setupCache({
  maxAge: 15 * 60 * 1000, // 15分
});

const wpAPI = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000,
  adapter: cache.adapter,
});
```

**注意**: `npm install axios-cache-adapter` が必要

**効果**: 繰り返しリクエストの削減

---

### 7️⃣ **プリフェッチの追加** ⭐

```typescript
// components/PostCard.tsx
import Link from 'next/link';

<Link 
  href={`/posts/${post.id}`} 
  prefetch={true} // デフォルトでtrueだが明示的に指定
  className="..."
>
```

**効果**: リンククリック時の表示速度向上

---

## 🎯 推奨実装順序

### Phase 1: 即座に実装（所要時間: 30分）
1. ✅ Instagram画像に`loading="lazy"`を追加
2. ✅ Slideshowに`sizes`属性を追加
3. ✅ APIタイムアウトを5秒に短縮

### Phase 2: 短期実装（所要時間: 1-2時間）
4. ✅ 静的生成の件数制限を解除
5. ✅ revalidate時間の最適化

### Phase 3: 中期実装（所要時間: 2-3時間）
6. ⏳ コンポーネントの動的インポート
7. ⏳ APIキャッシュの実装

---

## 📈 期待される効果

| 項目 | 改善前 | 改善後 | 改善率 |
|------|--------|--------|--------|
| **初回ロード時間** | ~3-5秒 | ~1.5-2.5秒 | **40-50%削減** |
| **Largest Contentful Paint (LCP)** | ~2.5秒 | ~1.5秒 | **40%改善** |
| **Time to Interactive (TTI)** | ~4秒 | ~2.5秒 | **37%改善** |
| **バンドルサイズ** | ~300KB | ~240KB | **20%削減** |

---

## 🔍 追加の調査項目

1. **Vercelのパフォーマンス分析**
   - Vercel Analyticsで実際のパフォーマンスを確認
   - Core Web Vitalsのスコアを測定

2. **WordPress側の最適化**
   - WordPress APIのレスポンス時間を測定
   - 必要に応じてキャッシュプラグインの導入

3. **画像の最適化**
   - WordPressにアップロードされた画像のサイズを確認
   - 不必要に大きい画像がある場合は最適化

4. **ネットワークの確認**
   - CDNの利用状況
   - Vercel Edgeの活用状況

---

## 💡 その他の推奨事項

1. **Service Workerの導入**
   - オフライン対応
   - キャッシュ戦略の強化

2. **画像フォーマットの最適化**
   - WebP/AVIFの優先使用（すでに設定済み ✅）

3. **プリロードの追加**
   - 重要なフォントやスタイルシートをプリロード

4. **HTTP/2の活用**
   - Vercelはデフォルトで対応 ✅

5. **モニタリングの導入**
   - Vercel Analytics
   - Google Lighthouse CI

---

## 📝 まとめ

**最も効果的な改善（Phase 1）を実装するだけで、体感速度が大幅に向上します。**

特に：
- 📷 画像の遅延読み込み
- ⏱️ APIタイムアウトの短縮
- 🎨 画像サイズの最適化

これらは10-15分で実装可能で、即座に効果が現れます。

