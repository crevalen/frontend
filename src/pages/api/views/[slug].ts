// Lokasi: src/pages/api/views/[slug].ts
export const prerender = false;
import type { APIContext } from 'astro';
import { 
  createDirectus, 
  rest, 
  staticToken, 
  readItems,
  updateItem
} from '@directus/sdk';

// Client PUBLIK: Untuk membaca data, tidak perlu token.
const directus_public = createDirectus(import.meta.env.PUBLIC_DIRECTUS_URL).with(rest());

// Client API_BOT: Khusus untuk mengubah data, menggunakan token rahasia.
const directus_api_bot = createDirectus(import.meta.env.PUBLIC_DIRECTUS_URL)
  .with(rest())
  .with(staticToken(import.meta.env.DIRECTUS_STATIC_TOKEN));

export async function POST({ params }: APIContext): Promise<Response> {
  const { slug } = params;

  if (!slug) {
    return new Response(JSON.stringify({ message: 'Slug tidak ditemukan.' }), { status: 400 });
  }

  try {
    // === TAHAP 1: MEMBACA dengan client PUBLIK ===
    // Membaca field "view_count"
    const postData = await directus_public.request(
      readItems('posts', {
        filter: { slug: { _eq: slug } },
        fields: ['id', 'view_count'], // <-- MENGGUNAKAN "view_count"
        limit: 1,
      })
    );

    const post = postData?.[0];

    if (!post) {
      return new Response(JSON.stringify({ message: 'Post tidak ditemukan.' }), { status: 404 });
    }

    // Kalkulasi jumlah view baru
    const newViews = (post.view_count || 0) + 1; // <-- MENGGUNAKAN "view_count"

    // === TAHAP 2: MENGUBAH dengan client API_BOT yang aman ===
    // Mengubah field "view_count"
    await directus_api_bot.request(
      updateItem('posts', post.id, {
        view_count: newViews, // <-- MENGGUNAKAN "view_count"
      })
    );

    // Berhasil!
    return new Response(JSON.stringify({ view_count: newViews }), { status: 200 });

  } catch (error) {
    console.error('Error pada API view count:', error);
    return new Response(JSON.stringify({ message: 'Terjadi kesalahan pada server.' }), { status: 500 });
  }
}