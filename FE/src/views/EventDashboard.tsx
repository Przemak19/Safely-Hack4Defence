import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Import nawigacji
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Box, 
  CircularProgress, 
  Alert, 
  Container, 
  Button
} from '@mui/material';
import BuildIcon from '@mui/icons-material/Build';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

import { EventList } from '../components/EventList.tsx';
import { EventDetail } from '../components/EventDetail.tsx';
import { useEvents } from '../hooks/useEvents';

export const EventDashboard = () => {
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  
  const navigate = useNavigate();
  
  const { events, loading, error, refetch } = useEvents();

  const selectedEvent = events.find(e => e.id === selectedEventId);

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', bgcolor: 'grey.100' }}>
      <AppBar position="static" color="default" elevation={1} sx={{ bgcolor: 'white' }}>
        <Toolbar>
          <BuildIcon color="primary" sx={{ mr: 2 }} />
          
          <Typography 
            variant="h6" 
            color="text.primary" 
            component="div" 
            sx={{ fontWeight: 'bold', flexGrow: 1 }}
          >
            Panel operatora
          </Typography>

          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<PersonAddIcon />}
            onClick={() => navigate('/admin/create-user')}
            sx={{ textTransform: 'none', borderRadius: 2 }}
          >
            Dodaj użytkownika
          </Button>

        </Toolbar>
      </AppBar>

      <Box component="main" sx={{ p: 3 }}>
        {error && (
          <Container maxWidth="md" sx={{ mb: 3 }}>
            <Alert severity="error" variant="filled">
              Wystąpił błąd: {error}
            </Alert>
          </Container>
        )}

        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
             <CircularProgress size={60} />
          </Box>
        ) : (
          <>
            {selectedEventId && selectedEvent ? (
              <EventDetail 
                initialEvent={selectedEvent} 
                onBack={() => setSelectedEventId(null)}
                onRefetch={refetch}
              />
            ) : (
              <EventList 
                events={events}
                onSelectEvent={setSelectedEventId} 
              />
            )}
          </>
        )}
      </Box>
    </Box>
  );
};