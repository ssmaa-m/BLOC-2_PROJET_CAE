import { Grid2, Typography } from '@mui/material';
import { MatchSummaryDto, MaybeAuthenticatedUser } from '../../../types';
import { TeamLineupHover } from './TeamLineupHover';
import { Link } from 'react-router-dom';
import { VersusSymbol } from './VersusSymbol';
import {
  getTypographyProps,
  getVersusItemDisplay,
} from '../utils/displayRules';
import { useUser } from '../../../hooks/useUser';

interface VersusItemProps {
  match: MatchSummaryDto;
}

export const VersusItem = ({ match }: VersusItemProps) => {
  const { authenticatedUser } = useUser();
  const { showScoresSection, revealScores, isFinal, isForfeit, getScore } =
    getVersusItemDisplay({ match, authenticatedUser });
  return (
    <Grid2 size={6} spacing="2.375rem" container position="relative">
      <Grid2
        size={6}
        display="flex"
        alignItems="center"
        justifyContent="flex-end"
        gap="1.25rem"
      >
        <TeamItem
          matchTeam={match.team1}
          isFinal={isFinal}
          isForfeit={isForfeit}
          match={match}
          authenticatedUser={authenticatedUser}
        />
        {showScoresSection && (
          <Typography
            variant="h4"
            display="flex"
            alignItems="center"
            color={
              revealScores && !match.team1?.hasForfeited
                ? 'primary'
                : 'secondary'
            }
          >
            {getScore({ team: match.team1 })}
          </Typography>
        )}
      </Grid2>
      <VersusSymbol />
      <Grid2 size={6} display="flex" alignItems="center" gap="1.25rem">
        {showScoresSection && (
          <Typography
            variant="h4"
            display="flex"
            alignItems="center"
            color={
              revealScores && !match.team2?.hasForfeited
                ? 'primary'
                : 'secondary'
            }
          >
            {getScore({ team: match.team2 })}
          </Typography>
        )}
        <TeamItem
          matchTeam={match.team2}
          isFinal={isFinal}
          isForfeit={isForfeit}
          match={match}
          authenticatedUser={authenticatedUser}
        />
      </Grid2>
    </Grid2>
  );
};

const TeamItem = ({
  matchTeam,
  isFinal,
  isForfeit,
  match,
  authenticatedUser,
}: {
  matchTeam: MatchSummaryDto['team1'] | MatchSummaryDto['team2'];
  isFinal: boolean;
  isForfeit: boolean;
  match: MatchSummaryDto;
  authenticatedUser: MaybeAuthenticatedUser;
}) => {
  if (!matchTeam?.idTeam || !matchTeam?.name)
    return (
      <Typography {...getTypographyProps({ matchTeam, isFinal })}>
        {isForfeit ? "Pas d'adversaire" : 'TBD'}
      </Typography>
    );

  return (
    <TeamLineupHover
      team={matchTeam}
      matchStatus={match.status}
      authenticatedUser={authenticatedUser}
    >
      <Typography
        component={Link}
        to={`/teams/${matchTeam?.idTeam}`}
        {...getTypographyProps({ matchTeam, isFinal })}
      >
        {matchTeam?.name}
      </Typography>
    </TeamLineupHover>
  );
};
