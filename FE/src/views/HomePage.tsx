import { useNavigate } from 'react-router-dom';
import {
    Box,
    Container,
    Typography,
    Card,
    CardContent,
    CardActionArea,
    Stack,
    Button,
    Paper
} from '@mui/material';
import { INCIDENTS, type IncidentType } from '../config/IncidentConfig';

import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import AddAlertIcon from '@mui/icons-material/AddAlert';

export const HomePage = () => {
    const navigate = useNavigate();

    const getIcon = (iconType: string) => {
        switch (iconType) {
            case 'fire': return <LocalFireDepartmentIcon fontSize="large" />;
            case 'water': return <WaterDropIcon fontSize="large" />;
            case 'health': return <MedicalServicesIcon fontSize="large" />;
            default: return <WarningAmberIcon fontSize="large" />;
        }
    };

    const handleNavigateToGuidance = (type: string) => {
        navigate(`/incident-guidance?type=${type}`);
    };

    return (
        <Container maxWidth="lg" sx={{ py: 5 }}>

            <Box mb={5} textAlign="center">
                <Typography
                    variant="h3"
                    component="h1"
                    fontWeight="800"
                    color="primary"
                    gutterBottom
                >
                    Centrum Bezpieczeństwa
                </Typography>
            </Box>

            <Paper
                elevation={0}
                variant="outlined"
                sx={{ p: 3, mb: 5, borderRadius: 3, bgcolor: '#fff4f4', border: '1px dashed #d32f2f' }}
            >
                <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    alignItems="center"
                    justifyContent="space-between"
                    gap={2}
                >
                    <Box>
                        <Typography variant="h6" fontWeight="bold" color="error">
                            Szybka reakcja
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Jesteś świadkiem zdarzenia? Zgłoś to natychmiast odpowiednim służbom.
                        </Typography>
                    </Box>

                    <Button
                        variant="contained"
                        color="error"
                        size="large"
                        startIcon={<AddAlertIcon />}
                        onClick={() => navigate('/')}
                        sx={{
                            px: 4,
                            py: 1.5,
                            fontWeight: 'bold',
                            borderRadius: 2,
                            boxShadow: 4,
                            whiteSpace: 'nowrap'
                        }}
                    >
                        Utwórz zgłoszenie
                    </Button>
                </Stack>
            </Paper>

            <Box mb={3}>
                <Stack direction="row" alignItems="center" gap={1.5} mb={1}>
                    <WarningAmberIcon color="secondary" sx={{ fontSize: 28 }} />
                    <Typography variant="h5" fontWeight="bold">
                        Procedury Alarmowe
                    </Typography>
                </Stack>
                <Typography variant="body2" color="text.secondary">
                    Wybierz typ zagrożenia, aby wyświetlić szczegółową instrukcję.
                </Typography>
            </Box>

            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                        xs: '1fr',
                        sm: '1fr 1fr',
                        md: '1fr 1fr 1fr'
                    },
                    gap: 3
                }}
            >
                {(Object.keys(INCIDENTS) as IncidentType[]).map((key) => {
                    const config = INCIDENTS[key];

                    return (
                        <Card
                            key={key}
                            elevation={2}
                            sx={{
                                height: '100%',
                                borderRadius: 3,
                                transition: 'transform 0.2s',
                                borderTop: `6px solid ${config.color}`,
                                '&:hover': {
                                    transform: 'translateY(-5px)',
                                    boxShadow: 6
                                },
                            }}
                        >
                            <CardActionArea
                                onClick={() => handleNavigateToGuidance(key)}
                                sx={{ height: '100%', p: 2, display: 'flex', flexDirection: 'column', alignItems: 'stretch', justifyContent: 'flex-start' }}
                            >
                                <CardContent sx={{ textAlign: 'center' }}>

                                    <Box
                                        sx={{
                                            color: config.color,
                                            mb: 2,
                                            display: 'inline-flex',
                                            p: 2,
                                            borderRadius: '50%',
                                            bgcolor: `${config.color}15`
                                        }}
                                    >
                                        {getIcon(config.iconType)}
                                    </Box>

                                    <Typography variant="h6" component="div" gutterBottom fontWeight="700">
                                        {config.title}
                                    </Typography>

                                    <Typography variant="body2" color="text.secondary">
                                        {config.steps.length} kroki postępowania.
                                    </Typography>

                                </CardContent>

                                <Box mt="auto" pt={2} display="flex" justifyContent="center">
                                    <Typography variant="button" color={config.color} fontWeight="bold" fontSize="0.85rem">
                                        Zobacz procedurę &rarr;
                                    </Typography>
                                </Box>

                            </CardActionArea>
                        </Card>
                    );
                })}
            </Box>
        </Container>
    );
};

export default HomePage;