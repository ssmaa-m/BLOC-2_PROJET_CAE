import { Stack, Typography } from '@mui/material';
import { MatchDayGroup } from './MatchDayGroup';
import { DayGroup } from '../utils/matchUtils';

interface MatchYearGroupProps {
  year: string;
  daysData: DayGroup[];
  yearTop?: string;
  refetch: () => void;
}

export const MatchYearGroup = ({
  year,
  daysData,
  yearTop = '0.5rem',
  refetch,
}: MatchYearGroupProps) => {
  return (
    <Stack spacing="1rem">
      <Stack
        position="sticky"
        top={yearTop}
        zIndex={1}
        width="fit-content"
        borderRadius="0.75rem"
        padding=" 0.5rem 1rem"
        ml="0.75rem !important"
        sx={{
          background: (theme) => theme.palette.background.s0,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
        }}
      >
        <Typography variant="h3">{year}</Typography>
      </Stack>
      {daysData.map((dayData) => (
        <MatchDayGroup
          key={dayData.dateKey}
          day={dayData.day}
          matches={dayData.matches}
          refetch={refetch}
        />
      ))}
    </Stack>
  );
};
