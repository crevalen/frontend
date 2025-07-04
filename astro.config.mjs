// astro.config.mjs
import { defineConfig } from 'astro/config';
import react from "@astrojs/react";
import icon from 'astro-icon';
import node from "@astrojs/node";
import tailwindcss from '@tailwindcss/vite';

import sitemap from "@astrojs/sitemap";

import partytown from "@astrojs/partytown";

import vercel from "@astrojs/vercel";

export default defineConfig({
  output: "server",
  adapter: vercel(),
   site: 'https://www.crevalen.xyz', 
  integrations: [react(), icon(), sitemap(), partytown()],
  vite: {
    plugins: [tailwindcss()]
  }
});