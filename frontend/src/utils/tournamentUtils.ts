import dayjs from 'dayjs';
import { TournamentDto } from '../types';

export interface MonthGroup {
  month: string;
  monthNumber: number;
  tournaments: TournamentDto[];
}

export interface YearGroup {
  year: string;
  yearNumber: number;
  monthsData: MonthGroup[];
}

export interface TournamentFilters {
  searchQuery: string;
  teams: number[];
  members: number[];
  timeFrame: 'past' | 'current' | 'future';
  statuses: string[];
  dates: { minDate: string | undefined; maxDate: string | undefined };
}

export const TIMEFRAME_STATUS_MAP: Record<string, string[]> = {
  past: ['DONE', 'CANCELLED'],
  current: ['IN_PROGRESS'],
  future: ['REGISTRATION_OPEN', 'REGISTRATION_CLOSED', 'PLANNED'],
};

export const STATUS_LABELS: Record<string, string> = {
  IN_PREPARATION: 'En préparation',
  REGISTRATION_OPEN: 'Inscriptions',
  REGISTRATION_CLOSED: 'Inscriptions closes',
  PLANNED: 'Planifié',
  IN_PROGRESS: 'En cours',
  DONE: 'Terminé',
  CANCELLED: 'Annulé',
};

/**
 * Gets the list of statuses for a given timeframe.
 *
 * @param {string} timeFrame The timeframe to get statuses for.
 * @param {boolean} isAdmin Whether the user is an admin.
 * @return {string[]} Returns the list of statuses for a given
 * timeframe, conditionally including 'IN_PREPARATION' if the user
 * is an admin for the 'future' timeframe.
 */
export const getStatusesForTimeframe = (
  timeFrame: string,
  isAdmin?: boolean,
): string[] => {
  const statuses = [...(TIMEFRAME_STATUS_MAP[timeFrame] || [])];
  if (timeFrame === 'future' && isAdmin) {
    statuses.push('IN_PREPARATION');
  }
  return statuses;
};

/**
 * Groups tournaments by year and month.
 * @param {TournamentDto[]} tournaments The tournaments to group.
 * @return {YearGroup[]} An array of year groups.
 */
export const groupTournamentsByYearAndMonth = (
  tournaments: TournamentDto[],
): YearGroup[] => {
  const grouped = tournaments.reduce(
    (acc, tournament) => {
      const d = dayjs(tournament.startDate);
      const year = d.year().toString();

      const monthKey = d.format('MMMM');
      const capitalizedMonthKey =
        monthKey.charAt(0).toUpperCase() + monthKey.slice(1);

      // if accumulator doesn't have the year, add it
      if (!acc[year]) acc[year] = {};

      // if accumulator[year] doesn't have the month, add it
      if (!acc[year][capitalizedMonthKey]) {
        acc[year][capitalizedMonthKey] = {
          monthNumber: d.month(),
          tournaments: [],
        };
      }

      acc[year][capitalizedMonthKey].tournaments.push(tournament);
      return acc;
    },
    {} as Record<
      string,
      Record<string, { monthNumber: number; tournaments: TournamentDto[] }>
    >,
  );

  /**
   * Converts the grouped object into an array of year groups.
   * @param {Object} grouped The grouped object.
   * @return {YearGroup[]} An array of year groups.
   */
  const yearGroups: YearGroup[] = Object.entries(grouped).map(
    ([year, monthsObj]) => {
      const monthsData = Object.entries(monthsObj).map(([month, data]) => {
        const sortedTournaments = [...data.tournaments].sort(
          (a, b) =>
            new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
        );

        return {
          month,
          monthNumber: data.monthNumber,
          tournaments: sortedTournaments,
        };
      });

      monthsData.sort((a, b) => b.monthNumber - a.monthNumber);

      return {
        year,
        yearNumber: parseInt(year),
        monthsData,
      };
    },
  );

  yearGroups.sort((a, b) => b.yearNumber - a.yearNumber);

  return yearGroups;
};

/**
 * Formats the start and end dates of a tournament.
 * @param {string} startDate The start date.
 * @param {string} endDate The end date.
 * @param {boolean} forceMonth Whether to force the month to be displayed.
 * @return {string} A string representing the formatted dates.
 */
export const getFormattedDate = (
  startDate: string,
  endDate: string,
  forceMonth: boolean = true,
): string => {
  const start = dayjs(startDate);
  const end = dayjs(endDate);

  const isSameMonth = start.isSame(end, 'month');

  // if the both dates are in the same month we display the Label of the day
  // else we display the day and the month
  const formatStr = forceMonth
    ? 'dddd D MMM'
    : isSameMonth
      ? 'ddd D'
      : 'ddd D MMM';

  return (
    formatAndCapitalize(start, formatStr) +
    ' - ' +
    formatAndCapitalize(end, formatStr)
  );
};

/**
 * Formats a date and capitalizes the first letter of the day label or the month label.
 * @param {dayjs.Dayjs} d The date to format.
 * @param {string} formatStr The format string.
 * @return {string} The formatted date.
 */
export const formatAndCapitalize = (
  d: dayjs.Dayjs,
  formatStr: string,
): string => {
  const formatted = d.format(formatStr);
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
};
