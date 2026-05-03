import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from '@mui/material';
import { Tabs } from '../../components/Tabs';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { BaseTab, DESCRIPTION_MAX, NAME_MAX } from './components/BaseTab';
import { DetailsTab } from './components/DetailsTab';
import { TournamentFormData } from '../../types';
import dayjs from 'dayjs';
import { useTournamentModal } from '../../hooks/useTournamentModal';
import { useTournaments } from '../../hooks/useTournaments';

const defaultReg = dayjs()
  .add(1, 'week')
  .set('hour', 20)
  .set('minute', 0)
  .set('second', 0);
const defaultStart = defaultReg.add(3, 'day');
const defaultEnd = defaultStart.add(14, 'day');

const initialFormData: TournamentFormData = {
  name: '',
  description: '',
  startDate: defaultStart.format('YYYY-MM-DD'),
  endDate: defaultEnd.format('YYYY-MM-DD'),
  registrationDeadline: defaultReg.format('YYYY-MM-DDTHH:mm:ss'),
  capacity: 16,
};

export const TournamentModal = () => {
  const { isOpen, closeModal, tournamentToEdit, onSuccess } =
    useTournamentModal();
  const [value, setValue] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState<number | string>('auto');
  const [error, setError] = useState<string | undefined>(undefined);

  const [formData, setFormData] = useState<TournamentFormData>(initialFormData);

  const { create, update, isCreating, isPublishing } = useTournaments({
    onSuccess: (t) => {
      onSuccess?.(t);
      closeModal();
    },
    onError: (err) => {
      setError(err.message);
    },
  });

  const isLoading = isCreating || isPublishing || !isOpen;

  const handleExited = () => {
    setFormData(initialFormData);
    setValue(0);
    setError(undefined);
  };

  useEffect(() => {
    if (isOpen && tournamentToEdit) {
      setFormData({
        name: tournamentToEdit.name,
        description: tournamentToEdit.description,
        startDate: tournamentToEdit.startDate,
        endDate: tournamentToEdit.endDate,
        registrationDeadline: tournamentToEdit.registrationDeadline,
        capacity: tournamentToEdit.capacity,
      });
    }
  }, [isOpen, tournamentToEdit]);

  useLayoutEffect(() => {
    if (contentRef.current) {
      const height = contentRef.current.scrollHeight;
      setContentHeight(height + 2);
    }
  }, [isOpen, value, error]);

  const getValidationErrors = (tab: number) => {
    const missing: string[] = [];
    if (tab === 0) {
      if (!formData.name.trim()) missing.push('nom du tournoi');
      else if (formData.name.length > NAME_MAX)
        return `Le nom du tournoi ne peut pas dépasser ${NAME_MAX} caractères.`;

      if (!formData.description.trim()) missing.push('description');
      else if (formData.description.length > DESCRIPTION_MAX)
        return `La description ne peut pas dépasser ${DESCRIPTION_MAX} caractères.`;
    } else {
      if (!formData.startDate) missing.push('date de début');
      if (!formData.endDate) missing.push('date de fin');
      if (!formData.registrationDeadline)
        missing.push("date limite d'inscription");
      if (formData.capacity <= 0) missing.push('capacité');
    }

    if (missing.length > 0) {
      const joined = missing.join(', ');
      return `Veuillez remplir le${missing.length > 1 ? 's' : ''} champ${missing.length > 1 ? 's' : ''} suivant${missing.length > 1 ? 's' : ''} : ${joined}.`;
    }

    // Specific value checks for tab 1
    if (tab === 1) {
      const now = dayjs();
      const regDate = dayjs(formData.registrationDeadline);
      if (regDate.isBefore(now)) {
        return "La date limite d'inscription ne peut pas être dans le passé.";
      }
    }

    return undefined;
  };

  const isEdit = !!tournamentToEdit;

  const handleSubmit = async () => {
    if (isLoading) return;

    const baseError = getValidationErrors(0);
    const detailsError = getValidationErrors(1);

    if (isEdit) {
      // For Edit: Instant submission if everything is valid
      if (baseError) {
        setError(baseError);
        setValue(0);
        return;
      }
      if (detailsError) {
        setError(detailsError);
        setValue(1);
        return;
      }

      setError(undefined);
      await update(tournamentToEdit.idTournament, formData);
    } else {
      // For Create: Two-step review process
      if (value === 0) {
        if (!baseError) {
          setError(detailsError ?? undefined);
          setValue(1);
        } else {
          setError(baseError);
        }
      } else {
        if (baseError) {
          setError(baseError);
          setValue(0);
        } else if (detailsError) {
          setError(detailsError);
        } else {
          setError(undefined);
          await create(formData);
        }
      }
    }
  };

  const handleChange = (
    field: keyof TournamentFormData,
    val: string | number,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
    if (error) setError(undefined);
  };

  const handleTabChange = (newValue: number) => {
    setValue(newValue);
    setError(undefined);
  };

  const getConfirmLabel = () => {
    if (isEdit) return 'Modifier';
    return value === 0 ? 'Suivant' : 'Créer';
  };

  return (
    <Dialog
      open={isOpen}
      onClose={closeModal}
      fullWidth
      slotProps={{ transition: { onExited: handleExited } }}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        style={{ display: 'contents' }}
      >
        <DialogTitle variant="h2">
          {isEdit ? 'Modifier un Tournoi' : 'Créer un Tournoi'}
        </DialogTitle>
        <Typography textAlign="center" color="secondary" padding="0 2rem 1rem">
          {isEdit
            ? 'Modifiez les informations ci-dessous pour mettre à jour votre tournoi'
            : 'Remplissez les informations ci-dessous pour créer votre tournoi'}
        </Typography>

        <Stack sx={{ padding: '0 1rem' }}>
          <Tabs
            options={[
              { label: 'Base', value: 0 },
              { label: 'Détails', value: 1 },
            ]}
            value={value}
            onChange={(v) => handleTabChange(v)}
            fullWidth
          />
        </Stack>
        <DialogContent
          sx={{
            height: contentHeight,
            transition: 'height 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            overflow: 'hidden',
            padding: 0,
          }}
        >
          <Stack ref={contentRef} sx={{ padding: '0.75rem 1rem 1.5rem 1rem' }}>
            {value === 0 ? (
              <BaseTab
                formData={formData}
                onChange={handleChange}
                error={error}
                isCreation={!isEdit}
              />
            ) : (
              <DetailsTab
                formData={formData}
                onChange={handleChange}
                error={error}
                isCreation={!isEdit}
              />
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={closeModal}
            color="secondary"
            variant="contained"
            fullWidth
            disabled={isLoading}
          >
            Annuler
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            fullWidth
            loading={isLoading}
          >
            {getConfirmLabel()}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
