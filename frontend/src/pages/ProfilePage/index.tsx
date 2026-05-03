import { Container, Grid2, Stack } from '@mui/material';
import { PersonalInfoItem } from './components/PersonalInfoItem';
import { ProfileBanner } from './components/ProfileBanner';
import { TeamItem } from './components/TeamItem';
import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';
import { ProfileInfoDto } from '../../types';
import { NotFoundPage } from '../NotFoundPage';
import { UnavailabilitiesItem } from './components/UnavailabilitiesItem';
import { useMembers } from '../../hooks/useMembers';
import { Divider } from '@mui/material';
import { TournamentMatchSection } from '../../components/TournamentMatchSection';

export const ProfilePage = () => {
  const { id } = useParams();
  const idNbr = Number(id);
  const { authenticatedUser } = useContext(UserContext);
  const [user, setUser] = useState<ProfileInfoDto | undefined>(undefined);
  const [error, setError] = useState<
    { code: number; message: string; subtitle?: string } | undefined
  >(undefined);
  const { getById } = useMembers({ setUser, setError });

  useEffect(() => {
    if (authenticatedUser === undefined) return;
    setUser(undefined);
    setError(undefined);
    getById(idNbr);
  }, [idNbr, authenticatedUser, getById]);

  if (error) return <NotFoundPage error={error} />;
  return (
    <>
      <ProfileBanner user={user} />
      <Container maxWidth="lg">
        <Grid2
          container
          spacing="1.5rem"
          padding="0 0 4rem"
          direction={{ xs: 'column-reverse', desktop: 'row' }}
          justifyContent="center"
        >
          <Grid2 size={{ xs: 12, desktop: 6.5, lg: 7.5 }}>
            <TournamentMatchSection id={idNbr} focus="member" />
          </Grid2>
          {authenticatedUser?.id === idNbr && (
            <Grid2 size={{ xs: 12, desktop: 5.5, lg: 4.5 }} paddingTop="1.5rem">
              <Stack
                sx={{ background: (theme) => theme.palette.background.s1 }}
                borderRadius="1.5rem"
                divider={<Divider />}
                padding="1.5rem"
              >
                <PersonalInfoItem user={user} setUser={setUser} />
                <TeamItem user={user} setUser={setUser} />
                <UnavailabilitiesItem user={user} setUser={setUser} />
              </Stack>
            </Grid2>
          )}
        </Grid2>
      </Container>
    </>
  );
};
