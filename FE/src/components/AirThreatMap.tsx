import {AirThreatApi} from "../api/AirThreat.api.ts";
import Map from "./Map.tsx";
import GlobalSpinner from "../shared/components/GlobalSpinner.tsx";
import {Button} from "@mui/material";
import {useState} from "react";
import {useSnackbar} from "../hooks/useSnackbar.tsx";
import {getDistance} from "geolib";

interface MarkerData {
    id: string;
    name: string;
    type: number;
    coordinates: {
        latitude: number;
        longitude: number;
    };
}

const AirThreatMap = () => {
    const {data, isLoading} = AirThreatApi.useGetSafePlaces();
    const [mapCenter, setMapCenter] = useState<[number, number]>([52.237049, 21.017532]);
    const [nearestShelter, setNearestShelter] = useState<MarkerData | null>(null);
    const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
    const [routePath, setRoutePath] = useState<[number, number][] | null>(null);
    const {showError, showSuccess} = useSnackbar();

    const calculateDistance = (
        lat1: number,
        lon1: number,
        lat2: number,
        lon2: number
    ): number => {
        const distanceInMeters = getDistance(
            { latitude: lat1, longitude: lon1 },
            { latitude: lat2, longitude: lon2 }
        );
        return distanceInMeters / 1000;
    };

    const findNearestShelter = () => {
        if (!navigator.geolocation) {
            showError('Geolokalizacja nie jest wspierana przez Twoją przeglądarkę');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                
                if (!data || data.length === 0) {
                    showError('Brak dostępnych schronów');
                    return;
                }

                let nearest = data[0];
                let minDistance = calculateDistance(
                    latitude, longitude,
                    nearest.coordinates.latitude, nearest.coordinates.longitude
                );

                data.forEach((shelter: MarkerData) => {
                    const distance = calculateDistance(
                        latitude, longitude,
                        shelter.coordinates.latitude, shelter.coordinates.longitude
                    );
                    if (distance < minDistance) {
                        minDistance = distance;
                        nearest = shelter;
                    }
                });

                const userPos: [number, number] = [latitude, longitude];
                const shelterPos: [number, number] = [nearest.coordinates.latitude, nearest.coordinates.longitude];
                
                setUserLocation(userPos);
                setNearestShelter(nearest);
                setRoutePath([userPos, shelterPos]);
                setMapCenter([nearest.coordinates.latitude, nearest.coordinates.longitude]);
                showSuccess(`Znaleziono najbliższy schron: ${nearest.name} (${minDistance.toFixed(2)} km)`);
            },
            (error) => {
                showError('Nie udało się pobrać lokalizacji');
                console.error(error);
            },
            { enableHighAccuracy: true }
        );
    };
    
    if (isLoading) {
        return <GlobalSpinner/>;
    }
    
    return (
        <>
            <Button variant="contained" onClick={findNearestShelter}>
                Znajdź najbliższy schron
            </Button>
            <Map
                height="500px"
                markers={data}
                center={mapCenter}
                nearestShelter={nearestShelter}
                routePath={routePath}
                userLocation={userLocation}
            />
        </>
    );
};

export default AirThreatMap;