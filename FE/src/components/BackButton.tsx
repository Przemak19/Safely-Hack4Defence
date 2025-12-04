import { Button, type SxProps, type Theme } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

type BackButtonProps = {
  onClick: () => void;
  label?: string;
  sx?: SxProps<Theme>;
};

export const BackButton = ({ onClick, label = "Powrót do listy", sx }: BackButtonProps) => {
  return (
    <Button 
      startIcon={<ArrowBackIcon />} 
      onClick={onClick} 
      variant="text"
      sx={{ mb: 3, textTransform: 'none', color: 'text.secondary', ...sx }} 
    >
      {label}
    </Button>
  );
};