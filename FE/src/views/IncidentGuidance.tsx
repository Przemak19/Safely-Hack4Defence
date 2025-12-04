import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { IncidentGuidance } from '../components/IncidentGuidance';
import { INCIDENTS, type IncidentType } from '../config/IncidentConfig';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

export const IncidentSuccessView = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const queryParams = new URLSearchParams(location.search);
    const type = queryParams.get('type') as IncidentType | null;

    if (!type || !INCIDENTS[type]) {
        return <Navigate to="/" replace />;
    }

    const config = INCIDENTS[type];

    const getIcon = (iconType: string) => {
        switch (iconType) {
            case 'fire': return <LocalFireDepartmentIcon />;
            case 'water': return <WaterDropIcon />;
            case 'health': return <MedicalServicesIcon />;
            default: return <WarningAmberIcon />;
        }
    };

    return (
            <IncidentGuidance
                title={config.title}
                steps={config.steps}
                color={config.color}
                type={config.type}
                icon={getIcon(config.iconType)}
                onConfirm={() => navigate('/home-page')}
            />
    );
};
