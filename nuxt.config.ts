import { fileURLToPath } from 'node:url';

export default defineNuxtConfig({
  modules: [
    '@element-plus/nuxt',
    '@pinia/nuxt',
    '@vee-validate/nuxt',
    '@morev/vue-transitions/nuxt',
    'nuxt-svgo',
    'nuxt-viewport',
    '@nuxt/eslint',
    'nuxt-swiper',
    '@vueuse/nuxt',
    '@vueuse/motion/nuxt',
    'nuxt-seo-utils',
    '@nuxtjs/seo',
    'vue-yandex-maps/nuxt',
  ],

  imports: {
    autoImport: true,
    dirs: ['stores', 'tools', 'adapters'],
    presets: [
      {
        from: 'gsap',
        imports: ['gsap'],
      },
    ],
  },

  devtools: {
    enabled: true,
  },

  app: {
    head: {
      link: [
        {
          rel: 'preload',
          href: '/loader.gif',
          as: 'fetch',
          crossorigin: '',
        },
      ],
    },
  },

  css: [
    '@/assets/styles/global.scss',
  ],

  site: {
    name: 'INDAPT',
    description: 'Разработка и сопровождение цифровых решений для крупного бизнеса',
  },

  runtimeConfig: {
    apiSecret: process.env.NUXT_API_SECRET || 'api_secret_token',
    yandexGeocoderApiKey:
      process.env.NUXT_YANDEX_GEOCODER_API_KEY
      || '9dbea615-6976-4c6a-b470-efe1cc435926',
    public: {
      apiBaseURL:
        process.env.NUXT_PUBLIC_API_BASE_URL
        || 'https://jsonplaceholder.typicode.com',
    },
  },

  srcDir: 'src/',

  alias: {
    '@icons': fileURLToPath(new URL('./src/assets/icons', import.meta.url)),
    '@styles': fileURLToPath(new URL('./src/assets/styles', import.meta.url)),

    '@l-expertise': fileURLToPath(new URL('./layers/expertise', import.meta.url)),
    '@l-forms': fileURLToPath(new URL('./layers/forms', import.meta.url)),
    '@l-locales': fileURLToPath(new URL('./layers/locales', import.meta.url)),
    '@l-work': fileURLToPath(new URL('./layers/work', import.meta.url)),
    '@l-about': fileURLToPath(new URL('./layers/about', import.meta.url)),
    '@l-services': fileURLToPath(new URL('./layers/services', import.meta.url)),
  },

  experimental: {
    entryImportMap: false,
  },

  compatibilityDate: '2024-09-03',

  postcss: {
    plugins: {
      'postcss-pxtorem': {
        propList: [
          '*',
          '!border-left',
          '!border-right',
          '!border-top',
          '!border-bottom',
          '!border',
          '!outline',
        ],
      },
    },
  },

  telemetry: false,

  hooks: {
    'vite:extendConfig'(config, { isClient }) {
      if (!isClient) return;
      const appManifestStub = fileURLToPath(
        new URL('./node_modules/unenv/dist/runtime/mock/empty.mjs', import.meta.url),
      );
      config.resolve ??= {};
      const { alias } = config.resolve;
      if (Array.isArray(alias)) {
        alias.push({ find: '#app-manifest', replacement: appManifestStub });
      }
      else {
        config.resolve.alias = {
          ...(alias as Record<string, string> | undefined),
          '#app-manifest': appManifestStub,
        };
      }
    },
  },

  elementPlus: {
    icon: 'ElIcon',
    importStyle: 'scss',
    themes: [],
  },

  seo: {
    meta: {
      title: 'Разработка и сопровождение цифровых решений для крупного бизнеса',
      description: '',
      ogTitle: 'Разработка и сопровождение цифровых решений для крупного бизнеса',
      ogDescription: 'Разработка и сопровождение цифровых решений для крупного бизнеса',
      twitterTitle: 'Разработка и сопровождение цифровых решений для крупного бизнеса',
      twitterDescription: 'Разработка и сопровождение цифровых решений для крупного бизнеса',
      twitterCard: 'summary_large_image',
    },
    // ogImage: '/static/sharing.jpeg',
    // twitterImage: '/static/sharing.jpeg',
  },

  svgo: {
    componentPrefix: 'svgo',
  },

  viewport: {
    breakpoints: {
      mobile: 0,
      tablet: 576,
      desktop: 1024,
    },
  },

  vueTransitions: {
    defaultProps: {
      duration: 300,
      easing: 'cubic-bezier(0.12, 0.46, 0.47, 0.99)',
    },
  },

  yandexMaps: {
    apikey: '1d0e5f3a-d093-445c-a781-824c81f1552d',
  },
});
