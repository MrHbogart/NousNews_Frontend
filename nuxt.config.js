import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  compatibilityDate: '2025-11-26',
  ssr: true,
  devtools: { enabled: false },
  experimental: {
    appManifest: false,
  },
  css: ['~/assets/css/fonts.css', '~/assets/css/tailwind.css', '~/assets/css/app.css'],
  runtimeConfig: {
    apiBaseUrl: process.env.NUXT_API_BASE_URL || 'http://backend:8000/api',
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:8081/api',
      siteDomain: process.env.NUXT_PUBLIC_SITE_DOMAIN || 'http://localhost:3001',
    },
  },
  components: [{ path: '~/components', pathPrefix: false }],
  app: {
    head: {
      title: 'NousNews',
      htmlAttrs: { lang: 'en', dir: 'ltr' },
      meta: [
        {
          name: 'description',
          content: 'NousNews delivers curated, crawler-driven reporting from the sources that matter.',
        },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
      ],
      link: [],
    },
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
})
