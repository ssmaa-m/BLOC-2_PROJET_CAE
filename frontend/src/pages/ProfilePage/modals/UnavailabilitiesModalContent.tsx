import { Box, Stack, Tooltip } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { checkOverlap, getDurationString } from '../../../utils/date';
import { useModalController } from '../../../hooks/useModalController';
import { ArrowRight } from '@gravity-ui/icons';
import { theme } from '../../../themes';

interface UnavailabilitiesModalContentProps {
  unavailabilities: { id: number; startDate: string; endDate: string }[] | null;
  onSelect: (
    dates: {
      tempId: number;
      startDate: string;
      endDate: string;
    } | null,
  ) => void;
}

export const UnavailabilitiesModalContent = ({
  unavailabilities,
  onSelect,
}: UnavailabilitiesModalContentProps) => {
  const [dates, setDates] = useState({
    startDate: dayjs(Date.now()),
    endDate: dayjs(Date.now()).add(7, 'day'),
  });

  const { setError } = useModalController();

  useEffect(() => {
    let error = checkOverlap(dates.startDate, dates.endDate, unavailabilities);

    if (!dates.startDate.isValid() || !dates.endDate.isValid())
      error = 'Les dates doivent être valides.';

    if (dates.startDate.isBefore(dayjs(Date.now()).startOf('day')))
      error = 'La date de début doit être dans le futur.';

    setError(error);

    if (error) {
      onSelect(null);
      return;
    }

    onSelect({
      tempId: -Date.now(),
      startDate: dates.startDate.toISOString(),
      endDate: dates.endDate.toISOString(),
    });
  }, [dates, unavailabilities, setError, onSelect]);

  const handleDateChange = (
    date: dayjs.Dayjs | null,
    field: 'startDate' | 'endDate',
  ) => {
    if (!date) return;

    setDates((prevDates) => {
      const newDates = { ...prevDates, [field]: date };

      if (field === 'startDate' && date.isAfter(prevDates.endDate))
        newDates.endDate = date.add(7, 'day');
      else if (field === 'endDate' && date.isBefore(prevDates.startDate))
        newDates.startDate = date.subtract(7, 'day');

      if (
        field === 'startDate' &&
        newDates.startDate.isSame(newDates.endDate, 'day')
      )
        newDates.endDate = newDates.startDate.add(7, 'day');

      if (
        field === 'endDate' &&
        newDates.endDate.isSame(newDates.startDate, 'day')
      )
        newDates.startDate = newDates.endDate.subtract(7, 'day');

      return newDates;
    });
  };

  return (
    <Stack
      spacing="1rem"
      direction="row"
      alignItems="center"
      justifyContent="center"
    >
      <DatePicker
        autoFocus
        format="DD/MM/YYYY"
        name="startDate"
        value={dates.startDate}
        onChange={(date) => handleDateChange(date, 'startDate')}
        disablePast
        slotProps={{
          textField: {
            inputProps: {
              'data-testid': 'unavailability-start-date',
              placeholder: 'DD/MM/YYYY',
            },
          },
        }}
      />
      <Tooltip title={getDurationString(dates)} arrow placement="top">
        <Box>
          <ArrowRight
            style={{
              color: theme.palette.text.secondary,
              cursor: 'help',
              height: '1rem',
              width: '1rem',
            }}
          />
        </Box>
      </Tooltip>
      <DatePicker
        format="DD/MM/YYYY"
        name="endDate"
        value={dates.endDate}
        onChange={(date) => handleDateChange(date, 'endDate')}
        disablePast
        slotProps={{
          textField: {
            inputProps: {
              'data-testid': 'unavailability-end-date',
              placeholder: 'DD/MM/YYYY',
            },
          },
        }}
      />
    </Stack>
  );
};
