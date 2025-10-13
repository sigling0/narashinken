import { MetadataRoute } from 'next';
import { getAllPostSlugs, getAllPageSlugs } from '@/lib/wordpress';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://narashinken.com';
  
  // 静的ページ
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/posts`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
  ];

  // 投稿ページ
  let postPages: MetadataRoute.Sitemap = [];
  try {
    const postSlugs = await getAllPostSlugs();
    postPages = postSlugs.map((slug) => ({
      url: `${baseUrl}/posts/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));
  } catch (error) {
    console.error('Error generating post sitemap:', error);
  }

  // 固定ページ
  let pagePages: MetadataRoute.Sitemap = [];
  try {
    const pageSlugs = await getAllPageSlugs();
    pagePages = pageSlugs.map((slug) => ({
      url: `${baseUrl}/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }));
  } catch (error) {
    console.error('Error generating page sitemap:', error);
  }

  return [...staticPages, ...postPages, ...pagePages];
}

