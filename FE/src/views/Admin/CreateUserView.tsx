import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
    CardContent,
    TextField,
    Typography,
    Container,
    Box,
    MenuItem
} from '@mui/material';
import {
    registerSchema,
    type RegisterFormData,
    ALLOWED_ROLES
} from '../../validation/authValidation.ts';
import apiClient from '../../api/ApiClient.ts';
import { useSnackbar } from '../../hooks/useSnackbar.tsx';
import { joiResolver } from '@hookform/resolvers/joi';
import { AuthViewStyles } from "../AuthView/AuthView.styles.ts";
import { BackButton } from '../../components/BackButton.tsx';
import { useNavigate } from 'react-router-dom';

const registerUser = async (data: Omit<RegisterFormData, 'confirmPassword'>) => {
    const response = await apiClient.post('/Auth/register', data);
    return response.data;
};

const CreateUserView = () => {
    const { showSuccess, showError } = useSnackbar();
    const [isLoading, setIsLoading] = useState(false);
    const { CardWrapper, AuthButton, CustomCard } = AuthViewStyles;

    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<RegisterFormData>({
        resolver: joiResolver(registerSchema),
        mode: 'onSubmit',
        defaultValues: { email: '', password: '', confirmPassword: '', role: undefined },
    });

    const onRegisterSubmit = async (data: RegisterFormData) => {
        try {
            setIsLoading(true);

            const { confirmPassword, ...apiData } = data;

            await registerUser(apiData);

            showSuccess('Nowy użytkownik został utworzony');
            reset();
        } catch (error) {
            console.error(error);
            showError('Nie udało się utworzyć użytkownika');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container maxWidth="sm">
            <Box mt={4}>
                <BackButton onClick={() => navigate('/event-list')} />
                <CardWrapper>
                    <CustomCard>
                        <CardContent sx={{ p: 4 }}>
                            <Typography variant="h5" component="h1" gutterBottom align="center" color="primary">
                                Panel Administratora: Dodaj Użytkownika
                            </Typography>

                            <form onSubmit={handleSubmit(onRegisterSubmit)}>
                                <TextField
                                    {...register('email')}
                                    fullWidth label="Email" type="email" margin="normal"
                                    error={!!errors.email} helperText={errors.email?.message}
                                />

                                <TextField
                                    select
                                    fullWidth
                                    label="Rola użytkownika"
                                    margin="normal"
                                    defaultValue=""
                                    inputProps={register('role')}
                                    error={!!errors.role}
                                    helperText={errors.role?.message}
                                >
                                    {ALLOWED_ROLES.map((role) => (
                                        <MenuItem key={role} value={role}>
                                            {role}
                                        </MenuItem>
                                    ))}
                                </TextField>

                                <TextField
                                    {...register('password')}
                                    fullWidth label="Hasło" type="password" margin="normal"
                                    error={!!errors.password} helperText={errors.password?.message}
                                />
                                <TextField
                                    {...register('confirmPassword')}
                                    fullWidth label="Potwierdź Hasło" type="password" margin="normal"
                                    error={!!errors.confirmPassword} helperText={errors.confirmPassword?.message}
                                />

                                <AuthButton type="submit" fullWidth variant="contained" loading={isLoading}>
                                    Utwórz Użytkownika
                                </AuthButton>
                            </form>
                        </CardContent>
                    </CustomCard>
                </CardWrapper>
            </Box>
        </Container>
    );
};

export default CreateUserView;