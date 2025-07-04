// src/lib/directus.js

// Kita impor semua yang dibutuhkan di sini, sekali saja.
import { createDirectus, rest } from '@directus/sdk';

// Kita buat koneksi client di sini, sekali saja.
const directus = createDirectus('https://directus-backend-production-bf8e.up.railway.app').with(rest());

// Kita ekspor client tersebut agar bisa digunakan oleh file lain.
export default directus;