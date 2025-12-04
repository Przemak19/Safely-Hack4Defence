import { MapContainer, TileLayer, useMapEvents, Marker, useMap, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useState, useEffect } from 'react';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const userIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const ChangeView = ({ center }: { center?: L.LatLngExpression }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center);
    }
  }, [center, map]);
  return null;
};

interface MarkerData {
    id: string;
    name: string;
    type: number;
    coordinates: {
        latitude: number;
        longitude: number;
    };
}

interface Props {
    height: string;
    onMapClick?: (coords: { latitude: number; longitude: number }) => void;
    markerPosition?: [number, number] | null;
    center?: L.LatLngExpression | undefined;
    lat?: number;
    lng?: number;
    markers?: MarkerData[];
    nearestShelter?: MarkerData | null;
    routePath?: [number, number][] | null;
    userLocation?: [number, number] | null;
}
const Map = ({ height = '400px', onMapClick, markerPosition: externalMarkerPosition, center, lat, lng, markers, nearestShelter, routePath, userLocation }: Props) => {
    const [internalMarkerPosition, setInternalMarkerPosition] = useState<[number, number] | null>(null);
    let finalMarkerPosition = externalMarkerPosition || internalMarkerPosition;
    let finalCenter = center;
    
    if (lat !== undefined && lng !== undefined) {
        finalMarkerPosition = [lat, lng];
        finalCenter = [lat, lng];
    }

    const markerPosition = finalMarkerPosition;

    const MapClickHandler = () => {
        useMapEvents({
            click: (event) => {
                if (onMapClick) {
                    const { lat, lng } = event.latlng;
                    onMapClick({ latitude: lat, longitude: lng });
                    if (!externalMarkerPosition) {
                        setInternalMarkerPosition([lat, lng]);
                    }
                }
            },
        });

        return null;
    };

  return (
    <div style={{ height, width: '100%', marginTop: '20px' }}>
      <MapContainer
        center={finalCenter}
        zoom={lat !== undefined && lng !== undefined ? 13 : (nearestShelter ? 15 : 10)}
        style={{ height: '100%', width: '100%' }}
      >
        <ChangeView center={finalCenter} />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <MapClickHandler />
        {markerPosition && <Marker position={markerPosition} />}
        {markers && markers.map((marker) => (
          <Marker 
            key={marker.id} 
            position={[marker.coordinates.latitude, marker.coordinates.longitude]} 
          >
              <Popup>
              <div>
                <strong>{marker.name}</strong><br />
                Typ: {marker.type}<br />
              </div>
            </Popup>
          </Marker>
        ))}
        {routePath && routePath.length >= 2 && (
          <Polyline
            positions={routePath}
            pathOptions={{
              color: '#2196F3',
              weight: 4,
              opacity: 0.8,
              dashArray: '10, 10'
            }}
          />
        )}
        {userLocation && (
          <Marker position={userLocation} icon={userIcon}>
            <Popup>
              <div>
                <strong>Twoja lokalizacja</strong><br />
                Punkt startowy trasy
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
};

export default Map;