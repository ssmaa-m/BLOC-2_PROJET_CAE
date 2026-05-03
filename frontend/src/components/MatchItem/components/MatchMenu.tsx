import { Divider, IconButton, Menu, Typography } from '@mui/material';
import { MatchMenuItem } from './MatchMenuItem';
import {
  CircleCheck,
  CircleXmark,
  EllipsisVertical,
  Flag,
  PencilToLine,
  PencilToSquare,
  Persons,
} from '@gravity-ui/icons';
import { MatchSummaryDto } from '../../../types';
import { useMatchMenu } from '../hooks/useMatchMenu';

interface MatchMenuProps {
  match: MatchSummaryDto;
  refetch: () => void;
}

export const MatchMenu = ({ match, refetch }: MatchMenuProps) => {
  const {
    theme,
    anchorEl,
    handleClick,
    handleClose,
    showTeamSection,
    showForfeit,
    showEditComposition,
    showScoresSection,
    showAdminEncode,
    showAdminModify,
    showAdminSection,
    needsDividerAfterTeam,
    needsDividerAfterScores,
    displayMenu,
    handleForfeit,
    handleEditComposition,
    handleConfirmOrContestScore,
    handleEncodeScore,
    handleEditScore,
    authenticatedUser,
  } = useMatchMenu({ match, refetch });

  if (!displayMenu) return null;

  return (
    <>
      <IconButton size="small" onClick={handleClick}>
        <EllipsisVertical style={{ color: theme.palette.text.secondary }} />
      </IconButton>

      <Menu
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorEl={anchorEl}
        sx={{
          '& .MuiPaper-root': {
            width: 'fit-content',
          },
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {showTeamSection && (
          <>
            <Typography
              variant="body2"
              padding="0.375rem 0.75rem 0.25rem"
              color="secondary"
            >
              Team
            </Typography>
            {showForfeit && (
              <MatchMenuItem
                disabled={match.status == 'FORFEIT'}
                onClick={() => {
                  const forfeitingTeamId = authenticatedUser?.managedTeamId;

                  if (!forfeitingTeamId) {
                    return;
                  }

                  const winningTeamId =
                    forfeitingTeamId === match.team1.idTeam
                      ? match.team2.idTeam
                      : match.team1.idTeam;

                  handleForfeit({
                    matchId: match.idMatch,
                    winningTeamId: winningTeamId,
                    forfeitingTeamId: forfeitingTeamId,
                  });

                  handleClose();
                }}
                icon={<Flag style={{ color: theme.palette.text.secondary }} />}
                label="Déclarer Forfait"
              />
            )}
            {showEditComposition && (
              <MatchMenuItem
                onClick={() => {
                  handleEditComposition();
                  handleClose();
                }}
                icon={
                  <Persons style={{ color: theme.palette.text.secondary }} />
                }
                label="Modifier Composition"
              />
            )}
          </>
        )}

        {needsDividerAfterTeam && (
          <Divider sx={{ margin: '0.25rem 0.75rem !important' }} />
        )}

        {showScoresSection && (
          <>
            <Typography
              variant="body2"
              padding="0.375rem 0.75rem 0.25rem"
              color="secondary"
            >
              Scores
            </Typography>
            <MatchMenuItem
              onClick={() => {
                handleConfirmOrContestScore({
                  id: match.idMatch,
                  isTeam1:
                    authenticatedUser?.managedTeamId === match?.team1?.idTeam,
                  isConfirming: true,
                  previousMatch: match,
                });
                handleClose();
              }}
              icon={
                <CircleCheck style={{ color: theme.palette.text.secondary }} />
              }
              label="Confirmer"
            />
            <MatchMenuItem
              onClick={() => {
                handleConfirmOrContestScore({
                  id: match.idMatch,
                  isTeam1:
                    authenticatedUser?.managedTeamId === match?.team1?.idTeam,
                  isConfirming: false,
                  previousMatch: match,
                });
                handleClose();
              }}
              icon={
                <CircleXmark style={{ color: theme.palette.text.secondary }} />
              }
              label="Contester"
            />
          </>
        )}

        {needsDividerAfterScores && (
          <Divider sx={{ margin: '0.25rem 0.75rem !important' }} />
        )}

        {showAdminSection && (
          <>
            <Typography
              variant="body2"
              padding="0.375rem 0.75rem 0.25rem"
              color="secondary"
            >
              Administrateur
            </Typography>
            {showAdminEncode && (
              <MatchMenuItem
                onClick={() => {
                  handleEncodeScore();
                  handleClose();
                }}
                icon={
                  <PencilToLine
                    style={{ color: theme.palette.text.secondary }}
                  />
                }
                label="Encoder les Scores"
              />
            )}
            {showAdminModify && (
              <MatchMenuItem
                onClick={() => {
                  handleEditScore();
                  handleClose();
                }}
                icon={
                  <PencilToSquare
                    style={{ color: theme.palette.text.secondary }}
                  />
                }
                label="Corriger les Scores"
              />
            )}
          </>
        )}
      </Menu>
    </>
  );
};
