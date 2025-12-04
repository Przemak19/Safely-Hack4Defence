import { type ReactNode } from 'react';
import { Paper, Typography, Box, List, ListItem, ListItemIcon, ListItemText, Button, Divider } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import AirThreatMap from "./AirThreatMap.tsx";
import type {IncidentType} from "../config/IncidentConfig.ts";

interface IncidentGuidanceProps {
    title: string;
    steps: string[];
    icon: ReactNode;
    color: string;
    type: IncidentType;
    onConfirm: () => void;
}

export const IncidentGuidance = ({title, steps, icon, color, onConfirm, type}: IncidentGuidanceProps) => {
    return (
        <Paper
            elevation={4}
            sx={{
                p: 4,
                maxWidth: 600,
                mx: 'auto',
                mt: 5,
                borderRadius: 3,
                borderTop: `8px solid ${color}`,
            }}
        >
            <Box display="flex" alignItems="center" mb={3} gap={2}>
                <Box sx={{ color: color, '& svg': { fontSize: 48 } }}>
                    {icon}
                </Box>
                <Typography variant="h4" component="h1" fontWeight="800" color="text.primary">
                    {title}
                </Typography>
            </Box>

            <Divider sx={{ mb: 3 }} />

            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'text.secondary' }}>
                Procedura postępowania:
            </Typography>

            <List>
                {steps.map((step, index) => (
                    <ListItem key={index} disableGutters sx={{ alignItems: 'flex-start', py: 1 }}>
                        <ListItemIcon sx={{ minWidth: 40, mt: 0.5, color: color }}>
                            <CheckCircleOutlineIcon />
                        </ListItemIcon>
                        <ListItemText
                            primary={step}
                            primaryTypographyProps={{ fontSize: '1.1rem', fontWeight: 500 }}
                        />
                    </ListItem>
                ))}
            </List>

            {type === 'air_threat' && <AirThreatMap/>}

            <Box mt={5} display="flex" justifyContent="flex-end">
                <Button
                    variant="contained"
                    onClick={onConfirm}
                    size="large"
                    sx={{
                        bgcolor: color,
                        px: 4, py: 1.5, fontSize: '1rem',
                        '&:hover': { bgcolor: color, filter: 'brightness(0.85)' }
                    }}
                >
                    Zrozumiałem
                </Button>
            </Box>
        </Paper>
    );
};