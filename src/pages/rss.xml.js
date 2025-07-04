// src/pages/rss.xml.js
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { readItems } from '@directus/sdk';
import directus from '../lib/directus';

export async function GET(context) {
  const posts = await directus.request(readItems('posts', {
    sort: ['-date_published'],
    limit: -1,
  }));

  return rss({
    title: 'BlogKeren | Berita Teknologi dan Tutorial',
    description: 'Situs blog modern tentang teknologi dan pemrograman.',
    site: context.site,
    items: posts.map((post) => ({
      title: post.title,
      pubDate: post.date_published,
      description: post.excerpt || post.content.slice(0, 200),
      link: `/${post.category.slug}/${post.slug}/`,
    })),
    customData: `<language>id-id</language>`,
  });
}