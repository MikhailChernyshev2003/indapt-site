export default defineNuxtConfig({
  modules: ['@nuxtjs/i18n'],

  i18n: {
    locales: [
      { code: 'ru', name: 'Русский', language: 'ru-RU', dir: 'ltr', file: './ru.js' },
      { code: 'en', name: 'English', language: 'en-US', dir: 'ltr', file: './en.js' },
      // { code: 'fr', name: 'Français', language: 'fr-FR', dir: 'ltr' },
      // { code: 'ar', name: 'العربية', language: 'ar-AE', dir: 'rtl' },
      // { code: 'tr', name: 'Türkçe', language: 'tr-TR', dir: 'ltr' },
      // { code: 'cn', name: '中文', language: 'zh-CN', dir: 'ltr' },
    ],
    langDir: './lang',
    lazy: true,
    strategy: 'no_prefix',
    defaultLocale: 'ru',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root',
      fallbackLocale: 'en',
    },
    compilation: {
      strictMessage: false,
      escapeHtml: false,
    },
  },
});
