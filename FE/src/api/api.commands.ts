import axios from "axios";
import type {IGeolocationAddress} from "../shared/interfaces/IAddress.interface.ts";
import type {EventFormData} from "../validation/eventValidation.ts";
import { type ApiEventResponse } from '../domain/Event.ts';
import apiClient from "./ApiClient.ts";
import ApiClient from "./ApiClient.ts";

interface Props {
    latitude: number;
    longitude: number;
}
interface AddressProps {
    streetName?: string;
    city?: string;
    state?: string;
    country?: string;
}

interface GeolocationCoordinates {
    lat: string;
    lon: string;
    display_name: string;
}

export const geocodingCoordinatesToAddress =
    ({ latitude, longitude }: Props): Promise<IGeolocationAddress> => {
        return axios
            .get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`)
            .then((response) => response.data.address as IGeolocationAddress);
    };

export const geocodingAddressToCoordinates =
    ({ streetName, city, state, country = 'Poland' }: AddressProps): Promise<GeolocationCoordinates> => {
        const addressParts = [streetName, city, state, country].filter(Boolean);
        const query = encodeURIComponent(addressParts.join(', '));
        
        return axios
            .get(`https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=1`)
            .then((response) => {
                if (response.data && response.data.length > 0) {
                    return response.data[0] as GeolocationCoordinates;
                } else {
                    throw new Error('No results found for the given address');
                }
            });
    };

export const createEvent = (data: EventFormData) => {
    return axios.post(`${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/IncidentReports`, data).then((response) => {
        return response.data;
    })
}

export const photoUpload = (file: File, incidentId: string) => {
    const formData = new FormData();
    formData.append('File', file);
    formData.append('IncidentId', incidentId);
    
    return axios.post(`${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/Photos/upload`, formData, {
    }).then((response) => {
        return response.data;
    })
}
export async function downloadPhotoById(photoId: string): Promise<string> {
  try {
    const { data } = await apiClient.get(`/Photos/${photoId}/download`, {
      responseType: "blob",
    });
    return URL.createObjectURL(data);
  } catch (error: any) {
    console.error("Błąd pobierania zdjęcia:", error);
    return "";
  }
}

export const fetchIncidents = async (): Promise<ApiEventResponse[]> => {
  const { data } = await apiClient.get<ApiEventResponse[]>('/IncidentReports');
  console.log(data);
  return data;
};

export const fetchIncidentById = async (id: string): Promise<ApiEventResponse> => {
  const { data } = await apiClient.get<ApiEventResponse>(`/IncidentReports/${id}`);
  return data;
};

export const resolveEventHandlerCommand = (eventId: string) => {
    return ApiClient.patch(`IncidentReports/${eventId}`).then((response) => response.data);
}
