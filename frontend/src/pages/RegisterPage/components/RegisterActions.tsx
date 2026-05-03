import { ArrowLeft } from '@gravity-ui/icons';
import { Button, Stack, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

interface RegisterActionsProps {
  step: number;
  handleBack: () => void;
}

export const RegisterActions = ({ step, handleBack }: RegisterActionsProps) => {
  return (
    <Stack spacing="1.5rem" paddingTop="1.5rem">
      <Stack spacing="0.5rem">
        {step > 1 && (
          <Button
            variant="contained"
            color="secondary"
            onClick={handleBack}
            startIcon={<ArrowLeft />}
            data-testid={`return-step-${step}`}
          >
            Retour
          </Button>
        )}
        <Button
          type="submit"
          variant="contained"
          data-testid={`register-submit-step-${step}`}
        >
          {step < 3 ? 'Continuer' : "S'Inscrire"}
        </Button>
      </Stack>

      <Typography textAlign="center" variant="body2" color="secondary">
        Déjà inscrit? <Link to="/auth/login">Se connecter</Link>
      </Typography>
    </Stack>
  );
};
