import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

/**
 * Принимает дату в любом виде — Date, строку DD.MM.YYYY, YYYY-MM-DD и т.д.
 *
 * Возвращает строку в универсальном ISO формате → YYYY-MM-DD.
 * @param value
 */
export function normalizeDate(value: string | Date | null | undefined): string | null {
  if (!value) return null;

  if (value instanceof Date) {
    return dayjs(value).format('YYYY-MM-DD');
  }

  if (typeof value === 'string') {
    const parsed = dayjs(value, 'DD.MM.YYYY', true);
    if (parsed.isValid()) return parsed.format('YYYY-MM-DD');

    const fallbackParsed = dayjs(value);
    if (fallbackParsed.isValid()) return fallbackParsed.format('YYYY-MM-DD');
  }

  return null;
}

/** Преобразуем данные в формат ISO */
export function formattedDateToISO(value: string | Date | undefined): string | undefined {
  if (!value) return null;
  // Если уже объект Date — просто вернуть
  if (value instanceof Date) return value;
  // Если строка '1918-01-05' — преобразуем
  return new Date(value);
}

export function normalizeTime(value: string | Date | null | undefined): string | null {
  if (!value) return null;

  if (value instanceof Date) {
    return dayjs(value).format('HH:mm');
  }

  if (typeof value === 'string') {
    // Пробуем строгое парсинг формата HH:mm
    const parsed = dayjs(value, 'HH:mm', true);
    if (parsed.isValid()) return parsed.format('HH:mm');

    // Пробуем как обычную дату
    const fallbackParsed = dayjs(value);
    if (fallbackParsed.isValid()) return fallbackParsed.format('HH:mm');
  }

  return null;
}
