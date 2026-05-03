import { Chip, Grid2, Stack, Typography } from '@mui/material';
import { MatchSummaryDto } from '../../types';
import { VersusItem } from './components/VersusItem';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';
import { MatchMenu } from './components/MatchMenu';
import { MatchOverlay } from './components/MatchOverlay';
import { isContested } from '../../utils/confirmationUtils';

interface MatchItemProps {
  match: MatchSummaryDto;
  refetch: () => void;
}

export const MatchItem = ({ match, refetch }: MatchItemProps) => {
  const isFinal = match.isFinal;
  return (
    <MatchOverlay match={match}>
      <Stack
        bgcolor="background.s2"
        borderRadius="0.75rem"
        overflow="hidden"
        border="1px solid"
        borderColor="divider"
        position="relative"
      >
        <Grid2 height="4rem" spacing="1rem" container>
          <Grid2 pl="0.75rem" size={3} display="flex" alignItems="center">
            <Typography
              variant="h3"
              color={
                dayjs(match.dateHour).isBefore(dayjs())
                  ? 'secondary'
                  : 'primary'
              }
            >
              {dayjs(match.dateHour).format('HH:mm')}
            </Typography>
          </Grid2>
          <VersusItem match={match} />
          <Grid2
            pr="0.75rem"
            size={3}
            display="flex"
            alignItems="center"
            justifyContent="flex-end"
          >
            <MatchMenu match={match} refetch={refetch} />
          </Grid2>
        </Grid2>
        <Stack
          width="100%"
          bgcolor="background.s3"
          height="2.5rem"
          alignItems="center"
          justifyContent="center"
          direction="row"
          px="0.75rem"
        >
          <Stack color="text.secondary" flex={1}>
            <Typography
              component={Link}
              sx={{ textDecoration: 'none' }}
              to={`/tournaments/${match.tournament.id}`}
              variant="h5"
              color="text.secondary"
              textOverflow="ellipsis"
              noWrap
              flex={1}
            >
              {match.tournament.name}
            </Typography>
          </Stack>
          <Stack
            color="text.secondary"
            alignItems="flex-end"
            flex={1}
            direction="row"
            justifyContent="flex-end"
            spacing={1}
          >
            {(isContested(match.team1) || isContested(match.team2)) && (
              <Chip
                label="Contesté"
                color="error"
                size="small"
                variant="outlined"
              />
            )}
            {isFinal ? (
              <Chip label="Finale" color="primary" />
            ) : (
              <Typography variant="h5" color="text.secondary">
                Tour {match.turn}
              </Typography>
            )}
          </Stack>
        </Stack>
      </Stack>
    </MatchOverlay>
  );
};
