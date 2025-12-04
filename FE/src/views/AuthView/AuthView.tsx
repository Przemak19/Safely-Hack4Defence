import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { CardContent, TextField, Typography, Container } from '@mui/material';
import { loginSchema, type LoginFormData } from '../../validation/authValidation.ts';
import apiClient from '../../api/ApiClient.ts';
import { useSnackbar } from '../../hooks/useSnackbar.tsx';
import { useNavigate } from 'react-router-dom';
import { joiResolver } from '@hookform/resolvers/joi';
import { AuthViewStyles } from "./AuthView.styles.ts";
import { useAuth } from '../../context/AuthContext.tsx';

const loginHandler = async (data: LoginFormData) => {
  const response = await apiClient.post('/auth/login', data);
  return response.data;
};

const AuthView = () => {
  const { showSuccess, showError } = useSnackbar();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { checkAuth } = useAuth();
  const { CardWrapper, AuthButton, CustomCard } = AuthViewStyles;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: joiResolver(loginSchema),
    mode: 'onSubmit',
    defaultValues: { email: '', password: '' },
  });

  const onLoginSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      await loginHandler(data);
      await checkAuth();
      showSuccess('Zalogowano pomyślnie');
      navigate('/event-list');
    } catch {
      showError('Błędny email lub hasło');
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <Container maxWidth="sm">
        <CardWrapper>
          <CustomCard>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h4" component="h1" gutterBottom align="center" color="primary">
                Logowanie
              </Typography>

              <form onSubmit={handleSubmit(onLoginSubmit)}>
                <TextField
                    {...register('email')}
                    fullWidth label="Email" type="email" margin="normal"
                    error={!!errors.email} helperText={errors.email?.message}
                />
                <TextField
                    {...register('password')}
                    fullWidth label="Hasło" type="password" margin="normal"
                    error={!!errors.password} helperText={errors.password?.message}
                />
                <AuthButton type="submit" fullWidth variant="contained" loading={isLoading}>
                  Zaloguj się
                </AuthButton>
              </form>
            </CardContent>
          </CustomCard>
        </CardWrapper>
      </Container>
  );
};

export default AuthView;