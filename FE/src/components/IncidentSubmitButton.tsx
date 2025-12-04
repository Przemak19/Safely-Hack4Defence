    import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { INCIDENTS, type IncidentType } from '../config/IncidentConfig';
import SendIcon from '@mui/icons-material/Send';

interface IncidentButtonProps {
    type: IncidentType;
    fullWidth?: boolean;
}

export const IncidentButton = ({ type, fullWidth = false }: IncidentButtonProps) => {
    const navigate = useNavigate();
    const config = INCIDENTS[type];

    const handleClick = () => {
        navigate('/incident-guidance', {
            state: { type: type }
        });
    };

    return (
        <Button
            variant="contained"
            size="large"
            onClick={handleClick}
            endIcon={<SendIcon />}
            fullWidth={fullWidth}
            sx={{
                bgcolor: config.color,
                fontWeight: 'bold',
                p: 2,
                '&:hover': {
                    bgcolor: config.color,
                    filter: 'brightness(0.8)'
                }
            }}
        >
            {config.buttonLabel}
        </Button>
    );
};