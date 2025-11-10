import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'http://localhost:8888/wp-json';

// Axiosインスタンスの作成
const wpAPI = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000, // 5秒タイムアウト
});

const shouldUseBuildCache = process.env.NEXT_PHASE === 'phase-production-build';

type CacheKey = string;
const requestCache = new Map<CacheKey, Promise<AxiosResponse<any>>>();

function createCacheKey(path: string, config?: AxiosRequestConfig) {
  const { params, headers, ...rest } = config || {};

  return [
    path,
    JSON.stringify(params ?? {}),
    JSON.stringify(headers ?? {}),
    JSON.stringify(rest ?? {}),
  ].join('::');
}

async function cachedGet<T = any>(
  path: string,
  config?: AxiosRequestConfig
): Promise<AxiosResponse<T>> {
  if (!shouldUseBuildCache) {
    return wpAPI.get<T>(path, config);
  }

  const cacheKey = createCacheKey(path, config);

  const fetchResponse = () =>
    wpAPI.get<T>(path, config).catch((error) => {
      requestCache.delete(cacheKey);
      throw error;
    });

  if (!requestCache.has(cacheKey)) {
    requestCache.set(cacheKey, fetchResponse());
  }

  return requestCache.get(cacheKey)! as Promise<AxiosResponse<T>>;
}

// 型定義
export interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  date: string;
  modified: string;
  author: string;
  categories: Category[];
  tags: Tag[];
  featured_image: FeaturedImage | null;
  link: string;
}

export interface Category {
  term_id: number;
  name: string;
  slug: string;
  description: string;
}

export interface Tag {
  term_id: number;
  name: string;
  slug: string;
}

export interface FeaturedImage {
  url: string;
  alt: string;
  sizes: {
    thumbnail: string;
    medium: string;
    large: string;
    full: string;
  };
}

export interface Page {
  id: number;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  slug: string;
  date: string;
  modified: string;
  featured_media: number;
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string;
      alt_text: string;
    }>;
  };
}

export interface MenuItem {
  id: number;
  title: string;
  url: string;
  target: string;
  classes: string;
  parent: string;
}

export interface SiteInfo {
  name: string;
  description: string;
  url: string;
  language: string;
  charset: string;
}

export interface InstagramPost {
  id: string;
  media_url: string;
  permalink: string;
  caption: string;
  media_type: string;
  timestamp: string;
  username: string;
}

export interface InstagramFeed {
  count: number;
  posts: InstagramPost[];
  message?: string;
  username?: string;
  profile_picture_url?: string;
}

// サイト情報の取得
export async function getSiteInfo(): Promise<SiteInfo> {
  try {
    const response = await cachedGet<SiteInfo>('/headless/v1/site-info');
    return response.data;
  } catch (error) {
    console.error('Error fetching site info:', error);
    throw error;
  }
}

