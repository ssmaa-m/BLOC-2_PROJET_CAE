export const getPasswordRules = (password: string) => [
  {
    label: 'Au moins 8 caractères',
    valid: password.length >= 8,
  },
  {
    label: 'Au moins une majuscule',
    valid: /[A-Z]/.test(password),
  },
  {
    label: 'Au moins une minuscule',
    valid: /[a-z]/.test(password),
  },
  {
    label: 'Au moins un chiffre',
    valid: /\d/.test(password),
  },
  {
    label: 'Au moins un caractère spécial',
    valid: /[\W_]/.test(password),
  },
];
