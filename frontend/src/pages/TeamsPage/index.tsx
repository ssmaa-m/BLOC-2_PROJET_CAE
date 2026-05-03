import { Container, Grid2, Typography } from '@mui/material';
import { SearchBar } from '../../components/SearchBar';
import { TeamItem } from './components/TeamItem';
import { useTeamsPage } from './hooks/useTeamsPage';

export const TeamsPage = () => {
  const { teams, isGettingAllTeams, searchQuery, setSearchQuery } =
    useTeamsPage();
  return (
    <Container
      maxWidth="md"
      sx={{
        padding: '1.5rem 0 4rem 0',
      }}
    >
      <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        fullwidth
      />
      <Grid2
        container
        spacing="1.5rem"
        padding="1.5rem 0 4rem"
        justifyContent="center"
        className={isGettingAllTeams && teams.length > 0 ? 'opacity-pulse' : ''}
        sx={{
          transform:
            isGettingAllTeams && teams.length > 0 ? 'scale(0.98)' : 'none',
          transition: 'transform 0.3s cubic-bezier(0.2, 0, 0, 1)',
        }}
      >
        {teams.length === 0 && isGettingAllTeams ? (
          Array.from({ length: 10 }).map((_, index) => (
            <Grid2 key={index} size={{ xs: 12, sm: 6, md: 4 }}>
              <TeamItem />
            </Grid2>
          ))
        ) : teams.length === 0 ? (
          <Grid2
            size={12}
            padding="3rem 1.5rem"
            alignItems="center"
            justifyContent="center"
            bgcolor="background.s1"
            borderRadius="1.5rem"
          >
            <Typography variant="h5" textAlign="center">
              Aucune team trouvée.
            </Typography>
            <Typography
              variant="body2"
              textAlign="center"
              color="text.secondary"
            >
              Aucune team ne correspond à votre recherche.
            </Typography>
          </Grid2>
        ) : (
          teams.map((team) => (
            <Grid2 key={team.idTeam} size={{ xs: 12, sm: 6, md: 4 }}>
              <TeamItem team={team} />
            </Grid2>
          ))
        )}
      </Grid2>
    </Container>
  );
};
