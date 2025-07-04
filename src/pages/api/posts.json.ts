// src/pages/api/posts.json.ts
import type { APIRoute } from 'astro';
import directus from '../../lib/directus';
import { readItems } from '@directus/sdk';

export const GET: APIRoute = async ({ url }) => {
  const searchParams = new URL(url).searchParams;
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '6');
  
  // Hitung offset: lewati featured post (1) dan post di halaman sebelumnya
  const offset = 1 + (page - 1) * limit;

  try {
    const posts = await directus.request(readItems('posts', {
        sort: ['-date_published'],
        offset: offset,
        limit: limit,
        fields: ['slug', 'title', 'date_published', 'featured_image.id', 'category.name', 'category.slug']
    }));

    return new Response(JSON.stringify(posts), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch posts' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};