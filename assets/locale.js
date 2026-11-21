(() => {
  'use strict';

  const STORAGE_KEY = 'huimao.locale';
  const LOCALES = ['zh-cn', 'zh-hk', 'zh-tw', 'zh-mo', 'en-us', 'ru-ru', 'fr-fr', 'es-es', 'pt-pt'];

  function detectedLocale() {
    const languages = (navigator.languages && navigator.languages.length)
      ? navigator.languages
      : [navigator.language || ''];
    for (const value of languages) {
      const language = String(value).toLowerCase().replace(/_/g, '-');
      if (language.startsWith('zh')) {
        const parts = language.split('-');
        if (parts.includes('hk')) return 'zh-hk';
        if (parts.includes('tw')) return 'zh-tw';
        if (parts.includes('mo')) return 'zh-mo';
        return 'zh-cn';
      }
      if (language.startsWith('en')) return 'en-us';
      if (language.startsWith('ru')) return 'ru-ru';
      if (language.startsWith('fr')) return 'fr-fr';
      if (language.startsWith('es')) return 'es-es';
      if (language.startsWith('pt')) return 'pt-pt';
    }
    return 'zh-cn';
  }

  function preference() {
    try {
      const value = localStorage.getItem(STORAGE_KEY);
      return LOCALES.includes(value) ? value : null;
    } catch (_) {
      return null;
    }
  }

  function save(value) {
    try {
      if (value === 'auto') localStorage.removeItem(STORAGE_KEY);
      else localStorage.setItem(STORAGE_KEY, value);
    } catch (_) {}
  }

  function currentRoute() {
    const parts = location.pathname.split('/');
    const index = parts.findIndex(part => LOCALES.includes(part.toLowerCase()));
    return index < 0 ? null : { parts, index, locale: parts[index].toLowerCase() };
  }

  document.querySelectorAll('[data-locale-select]').forEach(select => {
    const route = currentRoute();
    if (!route) return;
    select.value = route.locale;
    select.addEventListener('change', () => {
      const requested = select.value;
      const target = requested === 'auto' ? detectedLocale() : requested;
      if (!LOCALES.includes(target)) return;
      save(requested);
      route.parts[route.index] = target;
      const destination = route.parts.join('/') + location.search + location.hash;
      if (destination !== location.pathname + location.search + location.hash) {
        location.assign(destination);
      }
    });
  });

  window.HuimaoLocale = { detectedLocale, preference };
})();
