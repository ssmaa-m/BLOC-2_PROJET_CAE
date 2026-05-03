import { InputLabel, Stack } from '@mui/material';
import { MatchSummaryDto } from '../../../types';
import { useModalController } from '../../../hooks/useModalController';
import { useEffect } from 'react';
import { NumericTextField } from '../../../modals/TournamentModal/components/NumericTextField';
import { VersusSymbol } from './VersusSymbol';

interface AdminEncodeScoreFormProps {
  match: MatchSummaryDto;
  scoreTeam1: number;
  setScoreTeam1: (value: number) => void;
  scoreTeam2: number;
  setScoreTeam2: (value: number) => void;
}

export const AdminEncodeScoreForm = ({
  match,
  scoreTeam1,
  setScoreTeam1,
  scoreTeam2,
  setScoreTeam2,
}: AdminEncodeScoreFormProps) => {
  const { setConfirmDisabled, setError } = useModalController();

  useEffect(() => {
    const isInvalid = scoreTeam1 === scoreTeam2;
    setConfirmDisabled(isInvalid);
    setError(isInvalid ? 'Les matchs nuls ne sont pas autorisés.' : null);
  }, [scoreTeam1, scoreTeam2, setError, setConfirmDisabled]);
  return (
    <Stack
      direction="row"
      spacing="1.25rem"
      alignItems="flex-end"
      justifyContent="center"
    >
      <Stack spacing="0.25rem" alignItems="center" flex={1}>
        <InputLabel>{match.team1.name}</InputLabel>
        <NumericTextField
          value={scoreTeam1}
          onChange={setScoreTeam1}
          min={0}
          max={5}
          fullWidth={false}
        />
      </Stack>

      <Stack justifyContent="center" height="2.25rem">
        <VersusSymbol absolute={false} />
      </Stack>

      <Stack spacing="0.25rem" alignItems="center" flex={1}>
        <InputLabel>{match.team2.name}</InputLabel>
        <NumericTextField
          value={scoreTeam2}
          onChange={setScoreTeam2}
          min={0}
          max={5}
          fullWidth={false}
        />
      </Stack>
    </Stack>
  );
};
