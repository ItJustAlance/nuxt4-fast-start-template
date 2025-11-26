import { resolve } from 'path';
// import Aura from '@primevue/themes/aura';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://v3.nuxtjs.org/api/configuration/nuxt.config
const ONE_HOUR = 60 * 60;
const ONE_DAY = ONE_HOUR * 24;
const ONE_WEEK = ONE_DAY * 7;
const isProduction = true;

export default defineNuxtConfig({
  devtools: {
    enabled: import.meta.env.VITE_ENV_PUBLIC_DEV_TOOLS === 'true',
  },
  ssr: true,
  runtimeConfig: {
    apiBaseURL: import.meta.env.VITE_ENV_API_URL,
    public: {
      siteName: 'Шаблон nuxt 4 by ItJustAlance',
      siteUrl: 'https://go-vue.ru',
      realApiUrl: 'fill in env like http://localhost:3000/api',
      fakeApiUrl: 'fill in env like https://testportal.corp-univer.ru/api/v1',
      proxyApiUrl: 'fill in env like http://localhost:3000/api/proxy',
      apiUrl: import.meta.env.VITE_ENV_API_URL,
      enableYandexMetrika: true, // включаем метрику
      ymId: 103718276,
    },
  },
  alias: {
    // "#server" будет указывать на папку server в корне проекта, нужен абсолютный путь
    // '~': resolve(__dirname, 'app'), // app/ — где у вас pages, stores, components
    // '@': resolve(__dirname, 'app'),
    '#server': resolve(__dirname, 'server'),
  },
  app: {
    head: {
      bodyAttrs: {
        class: `theme-red`,
      },
      link: [
        { rel: 'icon', type: 'image/png', sizes: '96x96', href: '/favicon-96x96.png' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/favicon-apple-touch-icon.png' },
        { rel: 'manifest', href: '/site.webmanifest' },
        { rel: 'mask-icon', href: '/favicon.svg', color: '#f6f6f6' },
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      ],
    },
  },

  modules: [
    '@nuxt/eslint',
    '@nuxt/icon',
    '@nuxt/test-utils',
    '@nuxt/hints',
    '@primevue/nuxt-module',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    'nuxt-icons', // https://nuxt.com/modules/icon
    '@nuxtjs/sitemap', // https://sitemap.nuxtjs.org
    '@nuxt/image',
  ],
  css: ['@/assets/sass/_app.scss'],
  primevue: {
    components: {
      include: [
        'Checkbox',
        'Radio',
        'InputOtp',
        'Toast',
        'Tabs',
        'TabList',
        'Tab',
        'TabPanel',
        'TabPanels',
        'SelectButton',
      ],
    },
    options: {
      theme: {
        // preset: Aura,
      },
      locale: {
        firstDayOfWeek: 1,
        dayNames: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
        dayNamesShort: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
        dayNamesMin: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
        monthNames: [
          'Январь',
          'Февраль',
          'Март',
          'Апрель',
          'Май',
          'Июнь',
          'Июль',
          'Август',
          'Сентябрь',
          'Октябрь',
          'Ноябрь',
          'Декабрь',
        ],
        monthNamesShort: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
        today: 'Сегодня',
        clear: 'Очистить',
      },
    },
  },
  image: {
    // Использовать встроенный провайдер IPX (не требует внешних сервисов)
    provider: 'ipx',
    // Качество по умолчанию
    quality: 85,
    // Форматы по умолчанию (автоматический выбор браузером)
    format: ['webp', 'avif'],
    // Размеры экранов для responsive images
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536,
    },
    /**  Домены для внешних изображений (если нужно)
     * Чтобы включить оптимизацию изображений на внешнем сайте, укажите, какие домены разрешено оптимизировать. Эта опция будет использоваться для определения необходимости оптимизации удалённого изображения. Это необходимо для предотвращения злоупотреблений внешними URL-адресами.
     */
    // domains: ['site.ru'],
    // Настройки для IPX провайдера
    ipx: {
      // Максимальный размер для обработки
      maxAge: 10512000, // 4 месяца кэширования
    },
  },
  vite: {
    // список разрешенных доменов (помимо localhost и локальных IP)
    // на проде запуск должен быть с --public, чтобы слушать на всех сетевых устройствах, например: nuxi dev --open --public
    // hmr - hot reloading для перезагрузки страниц при их изменении, отключается при деплое в докере
    server: {
      allowedHosts: [
        import.meta.env.VITE_ENV_PUBLIC_HOST ?? '',
        import.meta.env.VITE_ENV_PUBLIC_HOST_2 ?? '',
        import.meta.env.VITE_ENV_PUBLIC_HOST_3 ?? '',
      ],
      hmr: import.meta.env.VITE_ENV_PUBLIC_HMR !== 'false',
    },
    plugins: [tsconfigPaths()],
    build: {
      // sourcemap: 'inline'
    },
    css: {
      preprocessorOptions: {
        scss: {
        },
      },
      devSourcemap: true, // this one
    },
  },

  components: {
    dirs: ['~/components'],
  },

  content: {
    watch: false, // сайт из markdown-файлов, отключить мусор сокетами в логах
    highlight: {
      theme: 'one-dark-pro',
      preload: ['json', 'js', 'ts', 'html', 'css', 'vue'],
    },
  },

  build: {
    transpile: ['nuxt', 'primevue'],
  },

  /** SEO - работает только в статической генерации ака prerender */
  site: {
    url: 'https://new.dpomos.ru',
  },

  // schemaOrg: {
  //   defaults: false,
  // },
  routeRules: isProduction
    ? {
      '/sitemap.xml': { swr: 0, cache: false },
      /** страницы исключения из sitemap */
      '/test/**': { robots: false },

    }
    : undefined,

  // ОБЩАЯ карта сайта собирается:
  // - из всех известных страниц pages, routes, и т.п. (можно исключить через excludeAppSources)
  // - из собственных списков в sources
  // - без ссылок из черного списка в routeRules (robots: false), см. выше
  // - датой обновления считается датой сборки
  // - для отладки см. страницу /__sitemap__/debug.json
  sitemap: {
    hostname: 'https://go-vue.ru',
    gzip: true,
    excludeAppSources: undefined,
    sources: [],
    sitemapsPathPrefix: '',
    canonical: true,
    // Кастомный sitemap.xml переопределит автоматический index
    sitemaps: {
      'sitemap-main': {
        includeAppSources: true,
        defaults: {
          changefreq: 'daily',
          priority: 0.6,
        },
      },
      'sitemap-courses-list': {
        includeAppSources: false,
        sources: ['/__sitemap__/courses'],
        defaults: {
          changefreq: 'daily',
          priority: 0.7,
        },
      },
      // 'sitemap-courses-items': {
      //   includeAppSources: false,
      //   sources: ['/__sitemap__/course-items'],
      //   defaults: {
      //     changefreq: 'weekly',
      //     priority: 0.6,
      //   },
      // },
      // 'sitemap-faces-items': {
      //   includeAppSources: false,
      //   sources: ['/__sitemap__/faces'],
      //   defaults: {
      //     changefreq: 'weekly',
      //     priority: 0.5,
      //   },
      // },
    },

    sortEntries: false,
    cacheMaxAgeSeconds: ONE_HOUR,
    defaults: {
      changefreq: 'daily',
      lastmod: new Date().toISOString(),
      priority: 0.6,
    },

    // оформление для отладки
    xslColumns: [
      { label: 'URL', width: '60%' },
      { label: 'Last Modified', select: 'sitemap:lastmod', width: '20%' },
      { label: 'Change Frequency', select: 'sitemap:changefreq', width: '15%' },
      { label: 'Priority', select: 'sitemap:priority', width: '5%' },
    ],
  },

  nitro: {
    compressPublicAssets: true,
  },

  compatibilityDate: '2024-07-21',
});

