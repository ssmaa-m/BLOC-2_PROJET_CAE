import { Container, Grid2, Stack } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';
import { TeamDetailsInfoDto } from '../../types';
import { NotFoundPage } from '../NotFoundPage';
import { TeamBanner } from './components/TeamBanner';
import { ManagerCard } from './components/ManagerCard';
import { MembersCard } from './components/MembersCard';
import { JoinRequestsCard } from './components/JoinRequestsCard';
import { useTeams } from '../../hooks/useTeams';
import { TournamentMatchSection } from '../../components/TournamentMatchSection';

export const TeamPage = () => {
  const { id } = useParams();
  const idNbr = Number(id);
  const { authenticatedUser } = useContext(UserContext);
  const [error, setError] = useState<
    { code: number; message: string; subtitle?: string } | undefined
  >(undefined);

  const [team, setTeam] = useState<TeamDetailsInfoDto | undefined>(undefined);
  const { getById, isGettingTeam } = useTeams({ setTeam, setError });

  useEffect(() => {
    if (authenticatedUser === undefined) return;
    setTeam(undefined);
    setError(undefined);
    getById(idNbr);
  }, [idNbr, authenticatedUser, getById]);

  if (error && !isGettingTeam) return <NotFoundPage error={error} />;

  return (
    <>
      <TeamBanner team={team} />
      <Container maxWidth="lg">
        <Grid2
          container
          spacing="1.5rem"
          padding="0 0 4rem"
          direction={{ xs: 'column-reverse', desktop: 'row' }}
          justifyContent="center"
        >
          <Grid2 size={{ xs: 12, desktop: 6.5, lg: 7.5 }}>
            <TournamentMatchSection id={idNbr} focus="team" />
          </Grid2>
          {(team?.isActive || isGettingTeam) && (
            <Grid2 size={{ xs: 12, desktop: 5.5, lg: 4.5 }}>
              <Stack spacing="1.5rem" pt="1.5rem">
                <ManagerCard team={team} setTeam={setTeam} />
                <MembersCard team={team} setTeam={setTeam} />
                {team?.managers?.find(
                  (e) => e.id === authenticatedUser?.id,
                ) && (
                  <JoinRequestsCard
                    isLoading={isGettingTeam}
                    team={team}
                    setTeam={setTeam}
                  />
                )}
              </Stack>
            </Grid2>
          )}
        </Grid2>
      </Container>
    </>
  );
};
