import { Card, CardActionArea, CardContent, Typography, Box, Stack } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { type Event } from '../domain/Event.ts';

type EventCardProps = {
  event: Event;
  onClick: (id: string) => void;
};

export const EventCard = ({ event, onClick }: EventCardProps) => {
  return (
    <Card sx={{ mb: 2, borderRadius: 2 }} elevation={1}>
      <CardActionArea onClick={() => onClick(event.id)}>
        <CardContent>
            <Box display="flex" flexDirection="column" mb={1}>
                <Box display="flex" alignItems="center">
                    <Typography variant="overline" color="primary" fontWeight="bold">
                        {event.eventCategory}
                    </Typography>
                    {event.incidentStatus === 4 && <Typography
                        variant="overline"
                        color="red"
                        fontWeight="bold"
                        sx={{ marginLeft: 'auto' }}
                    >
                        Rozwiązano
                    </Typography>}
                </Box>
                <Typography variant="h6" component="div">
                    {event.firstName} {event.lastName}
                </Typography>
            </Box>

          <Stack direction="row" alignItems="center" spacing={0.5} mb={1}>
            <LocationOnIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              {event.streetName}, {event.city}
            </Typography>
          </Stack>

          <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
             <Typography variant="caption" sx={{ bgcolor: 'grey.100', px: 1, py: 0.5, borderRadius: 1 }}>
               ID: {event.id}
             </Typography>
             
             <Stack direction="row" alignItems="center" spacing={0.5}>
                <CalendarTodayIcon fontSize="small" sx={{ fontSize: 14, color: 'text.disabled' }} />
                <Typography variant="caption" color="text.disabled">
                  {new Date(event.createdAt).toLocaleDateString()}
                </Typography>
             </Stack>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};