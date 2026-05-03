import { Chip, Stack, Typography, Skeleton } from '@mui/material';
import teamHeroHeader from '../../../assets/images/team_hero_header.jpg';
import { TeamDetailsInfoDto } from '../../../types';
import { PersonOutline } from '@mui/icons-material';

export const TeamBanner = ({ team }: { team?: TeamDetailsInfoDto }) => {
  return (
    <Stack
      sx={{
        background: `linear-gradient(0, rgba(0, 0, 0, 0.2)), url("${teamHeroHeader}") no-repeat center/cover`,
      }}
      spacing="0.375rem"
      width={1}
      height="fit-content"
      padding="5rem"
      zIndex={15}
    >
      <Stack spacing="0.75rem" alignItems="center" direction="row">
        <Typography variant="h1">
          {team ? (
            team.name
          ) : (
            <Skeleton variant="text" height="3.375rem" width="15rem" />
          )}
        </Typography>
      </Stack>
      <Stack direction="row" spacing="0.25rem" alignItems="center">
        {team ? (
          <>
            <Chip
              size="small"
              color="inverse"
              label={team.isActive ? 'Équipe active' : 'Équipe inactive'}
            />
            <Chip
              size="medium"
              variant="text"
              sx={{ '& .MuiSvgIcon-root': { mr: '0.25rem' } }}
              icon={<PersonOutline sx={{ height: '1rem', width: '1rem' }} />}
              label={team.members.length}
            />
          </>
        ) : (
          <>
            <Skeleton
              variant="rounded"
              width="6rem"
              height="1.5rem"
              sx={{ borderRadius: '100rem' }}
            />
            <Skeleton variant="text" width="2rem" height="1.75rem" />
          </>
        )}
      </Stack>
    </Stack>
  );
};
