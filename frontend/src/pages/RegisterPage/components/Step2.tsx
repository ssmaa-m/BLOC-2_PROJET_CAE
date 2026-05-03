import { useState } from 'react';
import { Eye, EyeSlash } from '@gravity-ui/icons';
import { IconButton, Stack, TextField, Collapse } from '@mui/material';
import { RegisterFormData } from '../../../types';
import { PasswordStrengthItem } from '../../../components/PasswordStrengthItem';
import { getPasswordRules } from '../../../utils/passwordRules';

interface Step2Props {
  formData: RegisterFormData;
  handleChange: (e: React.SyntheticEvent) => void;
  errors: Partial<Record<keyof RegisterFormData, string>>;
}

export const Step2 = ({ formData, handleChange, errors }: Step2Props) => {
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  });
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const togglePasswordVisibility = (field: 'password' | 'confirmPassword') => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const rules = getPasswordRules(formData.password);

  const isValid = rules.every((rule) => rule.valid);

  return (
    <Stack spacing="0.625rem">
      <Stack spacing="0.25rem">
        <TextField
          autoFocus
          fullWidth
          id="password"
          name="password"
          type={showPassword.password ? 'text' : 'password'}
          placeholder="Mot de passe"
          variant="outlined"
          value={formData.password}
          onChange={handleChange}
          onFocus={() => setIsPasswordFocused(true)}
          onBlur={() => setIsPasswordFocused(false)}
          error={!!errors.password}
          helperText={errors.password || ''}
          required
          slotProps={{
            input: {
              endAdornment: formData.password.trim().length > 0 && (
                <IconButton
                  onClick={() => togglePasswordVisibility('password')}
                >
                  {showPassword.password ? <EyeSlash /> : <Eye />}
                </IconButton>
              ),
            },
          }}
        />
        <Collapse in={isPasswordFocused && formData.password.length > 0}>
          <Stack>
            {!isValid ? (
              rules.map((rule, index) => (
                <PasswordStrengthItem
                  key={index}
                  text={rule.label}
                  isValid={rule.valid}
                />
              ))
            ) : (
              <PasswordStrengthItem
                text="Mot de passe fort"
                isValid={true}
                crossText={false}
              />
            )}
          </Stack>
        </Collapse>
      </Stack>
      {isValid && (
        <TextField
          fullWidth
          id="confirmPassword"
          name="confirmPassword"
          type={showPassword.confirmPassword ? 'text' : 'password'}
          placeholder="Confirmer le mot de passe"
          variant="outlined"
          value={formData.confirmPassword}
          onChange={handleChange}
          helperText={errors.confirmPassword || ''}
          error={!!errors.confirmPassword}
          required
          slotProps={{
            input: {
              endAdornment: formData.confirmPassword.trim().length > 0 && (
                <IconButton
                  onClick={() => togglePasswordVisibility('confirmPassword')}
                >
                  {showPassword.confirmPassword ? <EyeSlash /> : <Eye />}
                </IconButton>
              ),
            },
          }}
        />
      )}
    </Stack>
  );
};
