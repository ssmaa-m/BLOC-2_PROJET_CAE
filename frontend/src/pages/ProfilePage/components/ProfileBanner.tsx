import { Stack, Typography, Skeleton, Chip, Avatar } from '@mui/material';
import { Theme } from '@mui/material/styles';
import profileHeroHeader from '../../../assets/images/profile_hero_header.jpg';
import { ProfileInfoDto } from '../../../types';
import { Link } from 'react-router-dom';

export const ProfileBanner = ({ user }: { user?: ProfileInfoDto }) => {
  return (
    <Stack
      sx={{
        background: `linear-gradient(0, rgba(0, 0, 0, 0.2)), url("${profileHeroHeader}") no-repeat center/cover`,
      }}
      spacing="0.375rem"
      width={1}
      height="fit-content"
      padding="5rem"
      zIndex={15}
    >
      <Stack spacing="0.75rem" alignItems="center" direction="row">
        {user ? (
          <Stack
            position="relative"
            borderRadius="100rem"
            overflow="hidden"
            height="2.5rem"
            width="2.5rem"
            alignItems="center"
            justifyContent="center"
          >
            <Avatar
              src={user.avatar ? `/assets/avatars/${user.avatar}` : ''}
              sx={{
                width: '2.5rem',
                height: '2.5rem',
              }}
            />
          </Stack>
        ) : (
          <Skeleton variant="circular" width="2.5rem" height="2.5rem" />
        )}
        <Typography variant="h1">
          {user ? (
            user.tag
          ) : (
            <Skeleton variant="text" height="3.375rem" width="10rem" />
          )}
        </Typography>
      </Stack>
      <Stack direction="row" spacing="0.25rem" alignItems="center">
        {user ? (
          <>
            {user.team && (
              <Chip
                data-testid={`user-team-chip`}
                component={Link}
                to={`/teams/${user.team.id}`}
                size="small"
                color="inverse"
                label={`Team ${user.team.name}`}
                clickable
                sx={{
                  '& .MuiChip-label': {
                    color: (theme: Theme) => theme.palette.background.s0,
                  },
                  '&:hover': {
                    background: (theme: Theme) =>
                      `color-mix(in srgb, ${theme.palette.background.s1}, white 88%)`,
                  },
                }}
              />
            )}
            <Chip
              size="medium"
              variant="text"
              label={`Spécialité ${user?.specialty ? user.specialty.charAt(0).toUpperCase() + user.specialty.slice(1) : ''}`}
            />
          </>
        ) : (
          <>
            <Skeleton
              variant="rounded"
              width="7.5rem"
              height="1.5rem"
              sx={{ borderRadius: '100rem' }}
            />
            <Skeleton variant="text" width="10rem" height="1.75rem" />
          </>
        )}
      </Stack>
    </Stack>
  );
};
