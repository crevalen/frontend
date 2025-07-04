// src/types/index.ts

// Cetak biru untuk satu Tag
export interface Tag {
  id: number;
  name: string;
  slug: string;
}

// Cetak biru untuk satu Kategori
export interface Category {
  id: number;
  name: string;
  slug: string;
}

// Cetak biru untuk Gambar Utama
export interface FeaturedImage {
  id: string;
  title: string;
  width?: number;  // Tambahkan width (opsional)
  height?: number;
  filename_disk: string;
}

// Cetak biru untuk Penulis
export interface Author {
  name: string;
  avatar: string; // Ini adalah ID dari file gambar avatar

}

export interface Comment {
  id: number;
  author_name: string;
  content: string;
  date_created: string;
  author_website?: string;
  
  // TAMBAHAN BARU: Properti untuk sistem balasan
  parent?: { id: number } | null; // Parent bisa ada (objek dengan id) atau tidak (null)
  replies?: Comment[];             // Setiap komentar bisa memiliki array balasan
}


// Cetak biru utama untuk satu Artikel Post
export interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  date_published: string;
  date_updated: string;
  reading_time: number;
  featured_image: FeaturedImage;
  category: Category;
  author: Author;
  tags: {
   tags_id: Tag; }[];
  comments: Comment[]; 
  seo_meta?: string;
  excerpt?: string;
  // Gunakan tipe Comment yang baru
   // Ini adalah sebuah array (daftar) dari Tag
}

export interface File {
    id: string;
    width?: number;  // Tambahkan width (opsional)
    height?: number; // Tambahkan height (opsional)
}
