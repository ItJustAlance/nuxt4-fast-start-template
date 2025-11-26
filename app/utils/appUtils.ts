import dayjs from 'dayjs';
import DOMPurify from 'dompurify';

/**
 * Вспомогательные функции для приложения
 */
const appUtils = {
  /**
   * Запускается ли код сейчас на сервере (SSR), или у клиента в браузере
   */
  isRunOnServer: (): boolean => {
    // совместим с Nuxt 3 и другими фреймворками
    return typeof import.meta.server !== 'undefined' ? import.meta.server : import.meta.env.SSR;
  },

  /**
   * Форматирует ISO-строку в дату формата DD.MM.YYYY
   * @param isoString - Строка даты в ISO формате
   * @returns Отформатированная дата (30.12.2025)
   */
  formatDate: (isoString: string): string => {
    return dayjs(isoString).format('DD.MM.YYYY');
  },

  /**
   * Просто преобразует экранированный html в нормальный
   */
  decodeHtml: (html: string | undefined | null): string => {
    if (!html) {
      return '';
    }
    if (typeof document === 'undefined') {
      // на сервере - простая замена
      return html
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'");
    } else {
      // на клиенте - замена через браузер
      const txt = document.createElement('textarea');
      txt.innerHTML = html;
      return txt.value;
    }
  },

  /**
   * Преобразует экранированный html обратно в корректный код, который можно вставить на странице
   * Кроме того он дополнительно его защищает от вредных/пользовательских тегов, которые используются в xss
   * @param html - экранированный текс вида "ссылка: &lt;a href=xxx"
   * @returns текст вида "ссылка: <a href=xxx"
   */
  decodeAndSanitizeHtml: (html: string | undefined | null): string => {
    if (!html) {
      return '';
    }

    if (appUtils.isRunOnServer()) {
      // на сервере нет браузерного окружения, которое нужно для работы DOMPurify, можно пропустить
      return appUtils.decodeHtml(html) || '';
    } else {
      // в браузере у клиента - нужна полная защита
      return DOMPurify.sanitize(appUtils.decodeHtml(html));
    }
  },

  /**
   * Готовим список параметров к передаче в URL для GET запросов
   */
  prepareUrlQueryPath(params: []) {
    return Object.entries(params)
      .flatMap(([key, value]) => {
        if (Array.isArray(value)) {
          // Для массивов: `key[]=value1&key[]=value2` (без кодирования [])
          return value.map((v) => `${key}[]=${v}`);
        } else if (value !== undefined && value !== null) {
          // Для одиночных значений: `key=value` (кодируем только значение)
          return `${key}=${encodeURIComponent(value)}`;
        }
        return [];
      })
      .join('&');
  },

  /**
   * Форматирует число с правильным склонением слова
   * @param number - число
   * @param forms - массив из трех форм слова: 1 час, 2 часа, 5 часов
   * @returns строка по словом
   */
  formatNumberToWord: (number: number, wordForms: [string, string, string]): string => {
    const n = Math.abs(number) % 100;
    const n1 = n % 10;

    if (n > 10 && n < 20) {
      return wordForms[2];
    }
    if (n1 > 1 && n1 < 5) {
      return wordForms[1];
    }
    if (n1 === 1) {
      return wordForms[0];
    }
    return wordForms[2];
  },
};

export default appUtils;
