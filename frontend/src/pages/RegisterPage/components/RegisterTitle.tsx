import { Box, Stack, Typography } from '@mui/material';
import logo from '../../../assets/images/logo.svg';
import { LoadingIcon } from '../../../components/LoadingIcon';

interface RegisterTitleProps {
  isRegistering: boolean;
  step: number;
}

const getTitle = (isRegistering: boolean, step: number) => {
  if (isRegistering) return 'Traitement en cours';
  if (step === 1) return 'Bienvenue';
  if (step === 2) return 'Mot de passe';
  return 'Choisissez votre avatar';
};

const getDescription = (isRegistering: boolean, step: number) => {
  if (isRegistering)
    return 'Votre inscription est en cours de traitement, veuillez patienter.';
  if (step === 1) return 'Inscrivez vous et commencez votre expérience.';
  if (step === 2)
    return 'Choisissez un mot de passe pour protéger votre compte.';
  return 'Choisissez une photo de profil pour personnaliser votre compte.';
};

export const RegisterTitle = ({ isRegistering, step }: RegisterTitleProps) => {
  return (
    <Stack spacing="1.5rem" alignItems="center">
      {isRegistering ? (
        <Box>
          <LoadingIcon />
        </Box>
      ) : (
        <img src={logo} width="44" height="44" />
      )}

      <Stack spacing="0.5rem">
        <Typography variant="h3" textAlign="center">
          {getTitle(isRegistering, step)}
        </Typography>

        <Typography variant="body1" color="secondary" textAlign="center">
          {getDescription(isRegistering, step)}
        </Typography>
      </Stack>
    </Stack>
  );
};
