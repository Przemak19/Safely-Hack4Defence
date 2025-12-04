import { useState } from 'react';
import {
    Container, Grid, Typography, Button, Paper, Box, Divider, Stack, Chip, CircularProgress, ImageList, ImageListItem,
    IconButton
} from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';

import { type Event } from '../domain/Event.ts';
import { useEventDetail } from '../hooks/useEventDetail';
import Map from '../components/Map.tsx';
import { PhotoViewer } from './PhotoViewer.tsx';
import { useSnackbar } from "../hooks/useSnackbar.tsx";
import { resolveEventHandlerCommand } from "../api/api.commands.ts";
import { BackButton } from './BackButton';

type EventDetailProps = {
  initialEvent: Event;
  onBack: () => void;
  onRefetch: () => void;
};

export const EventDetail = ({ initialEvent, onBack, onRefetch }: EventDetailProps) => {
  const [viewedPhoto, setViewedPhoto] = useState<string | null>(null);
  const { showError, showSuccess } = useSnackbar();

  const { event: fullEvent, loading } = useEventDetail(initialEvent.id);

  const event = fullEvent || initialEvent;

  const lat = parseFloat(event.coordinates.latitude);
  const lng = parseFloat(event.coordinates.longitude);

  const resolveEventHandler = async () => {
      try {
          await resolveEventHandlerCommand(event.id);
          onBack();
          onRefetch();
          showSuccess('Rozwiązano pomyślnie');
      } catch (e) {
          showError('Wystapił błąd podczas rozwiązywania zgłoszenia');
      }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <BackButton onClick={onBack} />

      <Grid container spacing={3}>
        
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper elevation={0} variant="outlined" sx={{ p: 3, borderRadius: 3 }}>

            <Box mb={2}>
              <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                 <Chip 
                  label={event.eventCategory} 
                  color="primary" 
                  size="small" 
                  variant="outlined" 
                  sx={{ mb: 1 }} 
                />
                 {event.incidentStatus === 4 &&   <Chip
                      label="Rozwiązano"
                      color="error"
                      size="small"
                      variant="outlined"
                      sx={{ mb: 1 }}
                  />}

                {loading && <CircularProgress size={20} />}
              </Box>
             
              <Typography variant="h4" fontWeight="bold">
                {event.firstName} {event.lastName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                ID Zgłoszenia: {event.id}
              </Typography>
            </Box>
              {event.incidentStatus !== 4 && <Button onClick={resolveEventHandler}>Rozwiąż zgłoszenie</Button>}
            <Divider sx={{ my: 3 }} />

            <Box mb={4}>
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <AssignmentIcon color="action" />
                <Typography variant="subtitle1" fontWeight="bold" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                  Opis Zdarzenia
                </Typography>
              </Box>
              <Paper sx={{ p: 2, bgcolor: 'grey.50' }} elevation={0}>
                <Typography variant="body1" lineHeight={1.7}>
                  {event.eventDescription}
                </Typography>
              </Paper>
            </Box>

            <Grid container spacing={2} mb={4}>
              <Grid size={{ xs: 12, md: 6 }}>
                 <InfoItem 
                   icon={ <IconButton
                       edge="end"
                       aria-label="zadzwoń"
                       component="a"
                       href={`tel:${event.phoneNumber}`}
                       color="success"
                   >
                       <PhoneIcon />
                   </IconButton>}
                   label="Telefon" 
                   value={event.phoneNumber} 
                 />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <InfoItem 
                   icon={<CalendarTodayIcon color="primary" />} 
                   label="Data Zgłoszenia" 
                   value={new Date(event.createdAt).toLocaleString()} 
                 />
              </Grid>
            </Grid>

            {event.photos && event.photos.length > 0 && (
                <>
                    <Divider sx={{ my: 3 }} />
                    <Box>
                        <Box display="flex" alignItems="center" gap={1} mb={2}>
                            <PhotoCameraIcon color="action" />
                            <Typography variant="subtitle1" fontWeight="bold" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                            Załączone Zdjęcia
                            </Typography>
                        </Box>
                        <ImageList cols={3} rowHeight={160} gap={8}>
                            {event.photos.map((photoUrl, index) => (
                                <ImageListItem 
                                    key={index}
                                    onClick={() => setViewedPhoto(photoUrl)}
                                    sx={{ 
                                        cursor: 'pointer',
                                    }}
                                >
                                    <img
                                        src={photoUrl}
                                        alt={`Dowód ${index + 1}`}
                                        loading="lazy"
                                        style={{ borderRadius: 8, height: '100%', objectFit: 'cover' }}
                                    />
                                </ImageListItem>
                            ))}
                        </ImageList>
                    </Box>
                </>
            )}
            
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 3, position: 'sticky', top: 24 }}>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
               <LocationOnIcon color="error" />
               <Typography variant="h6" fontWeight="bold">
                 Lokalizacja
               </Typography>
            </Box>
            
            <Box mb={2}>
              <Typography variant="subtitle1" fontWeight="medium">
                {event.streetName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {event.city}, {event.state}
              </Typography>
            </Box>

            {!isNaN(lat) && !isNaN(lng) ? (
              <Map lat={lat} lng={lng} height="300px" />
            ) : (
              <Box p={2} bgcolor="grey.100" textAlign="center" borderRadius={1}>
                <Typography variant="caption" color="error">
                  Błędne koordynaty GPS
                </Typography>
              </Box>
            )}

            <Box mt={2} display="flex" justifyContent="space-between">
                <Typography variant="caption" color="text.disabled">Lat: {lat.toFixed(6)}</Typography>
                <Typography variant="caption" color="text.disabled">Lng: {lng.toFixed(6)}</Typography>
            </Box>
          </Paper>
        </Grid>

      </Grid>

      <PhotoViewer 
        open={!!viewedPhoto} 
        src={viewedPhoto} 
        onClose={() => setViewedPhoto(null)} 
      />

    </Container>
  );
};

const InfoItem = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) => (
  <Stack direction="row" spacing={2} alignItems="center">
    <Box sx={{ p: 1, bgcolor: 'primary.50', borderRadius: '50%' }}>
      {icon}
    </Box>
    <Box>
      <Typography variant="caption" display="block" color="text.secondary" sx={{ textTransform: 'uppercase' }}>
        {label}
      </Typography>
      <Typography variant="body1" fontWeight="medium">
        {value}
      </Typography>
    </Box>
  </Stack>
);