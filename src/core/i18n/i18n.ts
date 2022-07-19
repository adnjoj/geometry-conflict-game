import { register, init, getLocaleFromNavigator } from 'svelte-i18n';

register('ru', () => import('./ru.json'));

init({
  fallbackLocale: 'ru',
  initialLocale: getLocaleFromNavigator(),
});
