import { useState, useEffect, useCallback } from 'react';
import { fetchIncidents } from '../api/api.commands';
import { type Event, mapCategoryFromApi } from '../domain/Event';

export const useEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const apiData = await fetchIncidents();

      const mappedEvents: Event[] = apiData.map((item) => ({
        ...item,

        eventCategory: mapCategoryFromApi(item.eventCategory),

        coordinates: {
          latitude: item.coordinates.latitude.toString(),
          longitude: item.coordinates.longitude.toString(),
        },

        photos: [], 

        createdAt: item.createdDate || new Date().toISOString(),
          incidentStatus: item.incidentStatus || 0,
      }));

      setEvents(mappedEvents);
    } catch (err: any) {
      setError(err.message || 'Błąd podczas pobierania zgłoszeń');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const refetch = useCallback(() => {
    loadEvents();
  }, [loadEvents]);

  return { events, loading, error, refetch };
};