import { Container, Typography, Box } from '@mui/material';
import { BarChart } from '@mui/x-charts';
import { EventCard } from './EventCard';
import { type Event } from '../domain/Event.ts';

type EventListProps = {
    events: Event[];
    onSelectEvent: (id: string) => void;
};

export const EventList = ({ events, onSelectEvent }: EventListProps) => {

    const getHourlyEventStats = (events: Event[]) => {
        const now = new Date();
        const hoursArray = Array.from({ length: 24 }, (_, i) => {
            const date = new Date(now.getTime() - (23 - i) * 60 * 60 * 1000);
            return date;
        });

        const counts = hoursArray.map(hourDate => {
            return events.filter(e => {
                const evDate = new Date(e.createdAt);
                return evDate >= new Date(now.getTime() - 24 * 60 * 60 * 1000) &&
                    evDate.getHours() === hourDate.getHours() &&
                    evDate.getDate() === hourDate.getDate() &&
                    evDate.getMonth() === hourDate.getMonth() &&
                    evDate.getFullYear() === hourDate.getFullYear();
            }).length;
        });

        const hourLabels = hoursArray.map(d => d.getHours().toString().padStart(2, '0') + ':00');

        return { hourLabels, counts };
    };

    const { hourLabels, counts } = getHourlyEventStats(events);

    if (events.length === 0) {
        return (
            <Container maxWidth="md" sx={{ py: 4, textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary">
                    Brak zgłoszeń do wyświetlenia.
                </Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ py: 0 }}>
            <Typography variant="h4" component="h1" gutterBottom fontWeight="bold" sx={{ mb: 4 }}>
                Zgłoszenia
            </Typography>

            <Box sx={{ mb: 4 }}>
                <Typography variant="h6" gutterBottom>
                    Liczba incydentów w ostatnich 24 godzinach
                </Typography>

                <BarChart
                    height={300}
                    xAxis={[{
                        id: 'hours',
                        data: hourLabels,
                        scaleType: 'band',
                        label: 'Godzina'
                    }]}
                    series={[
                        {
                            data: counts,
                            label: 'Incydenty',
                            color: '#4caf50'
                        }
                    ]}
                />
            </Box>

            <Box>
                {events.map((event) => (
                    <EventCard
                        key={event.id}
                        event={event}
                        onClick={onSelectEvent}
                    />
                ))}
            </Box>
        </Container>
    );
};
