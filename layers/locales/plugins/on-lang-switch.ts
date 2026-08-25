import type { VueI18n } from 'vue-i18n';

export default defineNuxtPlugin((nuxtApp) => {
  const i18n = nuxtApp.$i18n as VueI18n;

  i18n.onBeforeLanguageSwitch = async (_, newLocale) => {
    const localeConfig = unref(i18n.locales).find(l => l.code === newLocale);

    useHead({
      htmlAttrs: {
        dir: localeConfig?.dir ?? 'ltr',
      },
    });
  };
});
