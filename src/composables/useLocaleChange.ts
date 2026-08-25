type AppLocale = 'ru' | 'en';

const LOCALE_COOKIE_KEY = 'i18n_redirected';

export function useLocaleChange() {
  const { locale } = useI18n();
  const localeCookie = useCookie<string>(LOCALE_COOKIE_KEY);

  const changeLocale = (newLocale: AppLocale) => {
    if (newLocale === locale.value) return;
    if (!import.meta.client) return;

    localeCookie.value = newLocale;
    window.location.reload();
  };

  return { changeLocale };
}
