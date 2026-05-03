import { useState, SyntheticEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  IconButton,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useUser } from '../hooks/useUser';
import logo from '../assets/images/logo.svg';
import authBackground from '../assets/images/auth_background.jpg';
import { ArrowLeft, Eye, EyeSlash } from '@gravity-ui/icons';
import { LoadingIcon } from '../components/LoadingIcon';

export const LoginPage = () => {
  const { login, isLoggingIn } = useUser();

  // REMEMBER ME
  const [rememberMe, setRememberMe] = useState(false);

  // const [error, setError] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    if (!formData.email.trim() || !formData.password.trim()) return;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) return;

    login({ ...formData, rememberMe }, navigate);
  };

  const handleChange = (e: SyntheticEvent) => {
    const input = e.target as HTMLInputElement;
    const name = input.name as 'email' | 'password';
    const value = input.value;

    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  return (
    <Stack direction="row" flex="1">
      <Link to="/" style={{ padding: '1rem', position: 'fixed' }}>
        <Button variant="text" startIcon={<ArrowLeft />}>
          Retour à l'Accueil
        </Button>
      </Link>
      <Container
        maxWidth={false}
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '1.5rem',
          maxWidth: '20rem',
        }}
      >
        <Stack spacing="1.5rem" alignItems="center">
          {isLoggingIn ? (
            <Box>
              <LoadingIcon />
            </Box>
          ) : (
            <img src={logo} width="44" height="44" />
          )}
          <Stack spacing="0.5rem">
            <Typography variant="h3" textAlign="center">
              {isLoggingIn ? 'Traitement en cours' : 'Bon Retour'}
            </Typography>
            <Typography variant="body1" color="secondary" textAlign="center">
              {isLoggingIn
                ? 'Votre connexion est en cours de traitement, veuillez patienter.'
                : 'Connectez vous et continuez votre expérience.'}
            </Typography>
          </Stack>
        </Stack>
        {!isLoggingIn && (
          <form
            onSubmit={handleSubmit}
            style={{
              width: '100%',
            }}
          >
            <Stack spacing="0.625rem">
              <TextField
                fullWidth
                id="email"
                name="email"
                type="email"
                placeholder="Email"
                variant="outlined"
                value={formData.email}
                onChange={handleChange}
                required
                inputProps={{ 'data-testid': 'login-email-input' }}
              />
              <TextField
                fullWidth
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Mot de passe"
                variant="outlined"
                value={formData.password}
                onChange={handleChange}
                required
                inputProps={{ 'data-testid': 'login-password-input' }}
                slotProps={{
                  input: {
                    endAdornment: formData.password.trim().length > 0 && (
                      <IconButton
                        onClick={() => setShowPassword((prev) => !prev)}
                      >
                        {showPassword ? <EyeSlash /> : <Eye />}
                      </IconButton>
                    ),
                  },
                }}
              />
            </Stack>
            <FormControlLabel
              control={
                <Checkbox
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  inputProps={{
                    ...{
                      ['data-testid' as string]: 'login-remember-me-checkbox',
                    },
                  }}
                />
              }
              label="Se souvenir de moi"
              sx={{
                p: '0.25rem 0.5rem 0',
                color: 'text.secondary',
              }}
            />
            <Stack spacing="1.5rem" paddingTop="1.5rem">
              <Button
                type="submit"
                variant="contained"
                data-testid="login-submit-button"
              >
                Se Connecter
              </Button>
              <Typography textAlign="center" variant="body2" color="secondary">
                Pas de compte? <Link to="/auth/register">S'inscrire</Link>
              </Typography>
            </Stack>
          </form>
        )}
      </Container>
      <Box
        width={1 / 3}
        minHeight="100%"
        alignItems="center"
        justifyContent="center"
        sx={{
          background: `url(${authBackground}) no-repeat center/cover`,
        }}
      />
    </Stack>
  );
};
