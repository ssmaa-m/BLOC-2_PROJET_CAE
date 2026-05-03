import { Alert, Box, InputLabel, Stack, Tooltip } from '@mui/material';
import { TournamentFormData } from '../../../types';
import { DatePicker, DateTimePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { getDurationString } from '../../../utils/date';
import { NumericTextField } from './NumericTextField';
import { theme } from '../../../themes';
import { ArrowRight } from '@gravity-ui/icons';

interface DetailsTabProps {
  formData: TournamentFormData;
  onChange: (field: keyof TournamentFormData, value: number | string) => void;
  error?: string;
  isCreation?: boolean;
}

export const DetailsTab = ({
  formData,
  onChange,
  error,
  isCreation,
}: DetailsTabProps) => {
  /*
  const handleDateChange = (
    date: dayjs.Dayjs | null,
    field: keyof TournamentFormData,
  ) => {
    if (!date) return;

    let newStart = dayjs(formData.startDate);
    let newEnd = dayjs(formData.endDate);
    let newReg = dayjs(formData.registrationDeadline);

    if (field === 'startDate') {
      newStart = date;
      if (newStart.isBefore(newReg) || newStart.isSame(newReg, 'day')) {
        newReg = newStart.subtract(3, 'day');
      }
      if (newStart.isAfter(newEnd) || newStart.isSame(newEnd, 'day')) {
        newEnd = newStart.add(14, 'day');
      }
    } else if (field === 'endDate') {
      newEnd = date;
      if (newEnd.isBefore(newStart) || newEnd.isSame(newStart, 'day')) {
        newStart = newEnd.subtract(14, 'day');
        if (newStart.isBefore(newReg) || newStart.isSame(newReg, 'day')) {
          newReg = newStart.subtract(3, 'day');
        }
      }
    } else if (field === 'registrationDeadline') {
      newReg = date;
      if (newReg.isAfter(newStart) || newReg.isSame(newStart, 'day')) {
        newStart = newReg.add(3, 'day');
        if (newStart.isAfter(newEnd) || newStart.isSame(newEnd, 'day')) {
          newEnd = newStart.add(14, 'day');
        }
      }
    }

    onChange('startDate', newStart.format('YYYY-MM-DD'));
    onChange('endDate', newEnd.format('YYYY-MM-DD'));
    onChange('registrationDeadline', newReg.format('YYYY-MM-DDTHH:mm:ss'));
  };*/

  return (
    <Stack spacing="1rem">
      <Stack spacing="0.25rem">
        <InputLabel required={isCreation}>Date limite d'inscription</InputLabel>
        <DateTimePicker
          format="DD/MM/YYYY HH:mm"
          name="registrationDeadline"
          value={dayjs(formData.registrationDeadline)}
          // onChange ={(date)=> handleDateChange(date, 'registrationDeadline')}
          onChange={(date) =>
            onChange(
              'registrationDeadline',
              date ? date.format('YYYY-MM-DDTHH:mm:ss') : '',
            )
          }
          disablePast
          slotProps={{
            textField: {
              inputProps: {
                'data-testid': 'tournament-form-deadline', // THIS is the valid path for types
              },
            },
          }}
        />
      </Stack>

      <Stack spacing="0.25rem">
        <InputLabel required={isCreation}>Dates du tournoi</InputLabel>
        <Stack direction="row" spacing="0.75rem" alignItems="center">
          <DatePicker
            format="DD/MM/YYYY"
            name="startDate"
            value={dayjs(formData.startDate)}
            // onChange ={(date)=> handleDateChange(date, 'registrationDeadline')}
            onChange={(date) =>
              onChange('startDate', date ? date.format('YYYY-MM-DD') : '')
            }
            disablePast
            slotProps={{
              textField: {
                inputProps: { 'data-testid': 'tournament-form-start-date' },
              },
            }}
          />
          <Tooltip
            title={getDurationString({
              startDate: dayjs(formData.startDate),
              endDate: dayjs(formData.endDate),
            })}
            arrow
            placement="top"
          >
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
            value={dayjs(formData.endDate)}
            // onChange ={(date)=> handleDateChange(date, 'registrationDeadline')}
            onChange={(date) =>
              onChange('endDate', date ? date.format('YYYY-MM-DD') : '')
            }
            disablePast
            slotProps={{
              textField: {
                inputProps: { 'data-testid': 'tournament-form-end-date' },
              },
            }}
          />
        </Stack>
      </Stack>

      <Stack spacing="0.25rem">
        <InputLabel required={isCreation}>Capacité maximale</InputLabel>
        <NumericTextField
          data-testid="tournament-form-capacity"
          value={formData.capacity}
          onChange={(val) => onChange('capacity', val)}
          min={2}
          required
        />
      </Stack>
      {error && (
        <Alert severity="error" size="small">
          {error}
        </Alert>
      )}
    </Stack>
  );
};
