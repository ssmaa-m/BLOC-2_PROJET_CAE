import dayjs from 'dayjs';

/**
 * Formats a date into a relative time string.
 * Examples:
 * - "il y a 5 minutes"
 * - "il y a 2 heures"
 * - "il y a 3 jours"
 * - "il y a 1 semaine et 2 jours"
 *
 * @param {Date | string | number} date The date to format
 * @return {string} A formatted relative time string
 */
export const formatRelativeTime = (date: Date | string | number): string => {
  const now = dayjs();
  const target = dayjs(date);

  const diffInMinutes = now.diff(target, 'minute');
  if (diffInMinutes < 1) return "À l'instant";
  if (diffInMinutes < 60)
    return `Il y a ${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''}`;

  const diffInHours = now.diff(target, 'hour');
  if (diffInHours < 24)
    return `Il y a ${diffInHours} heure${diffInHours > 1 ? 's' : ''}`;

  const diffInDays = now.diff(target, 'day');
  if (diffInDays < 7)
    return `Il y a ${diffInDays} jour${diffInDays > 1 ? 's' : ''}`;

  const weeks = Math.floor(diffInDays / 7);
  const remainingDays = diffInDays % 7;

  let result = `Il y a ${weeks} semaine${weeks > 1 ? 's' : ''}`;
  if (remainingDays > 0) {
    result += ` et ${remainingDays} jour${remainingDays > 1 ? 's' : ''}`;
  }

  return result;
};

/**
 * Formats a date into a readable string like "25 oct. 2026".
 *
 * @param {Date | string | number} date The date to format
 * @param {boolean} withYear Whether to include the year
 * @return {string} A formatted date string
 */
export const formatDate = (
  date: Date | string | number,
  withYear: boolean = true,
): string | null => {
  if (!date) return null;
  return dayjs(date).format(withYear ? 'D MMM YYYY' : 'D MMM');
};

/**
 * Returns a string representing the duration between two dates.
 *
 * @param {Object} dates An object containing the start and end dates.
 * @return {string} A string representing the duration between the start and end dates.
 */
export const getDurationString = (dates: {
  startDate: dayjs.Dayjs;
  endDate: dayjs.Dayjs;
}): string => {
  const diffInDays = dates.endDate.diff(dates.startDate, 'day');
  if (diffInDays < 0) return '';
  const weeks = Math.floor(diffInDays / 7);
  const days = diffInDays % 7;

  const parts = [];
  if (weeks > 0) parts.push(`${weeks} semaine${weeks > 1 ? 's' : ''}`);
  if (days > 0) parts.push(`${days} jour${days > 1 ? 's' : ''}`);

  return parts.length > 0 ? parts.join(', ') : '0 jours';
};

/**
 * Checks if the given dates overlap with any existing unavailability.
 *
 * @param {Object} start The start date.
 * @param {Object} end The end date.
 * @param {Array} unavailabilities An array of existing unavailabilities.
 * @return {string | null} A string representing the duration between the start and end dates.
 */
export const checkOverlap = (
  start: dayjs.Dayjs,
  end: dayjs.Dayjs,
  unavailabilities: { id: number; startDate: string; endDate: string }[] | null,
): string | null => {
  const hasOverlap = (unavailabilities ?? []).some((u) => {
    const existingStart = dayjs(u.startDate);
    const existingEnd = dayjs(u.endDate);
    return start.isBefore(existingEnd) && end.isAfter(existingStart);
  });
  return hasOverlap ? 'Ces dates chevauchent une indisponibilité.' : null;
};