// 最新投稿の取得
export async function getRecentPosts(perPage: number = 10): Promise<Post[]> {
  try {
    const response = await cachedGet<Post[]>('/headless/v1/recent-posts', {
      params: { per_page: perPage },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching recent posts:', error);
    throw error;
  }
}

// すべての投稿を取得（ページネーション対応、キーワード検索対応）
export async function getPosts(page: number = 1, perPage: number = 10, search?: string): Promise<{
  posts: any[];
  totalPages: number;
  total: number;
}> {
  try {
    const params: any = {
      page,
      per_page: perPage,
      _embed: true,
    };
    
    // キーワード検索が指定されている場合
    if (search && search.trim()) {
      params.search = search.trim();
    }
    
    const response = await cachedGet('/wp/v2/posts', {
      params,
    });
    
    return {
      posts: response.data,
      totalPages: parseInt(response.headers['x-wp-totalpages'] || '1', 10),
      total: parseInt(response.headers['x-wp-total'] || '0', 10),
    };
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
}

// スラッグで投稿を取得
export async function getPostBySlug(slug: string): Promise<any> {
  try {
    // スラッグがURLエンコードされている場合はデコード
    const decodedSlug = decodeURIComponent(slug);
    
    const response = await cachedGet('/wp/v2/posts', {
      params: {
        slug: decodedSlug,
        _embed: true,
      },
    });
    
    if (response.data.length === 0) {
      return null;
    }
    
    return response.data[0];
  } catch (error) {
    console.error('Error fetching post by slug:', error);
    throw error;
  }
}

// IDで投稿を取得
export async function getPostById(id: number): Promise<any> {
  try {
    const response = await cachedGet(`/wp/v2/posts/${id}`, {
      params: {
        _embed: true,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching post by ID:', error);
    throw error;
  }
}

// カテゴリー別投稿の取得（カスタムエンドポイント）
export async function getPostsByCategory(slug: string): Promise<Post[]> {
  try {
    const response = await cachedGet(`/headless/v1/posts-by-category/${slug}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching posts by category:', error);
    throw error;
  }
}

// カテゴリー別投稿の取得（標準API、件数指定可能）
export async function getPostsByCategorySlug(slug: string, perPage: number = 10): Promise<any[]> {
  try {
    // スラッグがURLエンコードされている場合はデコード
    const decodedSlug = decodeURIComponent(slug);
    
    // まずカテゴリーIDを取得
    const categoriesResponse = await cachedGet('/wp/v2/categories', {
      params: { slug: decodedSlug }
    });
    
    if (categoriesResponse.data.length === 0) {
      return [];
    }
    
    const categoryId = categoriesResponse.data[0].id;
    
    // カテゴリーIDで投稿を取得
    const postsResponse = await cachedGet('/wp/v2/posts', {
      params: {
        categories: categoryId,
        per_page: perPage,
        _embed: true,
      },
    });
    
    return postsResponse.data;
  } catch (error) {
    console.error('Error fetching posts by category slug:', error);
    return [];
  }
}

// タグ別投稿の取得
export async function getPostsByTagSlug(slug: string, perPage: number = 10): Promise<any[]> {
  try {
    // スラッグがURLエンコードされている場合はデコード
    const decodedSlug = decodeURIComponent(slug);
    
    // まずタグIDを取得
    const tagsResponse = await cachedGet('/wp/v2/tags', {
      params: { slug: decodedSlug }
    });
    
    if (tagsResponse.data.length === 0) {
      return [];
    }
    
    const tagId = tagsResponse.data[0].id;
    
    // タグIDで投稿を取得
    const postsResponse = await cachedGet('/wp/v2/posts', {
      params: {
        tags: tagId,
        per_page: perPage,
        _embed: true,
      },
    });
    
    return postsResponse.data;
  } catch (error) {
    console.error('Error fetching posts by tag slug:', error);
    return [];
  }
}

// タグ情報の取得
export async function getTagBySlug(slug: string): Promise<any> {
  try {
    // スラッグがURLエンコードされている場合はデコード
    const decodedSlug = decodeURIComponent(slug);
    
    const response = await cachedGet('/wp/v2/tags', {
      params: { slug: decodedSlug }
    });
    
    if (response.data.length === 0) {
      return null;
    }
    
    return response.data[0];
  } catch (error) {
    console.error('Error fetching tag by slug:', error);
    return null;
  }
}

// カテゴリー情報の取得
export async function getCategoryBySlug(slug: string): Promise<any> {
  try {
    // スラッグがURLエンコードされている場合はデコード
    const decodedSlug = decodeURIComponent(slug);
    
    const response = await cachedGet('/wp/v2/categories', {
      params: { slug: decodedSlug }
    });
    
    if (response.data.length === 0) {
      return null;
    }
    
    return response.data[0];
  } catch (error) {
    console.error('Error fetching category by slug:', error);
    return null;
  }
}

// タグの取得
export async function getTags(): Promise<any[]> {
  try {
    const response = await cachedGet('/wp/v2/tags', {
      params: {
        per_page: 100,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching tags:', error);
    return [];
  }
}

// すべてのカテゴリーを取得
export async function getCategories(): Promise<Category[]> {
  try {
    const response = await cachedGet('/wp/v2/categories', {
      params: {
        per_page: 100,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
}

// 固定ページの取得
export async function getPageBySlug(slug: string): Promise<Page | null> {
  try {
    // スラッグがURLエンコードされている場合はデコード
    const decodedSlug = decodeURIComponent(slug);
    
    const response = await cachedGet('/wp/v2/pages', {
      params: {
        slug: decodedSlug,
        _embed: true,
      },
    });
    
    if (response.data.length === 0) {
      return null;
    }
    
    return response.data[0];
  } catch (error) {
    console.error('Error fetching page by slug:', error);
    throw error;
  }
}

// すべての固定ページを取得
export async function getPages(): Promise<Page[]> {
  try {
    const response = await cachedGet('/wp/v2/pages', {
      params: {
        per_page: 100,
        _embed: true,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching pages:', error);
    throw error;
  }
}

// メニューの取得
export async function getMenuByLocation(location: string): Promise<{
  location: string;
  items: MenuItem[];
}> {
  try {
    const response = await cachedGet(`/headless/v1/menus/${location}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching menu:', error);
    throw error;
  }
}

// すべてのメニューを取得
export async function getAllMenus(): Promise<any[]> {
  try {
    const response = await cachedGet('/headless/v1/menus');
    return response.data;
  } catch (error) {
    console.error('Error fetching menus:', error);
    throw error;
  }
}

// 投稿のスラッグ一覧を取得（静的生成用）
export async function getAllPostSlugs(): Promise<string[]> {
  try {
    let allSlugs: string[] = [];
    let page = 1;
    let hasMore = true;
    
    while (hasMore) {
      const response = await cachedGet('/wp/v2/posts', {
        params: {
          per_page: 100,
          page: page,
          _fields: 'slug',
        },
      });
      
      const slugs = response.data.map((post: any) => post.slug);
      allSlugs = [...allSlugs, ...slugs];
      
      const totalPages = parseInt(response.headers['x-wp-totalpages'] || '1', 10);
      hasMore = page < totalPages;
      page++;
    }
    
    return allSlugs;
  } catch (error) {
    console.error('Error fetching post slugs:', error);
    throw error;
  }
}

// 投稿のID一覧を取得（静的生成用）
export async function getAllPostIds(): Promise<number[]> {
  try {
    let allIds: number[] = [];
    let page = 1;
    let hasMore = true;
    
    while (hasMore) {
      const response = await cachedGet('/wp/v2/posts', {
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

// 固定ページのスラッグ一覧を取得（静的生成用）
export async function getAllPageSlugs(): Promise<string[]> {
  try {
    let allSlugs: string[] = [];
    let page = 1;
    let hasMore = true;
    
    while (hasMore) {
      const response = await cachedGet('/wp/v2/pages', {
        params: {
          per_page: 100,
          page: page,
          _fields: 'slug',
        },
      });
      
      const slugs = response.data.map((pageData: any) => pageData.slug);
      allSlugs = [...allSlugs, ...slugs];
      
      const totalPages = parseInt(response.headers['x-wp-totalpages'] || '1', 10);
      hasMore = page < totalPages;
      page++;
    }
    
    return allSlugs;
  } catch (error) {
    console.error('Error fetching page slugs:', error);
    throw error;
  }
}

// 検索
export async function searchPosts(query: string, page: number = 1, perPage: number = 10): Promise<{
  posts: any[];
  totalPages: number;
  total: number;
}> {
  try {
    const response = await cachedGet('/wp/v2/posts', {
      params: {
        search: query,
        page,
        per_page: perPage,
        _embed: true,
      },
    });
    
    return {
      posts: response.data,
      totalPages: parseInt(response.headers['x-wp-totalpages'] || '1', 10),
      total: parseInt(response.headers['x-wp-total'] || '0', 10),
    };
  } catch (error) {
    console.error('Error searching posts:', error);
    throw error;
  }
}

// Instagram Feedの取得
export async function getInstagramFeed(limit: number = 6): Promise<InstagramFeed> {
  try {
    const response = await cachedGet('/headless/v1/instagram-feed', {
      params: { limit },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching Instagram feed:', error);
    // エラーの場合は空のフィードを返す
    return {
      count: 0,
      posts: [],
      message: 'Instagram feed is currently unavailable',
    };
  }
}

// Instagram Graph APIから投稿を取得
export async function getInstagramFromGraphAPI(limit: number = 18): Promise<InstagramFeed> {
  try {
    const response = await cachedGet('/headless/v1/instagram-graph', {
      params: { limit },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching Instagram from Graph API:', error);
    // エラーの場合は空のフィードを返す
    return {
      count: 0,
      posts: [],
      message: 'Instagram feed is currently unavailable',
    };
  }
}

// 子ページを取得（親ページのスラッグから）
export async function getChildPages(parentSlug: string) {
  try {
    // まず親ページを取得
    const parentResponse = await cachedGet('/wp/v2/pages', {
      params: {
        slug: parentSlug,
        _embed: true,
      },
    });

    if (!parentResponse.data || parentResponse.data.length === 0) {
      return [];
    }

    const parentId = parentResponse.data[0].id;

    // 親ページのIDで子ページを取得
    const childResponse = await cachedGet('/wp/v2/pages', {
      params: {
        parent: parentId,
        per_page: 100,
        orderby: 'slug',
        order: 'asc',
        _embed: true,
      },
    });

    return childResponse.data;
  } catch (error) {
    console.error('Error fetching child pages:', error);
    return [];
  }
}

// 特定の子ページを取得（親スラッグ + 子スラッグ）
export async function getChildPageBySlug(parentSlug: string, childSlug: string) {
  try {
    // まず親ページを取得
    const parentResponse = await cachedGet('/wp/v2/pages', {
      params: {
        slug: parentSlug,
        _embed: true,
      },
    });

    if (!parentResponse.data || parentResponse.data.length === 0) {
      return null;
    }

    const parentId = parentResponse.data[0].id;

    // 子ページを取得
    const childResponse = await cachedGet('/wp/v2/pages', {
      params: {
        parent: parentId,
        slug: childSlug,
        _embed: true,
      },
    });

    if (!childResponse.data || childResponse.data.length === 0) {
      return null;
    }

    return childResponse.data[0];
  } catch (error) {
    console.error(`Error fetching child page ${childSlug}:`, error);
    return null;
  }
}

export default wpAPI;

