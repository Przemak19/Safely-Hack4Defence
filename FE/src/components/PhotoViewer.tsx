import { Dialog, IconButton, Box, Slide } from '@mui/material';
import { type TransitionProps } from '@mui/material/transitions';
import CloseIcon from '@mui/icons-material/Close';
import React from 'react';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

type PhotoViewerProps = {
  open: boolean;
  src: string | null;
  onClose: () => void;
};

export const PhotoViewer = ({ open, src, onClose }: PhotoViewerProps) => {
  if (!src) return null;

  return (
    <Dialog
      fullScreen={false}
      maxWidth="xl"
      open={open}
      onClose={onClose}
      TransitionComponent={Transition}
      PaperProps={{
        sx: {
          bgcolor: 'transparent',
          boxShadow: 'none',
          overflow: 'hidden',
          m: 1
        }
      }}
      slotProps={{
        backdrop: {
            sx: { backgroundColor: 'rgba(0, 0, 0, 0.9)' }
        }
      }}
    >
      <Box position="relative" display="flex" justifyContent="center" alignItems="center">
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            top: 10,
            right: 10,
            color: 'white',
            bgcolor: 'rgba(0,0,0,0.5)',
            zIndex: 10,
            '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' }
          }}
        >
          <CloseIcon />
        </IconButton>

        <img
          src={src}
          alt="Podgląd"
          style={{
            maxWidth: '100%',
            maxHeight: '90vh', 
            objectFit: 'contain',
            borderRadius: '4px',
            display: 'block'
          }}
        />
      </Box>
    </Dialog>
  );
};