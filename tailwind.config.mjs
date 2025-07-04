// tailwind.config.mjs

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class', // Mengaktifkan dark mode berdasarkan class di <html>
  theme: {
    // Memperluas tema yang sudah ada
    extend: {
      // Mendefinisikan font agar bisa dipanggil dengan `font-sans` atau `font-serif`
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Source Serif 4', 'serif'],
      },
      // 👇 KUSTOMISASI TIPOGRAFI DIPINDAHKAN KE SINI
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            '--tw-prose-body': 'var(--color-text)',
            '--tw-prose-headings': 'var(--color-text)',
            '--tw-prose-lead': 'var(--color-secondary)',
            '--tw-prose-links': 'var(--color-primary)',
            '--tw-prose-bold': 'var(--color-text)',
            '--tw-prose-counters': 'var(--color-secondary)',
            '--tw-prose-bullets': 'var(--color-primary)',
            '--tw-prose-hr': 'var(--color-border)',
            '--tw-prose-quotes': 'var(--color-text)',
            '--tw-prose-quote-borders': 'var(--color-primary)',
            '--tw-prose-captions': 'var(--color-secondary)',
            '--tw-prose-code': 'var(--color-text)',
            '--tw-prose-pre-code': 'var(--color-card)',
            '--tw-prose-pre-bg': 'var(--color-text)',
            '--tw-prose-invert-body': 'var(--color-dark-text)',
            '--tw-prose-invert-headings': 'var(--color-dark-text)',
            '--tw-prose-invert-lead': 'var(--color-dark-secondary)',
            '--tw-prose-invert-links': 'var(--color-dark-primary)',
            '--tw-prose-invert-bold': 'var(--color-dark-text)',
            '--tw-prose-invert-counters': 'var(--color-dark-secondary)',
            '--tw-prose-invert-bullets': 'var(--color-dark-primary)',
            '--tw-prose-invert-hr': 'var(--color-dark-border)',
            '--tw-prose-invert-quotes': 'var(--color-dark-text)',
            '--tw-prose-invert-quote-borders': 'var(--color-dark-primary)',
            '--tw-prose-invert-captions': 'var(--color-dark-secondary)',
            '--tw-prose-invert-code': 'var(--color-dark-text)',
            '--tw-prose-invert-pre-code': 'var(--color-dark-card)',
            '--tw-prose-invert-pre-bg': 'var(--color-dark-text)',

            p: { lineHeight: '1.8' },
            'h2, h3, h4': { marginTop: '2.5em', marginBottom: '1em' },
            a: {
              textDecoration: 'underline',
              textDecorationColor: 'var(--color-primary)',
              textDecorationThickness: '2px',
              textUnderlineOffset: '2px',
              transition: 'color 0.2s ease',
              '&:hover': {
                color: 'var(--color-primary)',
                textDecorationColor: 'var(--color-primary)',
              },
            },
            blockquote: {
              paddingLeft: '1.25rem',
              borderLeftWidth: '4px',
              fontStyle: 'italic',
              fontWeight: '500',
            },
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'), // <-- Daftarkan plugin di sini
  ],
}