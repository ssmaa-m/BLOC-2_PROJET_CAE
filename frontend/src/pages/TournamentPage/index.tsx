import { TournamentBanner } from './components/TournamentBanner';
import { useContext, useEffect, useMemo, useState } from 'react';
import { TournamentDetailsInfoDto } from '../../types';
import { useTournaments } from '../../hooks/useTournaments';
import { useParams } from 'react-router-dom';
import { Container, Grid2, Stack } from '@mui/material';
import { TeamsCard } from './components/TeamsCard';
import { UserContext } from '../../contexts/UserContext';
import { NotFoundPage } from '../NotFoundPage';
import { AdminActionCard } from './components/AdminActionCard';

import { useTournamentModal } from '../../hooks/useTournamentModal';
import { useModal } from '../../hooks/useModal';
import { useModalController } from '../../hooks/useModalController';
import { publishTournamentModal } from './modals/publishTournamentModal';
import { generateMatchesModal } from './modals/generateMatchesModal';
import { groupMatchesByYearAndDay } from '../../utils/matchUtils';
import { MatchYearGroup } from '../../components/MatchYearGroup';
import { publishTournamentMatchModal } from './modals/publishTournamentMatch';
import { MatchListSkeleton } from '../../components/MatchListSkeleton';

export const TournamentPage = () => {
  const { id } = useParams();
  const idNbr = Number(id);
  const [tournament, setTournament] = useState<
    TournamentDetailsInfoDto | undefined
  >(undefined);
  const [error, setError] = useState<
    { code: number; message: string; subtitle?: string } | undefined
  >(undefined);
  const { authenticatedUser } = useContext(UserContext);
  const { openEditModal } = useTournamentModal();
  const { openModal } = useModal();
  const { setLoading } = useModalController();

  const {
    getById,
    publish,
    publishMatches,
    register,
    generateMatches,
    isGettingTournamentById,
  } = useTournaments({
    setTournament,
    setError,
  });

  const handleAdminAction = async (status: string) => {
    if (!idNbr) return;

    if (status === 'IN_PREPARATION') {
      openModal(
        publishTournamentModal(async (close) => {
          setLoading(true);
          close();
          publish(idNbr);
        }),
      );
    } else if (
      (status === 'REGISTRATION_CLOSED' && tournament?.matches?.length) ??
      0 > 0
    ) {
      openModal(
        publishTournamentMatchModal(async (close) => {
          setLoading(true);
          close();
          publishMatches(idNbr);
        }),
      );
    } else if (status === 'REGISTRATION_CLOSED') {
      openModal(
        generateMatchesModal(async (close) => {
          setLoading(true);
          await generateMatches(idNbr);
          close();
        }),
      );
    }
  };

  const handleAdminAction2 = async (status: string) => {
    if (!idNbr) return;
    if (status === 'IN_PREPARATION') {
      openEditModal(tournament!, setTournament);
    } else if (status === 'REGISTRATION_CLOSED') {
      openModal(
        generateMatchesModal(async (close) => {
          setLoading(true);
          await generateMatches(idNbr);
          close();
        }, true),
      );
    }
  };

  const canCol1 = useMemo(() => {
    if (isGettingTournamentById && !tournament) return true;
    if (!tournament || tournament.status === 'CANCELLED') return false;

    if (authenticatedUser?.admin) {
      return tournament.status !== 'REGISTRATION_OPEN';
    }

    return ['PLANNED', 'IN_PROGRESS', 'DONE'].includes(tournament.status);
  }, [tournament, authenticatedUser, isGettingTournamentById]);

  const canCol2 = useMemo(() => {
    if (isGettingTournamentById) return true;
    if (!tournament || tournament.status === 'CANCELLED') return false;
    return tournament.status !== 'IN_PREPARATION';
  }, [tournament, isGettingTournamentById]);

  useEffect(() => {
    if (authenticatedUser === undefined) return;

    getById(idNbr);

    const intervalId = setInterval(() => {
      getById(idNbr);
    }, 15000);

    return () => clearInterval(intervalId);
  }, [authenticatedUser, idNbr, getById]);

  useEffect(() => {
    if (authenticatedUser === undefined) return;
    if (tournament?.status === 'IN_PREPARATION' && !authenticatedUser?.admin) {
      setError({
        code: 404,
        message: 'Tournoi introuvable',
        subtitle: "Ce tournoi n'est pas encore ouvert au public.",
      });
    }
  }, [tournament?.status, authenticatedUser]);

  const groupedMatches = groupMatchesByYearAndDay(tournament?.matches ?? []);

  if (error && !isGettingTournamentById) return <NotFoundPage error={error} />;
  return (
    <>
      <TournamentBanner tournament={tournament} />
      <Container maxWidth="lg">
        <Grid2
          container
          spacing="1.5rem"
          padding="1.5rem 0 4rem"
          direction={{ xs: 'column-reverse', desktop: 'row' }}
          justifyContent="center"
        >
          {canCol1 && (
            <Grid2 size={{ xs: 12, desktop: 6.5, lg: 7.5 }}>
              <Stack spacing="1.5rem">
                {authenticatedUser?.admin && tournament?.status && (
                  <AdminActionCard
                    hasMatches={tournament.matches.length > 0}
                    status={tournament.status}
                    onAction={() => handleAdminAction(tournament.status)}
                    onAction2={() => handleAdminAction2(tournament.status)}
                  />
                )}
                {(!authenticatedUser?.admin ||
                  (tournament?.status !== 'IN_PREPARATION' &&
                    tournament?.status !== 'REGISTRATION_CLOSED') ||
                  (authenticatedUser?.admin &&
                    tournament?.status === 'REGISTRATION_CLOSED')) &&
                  (tournament && tournament.matches.length > 0
                    ? groupedMatches.map((yearGroup) => (
                        <MatchYearGroup
                          key={yearGroup.year}
                          year={yearGroup.year}
                          daysData={yearGroup.daysData}
                          refetch={() => getById(idNbr)}
                        />
                      ))
                    : isGettingTournamentById && <MatchListSkeleton />)}
              </Stack>
            </Grid2>
          )}
          {canCol2 && (
            <Grid2
              size={{
                xs: 12,
                desktop: canCol1 ? 5.5 : 6.5,
                lg: canCol1 ? 4.5 : 5.5,
              }}
            >
              <Stack spacing="1.5rem">
                <TeamsCard
                  teams={tournament?.teams}
                  capacity={tournament?.capacity}
                  status={tournament?.status}
                  managedTeamId={authenticatedUser?.managedTeamId}
                  tournamentId={idNbr}
                  onRegister={register}
                />
              </Stack>
            </Grid2>
          )}
        </Grid2>
      </Container>
    </>
  );
};
