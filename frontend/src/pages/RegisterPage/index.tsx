import { useState, SyntheticEvent, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Box, Button, Container, Stack } from '@mui/material';
import { SpecialtyDto, ProfilePicture, RegisterFormData } from '../../types';
import { useUser } from '../../hooks/useUser';
import { useSpecialties } from '../../hooks/useSpecialties';
import authBackground from '../../assets/images/auth_background.jpg';
import { ArrowLeft } from '@gravity-ui/icons';
import { profilePictureModal } from '../../modals/profilePictureModal';
import { useModal } from '../../hooks/useModal';
import { useSnackbar } from '../../hooks/useSnackbar';
import { RegisterTitle } from './components/RegisterTitle';
import { Step1 } from './components/Step1';
import { Step2 } from './components/Step2';
import { Step3 } from './components/Step3';
import { RegisterActions } from './components/RegisterActions';
import { getPasswordRules } from '../../utils/passwordRules';

export const RegisterPage = () => {
  const { register, isRegistering } = useUser();
  const [chosenImage, setChosenImage] = useState<ProfilePicture | null>(null);
  const [selectedSpecialty, setSelectedSpecialty] =
    useState<SpecialtyDto | null>(null);
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<RegisterFormData>({
    email: '',
    password: '',
    confirmPassword: '',
    tag: '',
    specialtyId: null,
    profileImageId: null,
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof RegisterFormData, string>>
  >({});

  const {
    specialties,
    getAll: getSpecialties,
    isGettingSpecialties: loading,
  } = useSpecialties();

  const { openModal } = useModal();
  const { showSnackbar } = useSnackbar();

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    if (step === 1) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (
        !formData.email.trim() ||
        !formData.tag.trim() ||
        !formData.specialtyId ||
        !emailRegex.test(formData.email.trim())
      )
        return;

      setStep(2);
      return;
    }

    if (step === 2) {
      if (
        !formData.password.trim() ||
        !formData.confirmPassword.trim() ||
        !getPasswordRules(formData.password).every((r) => r.valid)
      )
        return;

      if (formData.password !== formData.confirmPassword) {
        setErrors((prev) => ({
          ...prev,
          confirmPassword: 'Les mots de passe ne correspondent pas',
        }));
        return;
      }
      setStep(3);
      return;
    }

    if (!formData.profileImageId) {
      showSnackbar({
        message: 'Veuillez choisir une photo de profil',
        severity: 'error',
      });
      return;
    }

    register(formData, navigate);
  };

  const handleChange = (e: SyntheticEvent) => {
    const input = e.target as HTMLInputElement;
    const name = input.name as keyof RegisterFormData;
    const value = input.value;

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (
      name === 'password' &&
      errors.confirmPassword &&
      value === formData.confirmPassword
    )
      setErrors((prev) => ({ ...prev, confirmPassword: undefined }));

    if (name === 'password')
      setFormData((prev) => ({ ...prev, confirmPassword: '' }));
  };

  const handleSpecialtyChange = (_: SyntheticEvent, e: SpecialtyDto | null) => {
    setSelectedSpecialty(e);
    setFormData((prev) => ({
      ...prev,
      specialtyId: e?.id ?? null,
    }));
    if (errors.specialtyId && e)
      setErrors((prev) => ({ ...prev, specialtyId: undefined }));
  };

  const handleBack = () => {
    setStep((prev) => prev - 1);
  };

  useEffect(() => {
    getSpecialties();
  }, [getSpecialties]);

  const handleAvatarClick = () => {
    let selectedImage: ProfilePicture | null = null;

    const onSelect = (image: ProfilePicture | null) => {
      selectedImage = image;
    };

    const onConfirm = (close: () => void) => {
      if (!selectedImage) return;
      setChosenImage(selectedImage);
      setFormData((prev) => ({
        ...prev,
        profileImageId: selectedImage!.idImage,
      }));
      close();
      showSnackbar({
        message: 'Image de profil choisie',
        severity: 'success',
      });
    };

    openModal(
      profilePictureModal({
        onSelect,
        onConfirm,
      }),
    );
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
        <RegisterTitle isRegistering={isRegistering} step={step} />
        {!isRegistering && (
          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            {step === 1 ? (
              <Step1
                formData={formData}
                specialties={specialties}
                loading={loading}
                selectedSpecialty={selectedSpecialty}
                handleChange={handleChange}
                handleSpecialtyChange={handleSpecialtyChange}
                errors={errors}
              />
            ) : step === 2 ? (
              <Step2
                formData={formData}
                handleChange={handleChange}
                errors={errors}
              />
            ) : (
              <Step3
                chosenImage={chosenImage}
                handleAvatarClick={handleAvatarClick}
              />
            )}

            <RegisterActions step={step} handleBack={handleBack} />
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
