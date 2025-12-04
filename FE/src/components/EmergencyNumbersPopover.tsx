import { 
  Popover, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Typography, 
  Box, 
  Divider,
  IconButton 
} from '@mui/material';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import LocalPoliceIcon from '@mui/icons-material/LocalPolice';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import SecurityIcon from '@mui/icons-material/Security';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import PhoneIcon from '@mui/icons-material/Phone';

interface Props {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
}

const emergencyUnits = [
  {
    name: 'Pogotowie',
    number: '999',
    icon: <MedicalServicesIcon color="error" />,
  },
  {
    name: 'Straż Pożarna',
    number: '998',
    icon: <LocalFireDepartmentIcon color="error" />,
  },
  {
    name: 'Policja',
    number: '997',
    icon: <LocalPoliceIcon color="info" />,
  },
  {
    name: 'SKW',
    subtitle: '(Służba Kontrwywiadu Wojskowego)',
    number: '261 841 005',
    icon: <MilitaryTechIcon color="success" />,
  },
  {
    name: 'CBZC',
    subtitle: '(Cyberprzestępczość)',
    number: '47 72 136 99',
    icon: <SecurityIcon sx={{ color: 'text.primary' }} />,
  },
];

export const EmergencyNumbersPopover = ({ anchorEl, open, onClose }: Props) => {
  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      PaperProps={{
        sx: { width: 320, p: 1, borderRadius: 1 }
      }}
    >
      <Typography variant="h6" gutterBottom fontWeight="bold" align="center">
        Numery Alarmowe
      </Typography>
      <Typography variant="caption" display="block" align="center" color="text.secondary" gutterBottom>
        Szybki kontakt z jednostkami
      </Typography>
      
      <Divider sx={{ my: 1 }} />

      <List dense>
        {emergencyUnits.map((unit) => {
          const cleanNumber = unit.number.replace(/\s/g, '');
          
          return (
            <ListItem 
              key={unit.name} 
              disablePadding 
 
              secondaryAction={
                <IconButton 
                  edge="end" 
                  aria-label="zadzwoń"
                  component="a"          
                  href={`tel:${cleanNumber}`}
                  color="success"
                >
                  <PhoneIcon />
                </IconButton>
              }
            >
              <ListItemIcon sx={{ minWidth: 40, fontSize: '1.5rem' }}>
                {unit.icon}
              </ListItemIcon>
              
              <ListItemText
                primary={
                  <Typography variant="subtitle2" fontWeight="bold">
                    {unit.name}
                  </Typography>
                }
                secondary={
                  <>
                    {unit.subtitle && <Typography variant="caption" display="block">{unit.subtitle}</Typography>}
                    <Typography 
                      component="span" 
                      variant="body2" 
                      color="text.primary" 
                      fontWeight="bold" 
                      sx={{ fontSize: '1.1rem', letterSpacing: 1 }}
                    >
                      {unit.number}
                    </Typography>
                  </>
                }
              />
            </ListItem>
          );
        })}
      </List>
      
      <Box mt={1} bgcolor="error.50" p={1} borderRadius={1} textAlign="center">
        <Typography variant="caption" color="error" fontWeight="bold">
          Numer ratunkowy ogólny: 112
        </Typography>
      </Box>
    </Popover>
  );
};