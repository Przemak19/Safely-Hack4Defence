import { useState, useEffect } from 'react';
import { fetchIncidentById, downloadPhotoById } from '../api/api.commands';
import { type Event, mapCategoryFromApi } from '../domain/Event';

export const useEventDetail = (id: string | null) => {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const loadEventWithPhotos = async () => {
      try {
        setLoading(true);
        setError(null);

        const apiData = await fetchIncidentById(id);

        const photoPromises = apiData.photos.map(photoObj => 
          downloadPhotoById(photoObj.id)
        );
        const photoUrls = await Promise.all(photoPromises);

        const mappedEvent: Event = {
          ...apiData,
          eventCategory: mapCategoryFromApi(apiData.eventCategory),
          coordinates: {
            latitude: apiData.coordinates.latitude.toString(),
            longitude: apiData.coordinates.longitude.toString(),
          },
          photos: photoUrls.filter(url => url !== ""),
          createdAt: apiData.createdDate || new Date().toISOString(),
        };

        setEvent(mappedEvent);
      } catch (err: any) {
        console.error(err);
        setError("Nie udało się pobrać szczegółów zgłoszenia.");
      } finally {
        setLoading(false);
      }
    };

    loadEventWithPhotos();
    
    return () => {
        setEvent(prevEvent => {
            if(prevEvent && prevEvent.photos) {
                prevEvent.photos.forEach(url => URL.revokeObjectURL(url));
            }
            return null;
        });
    }

  }, [id]);

  return { event, loading, error };
};