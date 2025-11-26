export default defineNuxtPlugin((nuxtApp) => {
  const runtime = useRuntimeConfig();
  const YM_ID = Number(runtime.public.ymId ?? 0);
  const ENABLE = Boolean(runtime.public.enableYandexMetrika ?? false);

  if (!ENABLE || !YM_ID) return;

  const win = window as any;

  // Создаём очередь ym (stub), если её ещё нет — это позволяет "закидывать" вызовы до загрузки скрипта
  if (!win.ym || typeof win.ym !== 'function') {
    win.ym = function () {
      (win.ym.a = win.ym.a || []).push(arguments);
    };
    win.ym.l = 1 * new Date();
  }

  const SCRIPT_ID = 'yandex-metrika-tag';
  if (!document.getElementById(SCRIPT_ID)) {
    const s = document.createElement('script');
    s.id = SCRIPT_ID;
    s.async = true;

    s.src = `https://mc.yandex.ru/metrika/tag.js?id=${YM_ID}`;

    s.onload = () => {
      try {
        win.ym(YM_ID, 'init', {
          clickmap: true,
          trackLinks: true,
          accurateTrackBounce: true,
          webvisor: true,
          ecommerce: 'dataLayer',
        });
        // отправляем хит
        try {
          console.warn('YM init');
          win.ym(YM_ID, 'hit', window.location.pathname + window.location.search);
        } catch (e) {}
      } catch (e) {
        // console.warn('YM init failed', e);
      }
    };

    s.onerror = () => {
      console.warn('Failed to load Yandex.Metrika tag.js');
    };

    document.head.appendChild(s);

    const noscriptId = 'yandex-metrika-noscript';
    if (!document.getElementById(noscriptId)) {
      const ns = document.createElement('noscript');
      ns.id = noscriptId;
      ns.innerHTML = `<div><img src="https://mc.yandex.ru/watch/${YM_ID}" style="position:absolute; left:-9999px;" alt="" /></div>`;
      document.body.appendChild(ns);
    }
  }

  // Отслеживание SPA навигации. Даже если ym ещё не загрузился — вызовы будут поставлены в очередь.
  nuxtApp.hook('page:finish', () => {
    try {
      win.ym(YM_ID, 'hit', window.location.pathname + window.location.search);
    } catch (e) {}
  });
});
